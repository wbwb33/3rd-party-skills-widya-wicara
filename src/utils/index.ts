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
) => void;

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

/**
 * Skills berisi route dan controller 
 * @param routes 
 * @param router 
 */
export const applySkills = (routes: Route[], router: Router) => {
    for (const route of routes) {
        const { method, path, handler } = route;
        (router as any)[method]("/skills" + path, handler);
    }
};

export class Endpoint {
    rootpath: string;

    constructor(rootpath: string) {
        this.rootpath = rootpath;
    }

    private route(method: string, path: string, handler: Handler | Handler[]) {
        return {
            method: method,
            path: this.rootpath + path,
            handler: handler
        }
    }

    public get(path: string, handler: Handler | Handler[]): Route {
        return this.route("get", path, handler);
    }

    public post(path: string, handler: Handler | Handler[]): Route {
        return this.route("post", path, handler);
    }

    public put(path: string, handler: Handler | Handler[]): Route {
        return this.route("put", path, handler);
    }

    public delete(path: string, handler: Handler | Handler[]): Route {
        return this.route("delete", path, handler);
    }
}
