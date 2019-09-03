import { Request, Response, NextFunction } from "express";
import { getRepository } from "typeorm";
import { User } from "./entity";
import { validate } from "class-validator";
import { errorState } from "../../utils/error_state";
import { Services } from "../services";
import Helper from "../auth_services";

class UserController extends Services {

    /**
     * return user sesuai dengan ID user
     */
    public index = async (req: Request, res: Response) => {
        const user = await getRepository(User).findOne((req as any).user.id);
        return res.send(user).status(200);
    };

    /**
     * Register user 
     */
    public register = async (req: Request, res: Response) => {
        const rn = this.randomInt();
        const repo = await getRepository(User);
        const hashPassword = Helper.hashPassword(req.body.password);

        const user = new User();
        user.username = req.body.username;
        user.email = req.body.email;
        user.password = hashPassword;
        user.name = req.body.name;
        user.token = rn;
        user.method = req.body.method;
        user.googleid = req.body.googleid;

        // console.log(user);
        const errors = await validate(user);

        if (errors.length > 0) {
            const err = errors.map(e => {
                const error = e.constraints;
                const property = e.property;
                return { property, error };
            });
            return res.send(err).status(400);
        }

        await repo.save(user)
            .then((user: User) => {
                return res.send({ "message": "Berhasil add user" }).status(201);
            })
            .catch((errors) => {
                console.log(errors);
                return errorState(res, errors);
            });
    };

    public login = async (req: Request, res: Response) => {
        const repo = await getRepository(User);

        if (!req.body.email || !req.body.password) {
            return res.status(400).send({ 'message': 'Some values are missing' });
        };

        try {
            const rows = await repo.createQueryBuilder("user")
                .where({ email: req.body.email })
                .addSelect("user.password")
                .getOne();

            if (!rows) {
                return res.status(400).send({ 'error': 'Email tidak ditemukan' });
            }

            if (!Helper.comparePassword(rows.password, req.body.password)) {
                return res.status(400).send({ 'error': 'Password yang anda masukkan salah' });
            }

            const token = await Helper.generateToken(rows.id);
            return res.status(200).send({ token });

        } catch (error) {
            return res.status(400).send("error")
        }
    };

    // public destroy

}

const user = new UserController()
export default user;