import { Router, Request, Response, NextFunction } from 'express';

type Wrapper = (router: Router) => void;

export const applyMiddleware = (
  middlewareWrappers: Wrapper[],
  router: Router,
) => {
  for (const wrapper of middlewareWrappers) {
    wrapper(router);
  }
};

type Handler = (req: Request, res: Response, next: NextFunction) => void;

interface Route {
  path: string;
  method: string;
  handler: Handler | Handler[];
}

/**
 * Skills berisi route dan controller
 * @param routes
 * @param router
 */
export const applySkills = (routes: Route[], router: Router) => {
  for (const route of routes) {
    const { method, path, handler } = route;
    (router as any)[method](path, handler);
  }
};

export class Endpoint {
  private route(method: string, path: string, handler: Handler | Handler[]) {
    return { method, path, handler };
  }

  public get(path: string, handler: Handler | Handler[]): Route {
    return this.route('get', path, handler);
  }

  public post(path: string, handler: Handler | Handler[]): Route {
    return this.route('post', path, handler);
  }

  public put(path: string, handler: Handler | Handler[]): Route {
    return this.route('put', path, handler);
  }

  public delete(path: string, handler: Handler | Handler[]): Route {
    return this.route('delete', path, handler);
  }
}
