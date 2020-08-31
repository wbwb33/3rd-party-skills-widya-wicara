import * as dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import cron from 'cron';
import expressApp from './app';

import weather from './skill_apis/weather/resource';
import horoscope from './skill_apis/horoscope/resource';
import kuis from './skill_apis/kuis/resource';
import hargaEmas from './skill_apis/harga_emas/resource';
import hargaPangan from './skill_apis/harga_pangan/resource';
import adzanWeekResource from './skill_apis/adzan_week/resource';

/** import sequelize connection and the models */
import { sequelize } from './sequelize';
import { kuis_score } from './db/models/kuis';
import { kuis_score_ramadan } from './db/models/kuis_ramadhan';
import { third_party } from './db/models/third_party';
import { status_game } from './db/models/status_game';
import { AdzanStatus } from './db/models/adzan_status';

import moment from 'moment';
moment.locale('en');

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

/** cek status jadwal salat all uuids at 00.10 */
new cron.CronJob('00 10 00 * * *', () => {
  adzanWeekResource.decrement();
}).start();

/** get kuis ramadan for today and save it to db at 00.08, start from 22 apr */
const startQuiz = new Date();
startQuiz.setUTCFullYear(2020, 4, 18);
startQuiz.setUTCHours(17);
startQuiz.setUTCMinutes(0);
startQuiz.setUTCSeconds(0);

const now = new Date();

if (now.getTime() >= startQuiz.getTime()) {
  new cron.CronJob('00 08 00 * * *', () => {
    kuis.getQuizRamadan();
  }).start();
} else {
  new cron.CronJob(startQuiz, () => {
    new cron.CronJob('00 08 00 * * *', () => {
      kuis.getQuizRamadan();
    }).start();
  }).start();
}

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

/** backup ramadan */
new cron.CronJob('00 00 */1 * * *', async () => {
  const igniteClient = new IgniteClient(onStateChanged);
  await igniteClient.connect(new IgniteClientConfiguration(BASE_IGNITE));
  !(await kuis.cacheCheckRamadan(igniteClient))
    ? await kuis.getQuizRamadanBackup()
    : console.log('cache kuis ramadan already exist');
  await igniteClient.disconnect();
}).start();

/** functions that get executed only at FIRST TIME */
(async () => {
  try {
    // const igniteClient = new IgniteClient(onStateChanged);

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

    /** uncomment if u want to alter single table */
    // sequelize.addModels([status_game]);
    // await sequelize.sync({ force: false, alter: true });

    sequelize.addModels([kuis_score, kuis_score_ramadan, third_party, AdzanStatus, status_game]);
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
