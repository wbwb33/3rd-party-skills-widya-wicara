import { Request, Response, NextFunction, Router } from "express";
import * as ErrHandler from "../utils/error_handler";

const handle404Error = (router: Router) => {
    router.use((req: Request, res: Response) => {
        ErrHandler.notFoundError();
    });
};

const handleClientError = (router: Router) => {
    router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        ErrHandler.clientError(err, res, next);
    });
};

const handleServerError = (router: Router) => {
    router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        ErrHandler.serverError(err, res, next);
    });
};

export default [handle404Error, handleClientError, handleServerError];