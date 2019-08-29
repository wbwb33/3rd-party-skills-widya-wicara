/**
 * import dotenv agar app bisa menggunakan variabel dari file .env
 */
require('dotenv').config();

/**
 * import http dan express.js
 */
import http from "http";
import express, { Response, Request, NextFunction, Router } from "express";

/**
 * import utility applyMiddleware dan applyRoutes
 * applyMiddleware() untuk apply middleware yang di definisikan di dalam folder middleware
 * applyRoutes() menjalankan route yang di definisikan di dalam folder services
 */
import { applyMiddleware, applyServices } from "./utils";

/**
 * import middleware
 */
import commonMiddleware from "./middleware/common";
import errorHandlers from "./middleware/error_handler";

/**
 * import routes
 */
import routes from "./services";
// import { NextFunction } from "connect";

/**
 * restart seluruh app ketika unchaughtException terdeteksi
 */
process.on("uncaughtException", e => {
    // TODO: ganti dengan logger
    console.log(e);
    process.exit(1);
});

/**
 * restart seluruh app ketika unhandledRejection terdeteksi
 */
process.on("unhandledRejection", e => {
    // TODO: ganti dengan logger
    console.log(e);
    process.exit(1);
});

const router = express.Router();

router.get('/test', async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send({ "test": "hello", "test2": "world", "test3": "hello", "test4": "world", })
    return next()
});

const expressApp = express();                    // instansiasi express.js
applyMiddleware(commonMiddleware, expressApp);   // apply common middleware
applyServices(routes, expressApp);               // apply route
expressApp.use(router);
applyMiddleware(errorHandlers, expressApp);      // apply errorHandler


/**
 * ambil variabel PORT dari .env
 */
const { PORT = 3000 } = process.env;

/**
 * instantiasi server dengan express
 */
const server = http.createServer(expressApp);

/**
 * jalankan server sesuai port di .env
 */
server.listen(PORT, () =>
    console.log(`Server is running http://localhost:${PORT}...`)
);