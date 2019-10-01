import { Request, Response, NextFunction, Router } from 'express';

const handle404Error = (router: Router) => {
  router.use((req: Request, res: Response, next: NextFunction) => {
    res.sendNotFound(`route ${req.path} with method ${req.method} not found`);
  });
};

const handleServerError = (router: Router) => {
  router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    // tslint:disable-next-line: no-console
    console.error(err);
    if (process.env.NODE_ENV === 'production') {
      res.sendInternalError();
    } else {
      res.status(500).send(err.stack);
    }
  });
};

export default [handle404Error, handleServerError];
