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

/**
 * ambil variabel PORT dari .env
 */
const { PORT = 3000 } = process.env;

/**
 * instantiasi server dengan express
 */
const server = http.createServer(expressApp);

/**
 * get weather and set cron job every at --:--
 */
weather.get();
cron.schedule('* 12 * * *', () => {
  // tslint:disable-next-line: no-console
  console.log('running a task 9:40');
  weather.get();
});

/**
 * jalankan server sesuai port di .env
 */
server.listen(PORT, () =>
  // tslint:disable-next-line: no-console
  console.log(`Server is running http://localhost:${PORT}...`),
);
