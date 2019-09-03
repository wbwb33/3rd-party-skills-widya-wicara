import { Request, Response, NextFunction, Router } from "express";

const handle404Error = (router: Router) => {
    router.use((req: Request, res: Response, next: NextFunction) => {
        res.status(404).send({ "error": `route ${req.path} not found` });
    });
};

const handleServerError = (router: Router) => {
    router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err);
        if (process.env.NODE_ENV === "production") {
            res.status(500).send({ "message": "internal server error" });
        } else {
            res.status(500).send(err.stack);
        }
    });
};

export default [handle404Error, handleServerError];