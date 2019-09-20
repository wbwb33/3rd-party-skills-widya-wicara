import { Request, Response, NextFunction } from "express";
require('dotenv').config();

/**
 * Scope function digunakan untuk membatasi route agar hanya bisa di akses
 * saat Development Environment
 */
export const Scope = {

    development() {
        return function (req: Request, res: Response, next: NextFunction) {

            if (process.env.NODE_ENV === "development") {
                console.log("development route hit");
                next();
            } else {
                return res.sendNotFound(`route ${req.path} with method ${req.method} not found`);
            }
        }
    }

}
