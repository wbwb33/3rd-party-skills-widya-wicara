import * as dotenv from 'dotenv';
dotenv.config();
import http from 'http';
import cron from 'cron';
import fs from 'fs';
import weather from './skill_apis/weather/resource';
import expressApp from './app';
import horoscope from './skill_apis/horoscope/resource';
import kuis from './skill_apis/kuis/resource';
import jadwalAdzan from './skill_apis/jadwal_salat/resource';
import hargaEmas from './skill_apis/harga_emas/resource';
import hargaPangan from './skill_apis/harga_pangan/resource';

/** import sequelize connection and the models */
import { sequelize } from './sequelize';
import { TabelOne } from './db/models/tabel_one';
import { kuis_availability } from './db/models/kuis';
import { reminder } from './db/models/reminder';

/** ambil variabel PORT dari .env */
const { PORT = 3000 } = process.env;

/** instantiasi server dengan express */
const server = http.createServer(expressApp);

/** get harga pangan and set cron job every at 11:00 */
new cron.CronJob('00 00 11 * * *', () => {
  hargaPangan.get();
}).start();

/** get harga pangan 2 and set cron job every at 17:00 */
new cron.CronJob('00 00 17 * * *', () => {
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
  kuis.get(false);
}).start();

/** get jadwal adzan for today at 01.00 */
const job = new cron.CronJob('00 00 01 * * *', async () => {
  try {
    const d = new Date();
    await jadwalAdzan.index();
  } catch (e) {
    console.log(e);
  }
});

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

/** check if a cache exist (from it's path) */
const notExists = async (path: string): Promise<boolean> => {
  return new Promise(resolve => {
    fs.stat(path, (err, stat) => {
      if (err == null) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

/** functions that get executed only at FIRST TIME */
(async () => {
  try {
    const igniteClient = new IgniteClient(onStateChanged);
    await igniteClient.connect(new IgniteClientConfiguration('149.129.235.17:31639'));
    !(await kuis.cacheCheck(igniteClient))
      ? console.log('cache kuis not exist')
      : console.log('cache kuis already exist');
    !(await hargaPangan.cacheCheck(igniteClient))
      ? console.log('cache pangan not exist')
      : console.log('cache pangan already exist');
    !(await weather.cacheCheck(igniteClient))
      ? console.log('cache weather not exist')
      : console.log('cache weather already exist');
    !(await hargaEmas.cacheCheck(igniteClient))
      ? console.log('cache harga emas not exist')
      : console.log('cache harga emas already exist');
    await igniteClient.disconnect();
    sequelize.addModels([TabelOne, kuis_availability, reminder]);
    await sequelize.sync({ force: false });
    // (await notExists('cache/harga_emas.json')) ? hargaEmas.get() : console.log('cache emas exists');
    // (await notExists('cache/weather.json')) ? weather.get() : console.log('cache weather exists');
    (await notExists('cache/horoscope.json')) ? horoscope.get() : console.log('cache horoscope exists');
    job.start();
  } catch (e) {
    console.log(e);
  }
})();

/** jalankan server sesuai port di .env */
server.listen(PORT, () =>
  // tslint:disable-next-line: no-console
  console.log(`Server is running http://localhost:${PORT}...`),
);
