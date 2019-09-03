import { Response, Request, NextFunction } from "express";

export abstract class Services {
    protected randomInt(): number {
        const min: number = 100000;
        const max: number = 999999;
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}