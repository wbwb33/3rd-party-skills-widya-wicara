
/**
 * import dotenv agar app bisa menggunakan variabel dari file .env
 */
require('dotenv').config();

/**
 * import http
 */
import https from "https";

/**
 * import connection dependencies
 */
import { createConnection } from 'typeorm';
import weather from "./skill_apis/weather/resource";
import expressApp from "./app";

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