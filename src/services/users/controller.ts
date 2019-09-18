import { Request, Response } from "express";
import { getRepository, UpdateResult } from "typeorm";
import { User } from "./entity";
import { validate } from "class-validator";
import { Services } from "../base_services";

class UserController extends Services {

    /**
     * Register user 
     */
    public register = async (req: Request, res: Response) => {
        const rn = this.randomInt();
        const repo = await getRepository(User);
        const hashPassword = this.hashPassword(req.body.password);

        const user = new User();
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = hashPassword;
        user.name = req.body.name;
        user.token = rn;

        // console.log(user);
        const errors = await validate(user);

        if (errors.length > 0) {
            const err = errors.map(e => {
                const error = e.constraints;
                const property = e.property;
                return { property, error };
            });
            return res.sendError(err);
        }

        await repo.save(user)
            .then((user) => {
                const userData = { name: user.name, username: user.username, email: user.email }
                return res.sendInsertOK({ action: "register user", data: userData });
            })
            .catch((errors) => {
                console.log(errors);
                return res.sendInsertError(errors);
            });
    };

    public login = async (req: Request, res: Response) => {
        const repo = await getRepository(User);

        if (!req.body.email || !req.body.password) {
            return res.sendError('some values are missing');
        };

        try {
            const rows = await repo.createQueryBuilder("user")
                .where({ email: req.body.email })
                .addSelect("user.password")
                // .select(["user.password", "user.id"])
                .getOne();

            if (!rows) {
                return res.sendError("email not found");
            }

            if (!this.comparePassword(rows.password, req.body.password)) {
                return res.sendError("password not match");
            }

            const token = await this.generateToken(rows.id);
            const userdata = {
                userid: rows.id,
                username: rows.username,
                name: rows.name,
                email: rows.email,
                token
            };

            return res.sendOK({ action: "user login", data: userdata });

        } catch (error) {
            return res.sendError(error)
        }
    };

    public update = async (req: Request, res: Response) => {
        const id = (req as any).user.id;

        const repo = await getRepository(User);
        const currentUser = await getRepository(User).createQueryBuilder("user")
            .whereInIds(id)
            .addSelect(["user.password", "user.token"])
            .getOne();

        const hashPassword = req.body.password != null ? this.hashPassword(req.body.password) : null;

        const user = new User();
        user.id = parseInt(id);
        user.username = req.body.username || (currentUser as any).username;
        user.email = req.body.email || (currentUser as any).email;
        user.password = hashPassword || (currentUser as any).password;
        user.name = req.body.name || (currentUser as any).name;
        user.token = (currentUser as any).token;

        const errors = await validate(user);

        if (errors.length > 0) {
            const err = errors.map(e => {
                const error = e.constraints;
                const property = e.property;
                return { property, error };
            });
            return res.sendError(err);
        }

        try {
            const updateResult: UpdateResult = await repo.createQueryBuilder()
                .update(User, user)
                .whereEntity(user)
                .returning(["id", "username", "email", "name"])
                .execute();

            if (updateResult.generatedMaps.length > 0) {
                return res.sendInsertOK({ action: "update user data", data: updateResult.generatedMaps[0] });
            } else {
                return res.sendError("user not found");
            }

        } catch (error) {
            console.log(error);
            return res.sendInternalError();
        }

    };

    // destroy not implemented

    // public destroy = async (req: Request, res: Response) => {
    //     const id = (req as any).user.id;
    //     const repo = await getRepository(User);

    //     try {
    //         const delUser = await repo.createQueryBuilder("user")
    //             .delete()
    //             .from(User)
    //             .whereInIds(id)
    //             .execute();

    //         if (delUser.affected) {
    //             res.sendOK({ action: "delete user", data: `user with id: ${id} deleted` });
    //         } else {
    //             res.sendError(`user with id: ${id} not found`);
    //         }

    //     } catch (error) {
    //         return res.sendInternalError();
    //     }

    // }

}

const user = new UserController()
export default user;