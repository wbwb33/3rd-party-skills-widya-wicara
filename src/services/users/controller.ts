import { Request, Response } from "express";

const index = async (req: Request, res: Response) => {
    res.send({ "test": "hello", "test2": "world", "test3": "hello", "test4": "world", });
    res.status(200);
};

const show = async (req: Request, res: Response) => {
    res.send({ "show": "hello" })
    res.status(201);
};

export default { index };