
/**
 * import dotenv agar app bisa menggunakan variabel dari file .env
 */
require('dotenv').config();
// import 'reflect-metadata';

/**
 * import http dan express.js
 */
import https from "http";
import express from "express";

/**
 * import utility applyMiddleware dan applyRoutes
 * applyMiddleware() untuk apply middleware yang di definisikan di dalam folder middleware
 * applyRoutes() menjalankan route yang di definisikan di dalam folder services
 */
import { applyMiddleware, applyServices, applySkills } from "./utils";

/**
 * import middleware
 */
import commonMiddleware from "./middleware/common";
import errorHandlers from "./middleware/error_handler";

/**
 * import routes
 */
import services from "./services";
import skills from "./skill_apis"
import { createConnection } from 'typeorm';
import response_helper from "./middleware/response_helper";
import weather from "./skill_apis/weather/resource";

/**
 * close seluruh app ketika unchaughtException terdeteksi
 */
process.on("uncaughtException", e => {
    // TODO: ganti dengan logger
    console.log(e);
    process.exit(1);
});

/**
 * close seluruh app ketika unhandledRejection terdeteksi
 */
process.on("unhandledRejection", e => {
    // TODO: ganti dengan logger
    console.log(e);
    process.exit(1);
});

const expressApp = express();                    // instansiasi express.js
applyMiddleware(commonMiddleware, expressApp);   // apply common middleware
applyMiddleware(response_helper, expressApp);   // apply common middleware
applyServices(services, expressApp);             // apply route
applySkills(skills, expressApp);             // apply route
applyMiddleware(errorHandlers, expressApp);      // apply errorHandler

/**
 * ambil variabel PORT dari .env
 */
const { PORT = 3000 } = process.env;

/**
 * instantiasi server dengan express
 */
const server = https.createServer(expressApp);

/**
 * jalankan server sesuai port di .env
 */
createConnection().then(() => {
    server.listen(PORT, () =>
        console.log(`Server is running http://localhost:${PORT}...`)
    );

    weather.get()
        .then(() => {
            const oneDayInMs: number = 86400000;
            setInterval(() => weather.get(), oneDayInMs);
        });

}).catch(e => {
    console.log(e);
});