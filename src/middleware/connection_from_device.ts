require('dotenv').config();
import { NextFunction, Response, Request } from 'express';

export const DeviceAuth = {
    /**
     * Verify Token
     * @param {object} req 
     * @param {object} res 
     * @param {object} next
     * @returns {object|void} response object 
     */
    async verifyDeviceToken(req: Request, res: Response, next: NextFunction) {

        const bearerToken = req.headers.authorization;

        if (!bearerToken) {
            return res.sendError('Device token is not provided');
        };

        const deviceToken = bearerToken.replace("Bearer ", "");

        if (deviceToken === process.env.DEVICE_TOKEN) {
            next();
        } else {
            return res.sendError('Token not valid')
        };

    }
}