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

/** import sequelize connection and the models */
import { sequelize } from './sequelize';
import { JadwalAdzan } from './db/models/jadwal_adzan';
import { kuis_score } from './db/models/kuis';
import { kuis_score_ramadan } from './db/models/kuis_ramadhan';
import { reminder } from './db/models/reminder';

/** ambil variabel PORT dari .env */
const { PORT = 3000 } = process.env;

/** ambil variabel BASE_IGNITE dari .env */
const { BASE_IGNITE } = process.env;

/** instantiasi server dengan express */
const server = http.createServer(expressApp);

/** get harga pangan and set cron job every at 11:00 */
new cron.CronJob('00 00 11 * * *', () => {
  hargaPangan.get();
}).start();

/** get harga emas and set cron job every at 09:00 */
new cron.CronJob('00 00 09 * * *', () => {
  hargaEmas.get();
}).start();

/** get weather and set cron job every at 00:02 */
new cron.CronJob('00 02 00 * * *', () => {
  weather.get();
}).start();

/** get horoscope and set cron job every at 00:04 */
new cron.CronJob('00 04 00 * * *', () => {
  horoscope.get();
}).start();

/** get kuis for today and save it to db at 00.06 */
new cron.CronJob('00 06 00 * * *', () => {
  kuis.get();
}).start();

/** get kuis ramadan for today and save it to db at 00.08, start from 22 apr */
// const dateRamadan = new Date();
// dateRamadan.setUTCFullYear(2021, 3, 9);
// dateRamadan.setUTCHours(17);
// dateRamadan.setUTCMinutes(0);
// dateRamadan.setUTCSeconds(0);
new cron.CronJob('00 08 00 * * *', () => {
  kuis.getQuizRamadan();
}).start();

/** get jadwal adzan for today at 01.00 */
// new cron.CronJob('00 00 01 * * *', async () => {
//   try {
//     const d = new Date();
//     await jadwalAdzan.index();
//   } catch (e) {
//     console.log(e);
//   }
// });

/** ignite support */
import IgniteClient from 'apache-ignite-client';
const IgniteClientConfiguration = IgniteClient.IgniteClientConfiguration;
const onStateChanged = (state: any, reason: any) => {
  if (state === IgniteClient.STATE.CONNECTED) {
    console.log('Ignite Client is started from server');
  } else if (state === IgniteClient.STATE.CONNECTING) {
    console.log('Ignite Client is connecting from server');
  } else if (state === IgniteClient.STATE.DISCONNECTED) {
    console.log('Ignite Client is stopped from server');
    if (reason) {
      console.log(reason);
    }
  }
};

/** functions that get executed only at FIRST TIME */
(async () => {
  try {
    const igniteClient = new IgniteClient(onStateChanged);

    // await igniteClient.connect(new IgniteClientConfiguration(BASE_IGNITE));
    // !(await kuis.cacheCheckRamadan(igniteClient))
    //   ? console.log('cache kuis ramadan not exist')
    //   : console.log('cache kuis ramadan already exist');
    // !(await kuis.cacheCheck(igniteClient))
    //   ? console.log('cache kuis not exist')
    //   : console.log('cache kuis already exist');
    // !(await hargaPangan.cacheCheck(igniteClient))
    //   ? console.log('cache pangan not exist')
    //   : console.log('cache pangan already exist');
    // !(await weather.cacheCheck(igniteClient))
    //   ? console.log('cache weather not exist')
    //   : console.log('cache weather already exist');
    // !(await hargaEmas.cacheCheck(igniteClient))
    //   ? console.log('cache harga emas not exist')
    //   : console.log('cache harga emas already exist');
    // !(await horoscope.cacheCheck(igniteClient))
    //   ? console.log('cache horoscope not exist')
    //   : console.log('cache horoscope already exist');
    // await igniteClient.disconnect();

    console.log(process.env.DB_DATABASE);
    sequelize.addModels([kuis_score, kuis_score_ramadan]);
    await sequelize.sync({ force: false });
  } catch (e) {
    console.log(e);
  }
})();

/** jalankan server sesuai port di .env */
server.listen(PORT, () =>
  // tslint:disable-next-line: no-console
  console.log(`Server is running http://localhost:${PORT}...`),
);
