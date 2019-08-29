import { Router, Request, Response, NextFunction } from "express";

type Wrapper = ((router: Router) => void);

export const applyMiddleware = (
    middlewareWrappers: Wrapper[],
    router: Router
) => {
    for (const wrapper of middlewareWrappers) {
        wrapper(router);
    }
};

type Handler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void> | void;

type Route = {
    path: string;
    method: string;
    handler: Handler | Handler[];
};

/**
 * Services berisi route dan controller 
 * @param routes 
 * @param router 
 */
export const applyServices = (routes: Route[], router: Router) => {
    for (const route of routes) {
        const { method, path, handler } = route;
        (router as any)[method](path, handler);
    }
};

export const route = (rootpath: string) => {
    return {
        get: (path: string, handler: Handler) => {
            return {
                method: "get",
                path: rootpath + path,
                handler: handler
            }
        },
        post: (path: string, handler: Handler) => {
            return {
                method: "post",
                path: rootpath + path,
                handler: handler
            }
        },
        put: (path: string, handler: Handler) => {
            return {
                method: "put",
                path: rootpath + path,
                handler: handler
            }
        },
        delete: (path: string, handler: Handler) => {
            return {
                method: "delete",
                path: rootpath + path,
                handler: handler
            }
        },
    }
}