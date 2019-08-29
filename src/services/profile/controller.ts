import { Request, Response } from "express";

const index = async (req: Request, res: Response) => {
    res.send({ "profile": "hello", "profile2": "world", "profile3": "hello", "profile4": "world", });
    res.status(200);
};

const show = async (req: Request, res: Response) => {
    res.send({ "show": "profile" + req.params.id })
    res.status(201);
};

export default { index, show };