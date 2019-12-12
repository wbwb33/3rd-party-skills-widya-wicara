import * as dotenv from 'dotenv';
dotenv.config();

import http from 'http';
import cron from 'cron';

import weather from './skill_apis/weather/resource';
import expressApp from './app';
import horoscope from './skill_apis/horoscope/resource';
import kuis from './skill_apis/kuis/resource';
import jadwalAdzan from './skill_apis/jadwal_salat/resource';
import hargaEmas from './skill_apis/harga_emas/resource';
import hargaPangan from './skill_apis/harga_pangan/resource';

hargaPangan.get();
/**
 * import sequelize connection and the models
 */
import { sequelize } from './sequelize';
import { TabelOne } from './db/models/tabel_one';
import { kuis_availability } from './db/models/kuis';
import { reminder } from './db/models/reminder';

/**
 * ambil variabel PORT dari .env
 */
const { PORT = 3000 } = process.env;

/**
 * instantiasi server dengan express
 */
const server = http.createServer(expressApp);

/**
 * get harga emas and set cron job every at 09:00
 */
hargaEmas.get();
new cron.CronJob('00 00 09 * * *', () => {
  hargaEmas.get();
}).start();

/**
 * get weather and set cron job every at 00:02
 */
weather.get();
new cron.CronJob('00 02 00 * * *', () => {
  weather.get();
}).start();

/**
 * get horoscope and set cron job every at 00:04
 */
horoscope.get();
new cron.CronJob('00 04 00 * * *', () => {
  horoscope.get();
}).start();

/**
 * get kuis for today and save it to db at 00.06
 */
// kuis.get();
new cron.CronJob('00 06 00 * * *', () => {
  kuis.get();
}).start();

/**
 * jalankan server sesuai port di .env
 */

const job = new cron.CronJob('00 00 01 * * *', async () => {
  try {
    const d = new Date();
    // console.log('Every 5 minutes:', d);
    await jadwalAdzan.index();
  } catch (e) {
    console.log(e);
  }
});

// import kuis_skill from './skill_apis/kuis/skill';

(async () => {
  try {
    sequelize.addModels([TabelOne, kuis_availability, reminder]);
    await sequelize.sync({ force: false });
    kuis.get();
    job.start();
  } catch (e) {
    console.log(e);
  }
})();

server.listen(PORT, () =>
  // tslint:disable-next-line: no-console
  console.log(`Server is running http://localhost:${PORT}...`),
);
