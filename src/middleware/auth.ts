import jwt from 'jsonwebtoken';
import { NextFunction, Response, Request } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../services/users/entity';
require('dotenv').config();

export const Auth = {
    /**
     * Verify Token
     * @param {object} req 
     * @param {object} res 
     * @param {object} next
     * @returns {object|void} response object 
     */
    async verifyToken(req: Request, res: Response, next: NextFunction) {
        const repo = await getRepository(User);

        const bearerToken = req.headers.authorization;
        // console.log(token);

        if (!bearerToken) {
            return res.status(400).send({ 'message': 'Token is not provided' });
        }

        const token = bearerToken.replace("Bearer ", "");

        try {
            const decoded = await jwt.verify(<string>token, <string>process.env.SECRET);

            const rows = await repo.findOne((decoded as any).userId);

            if (!rows) {
                return res.status(400).send({ 'message': 'The token you provided is invalid' });
            }

            // property user.id akan bisa di akses di function berikutnya
            (req as any).user = { id: (decoded as any).userId };

            next();
        } catch (error) {
            return res.status(400).send(error);
        }
    }
}