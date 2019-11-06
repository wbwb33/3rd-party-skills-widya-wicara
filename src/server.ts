/**
 * import dotenv agar app bisa menggunakan variabel dari file .env
 */
import * as dotenv from 'dotenv';
dotenv.config();

/**
 * import http
 */

import http from 'http';

/**
 * import cron job
 */
import cron from 'node-cron';

/**
 * import connection dependencies
 */
import weather from './skill_apis/weather/resource';
import expressApp from './app';
import horoscope from './skill_apis/horoscope/resource';
import kuis from './skill_apis/kuis/resource';

/**
 * ambil variabel PORT dari .env
 */
const { PORT = 3000 } = process.env;

/**
 * instantiasi server dengan express
 */
const server = http.createServer(expressApp);

/**
 * get weather and set cron job every at 12:00
 */
weather.get();
cron.schedule('0 12 * * *', () => {
  weather.get();
});

/**
 * get horoscope and set cron job every at 00:00
 */
horoscope.get();
cron.schedule('0 1 * * *', () => {
  horoscope.get();
});

/**
 * get kuis for today and save it to db
 */
kuis.get();
cron.schedule('5 0 * * *', () => {
  kuis.get();
});

/**
 * jalankan server sesuai port di .env
 */
server.listen(PORT, () =>
  // tslint:disable-next-line: no-console
  console.log(`Server is running http://localhost:${PORT}...`),
);
