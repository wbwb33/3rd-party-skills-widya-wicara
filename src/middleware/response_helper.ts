import { Router, Request, Response, NextFunction } from "express";

const response_helper = (router: Router) => {
    router.use((req: Request, res: Response, next: NextFunction) => {
        res.sendOK = (msg: { action: string, data: string | object }) => {
            res.status(200);
            return res.send({
                status: "success",
                action: msg.action,
                message: {
                    data: msg.data
                }
            })
        };

        res.sendInsertOK = (msg: { action: string, data: string | object }) => {
            res.status(201);
            return res.send({
                status: "success",
                action: msg.action,
                message: {
                    data: msg.data
                }
            })
        };

        res.sendNotModified = (msg: string | object) => {
            res.status(400);
            return res.send({
                status: "not modified",
                message: msg
            });
        };

        /**
         * send a response with statusCode: 400
         */
        res.sendError = (msg: string | object) => {
            res.status(400);
            return res.send({
                status: "error",
                message: msg
            });
        };

        res.sendInsertError = (e: { code: string, message: string, detail: string }) => {
            // set status code "400 Bad Request"
            res.status(400);
            // hilangkan string Key, tanda "()" dan ubah "=" menjadi spasi, kemudian hilangkan spasi di depan dan belakang
            const prop = e.detail.replace("Key", "").replace(/[&()]/g, '').replace("=", " ").trim();
            // set huruf pertama text menjadi Uppercase
            const property = prop.charAt(0).toUpperCase() + prop.slice(1);

            return res.send({
                status: "error",
                message: {
                    detail: `SQLSTATE[${e.code}] ` + e.message.match(/[^"]*/i)![0].trim(),
                    property: property
                }
            });
        }

        res.sendNotFound = (msg: string | object) => {
            res.status(404);
            return res.send({
                status: "error",
                message: msg
            })
        }

        res.sendInternalError = () => {
            res.status(500);
            return res.send({
                status: "internal server error"
            })
        }

        next();
    });
};

export default [response_helper]