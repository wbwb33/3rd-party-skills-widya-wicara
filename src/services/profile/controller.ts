import { Request, Response } from "express";

class Profile {
    public async index(req: Request, res: Response) {
        res.status(200);
        return res.send({ "profile": "hello", "profile2": "world", "profile3": "hello", "profile4": "world", });
    };

    public async show(req: Request, res: Response) {
        res.status(201);
        return res.send({ "show": "profile: " + req.params.id });
    };

    public async edit(req: Request, res: Response) {
        res.status(202);
        return res.send({ "edit": "yes: " + req.params.type });
    }
}

const profile = new Profile();
export default profile;