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
import { IgniteClass } from './skill_apis/tes_ignite/skill';

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

/**
 * get harga pangan and set cron job every at 23:00
 */
new cron.CronJob('00 00 23 * * *', () => {
  hargaPangan.get();
}).start();

/**
 * get harga emas and set cron job every at 09:00
 */
new cron.CronJob('00 00 09 * * *', () => {
  hargaEmas.get();
}).start();

/**
 * get weather and set cron job every at 00:02
 */
new cron.CronJob('00 02 00 * * *', () => {
  weather.get();
}).start();

/**
 * get horoscope and set cron job every at 00:04
 */
new cron.CronJob('00 04 00 * * *', () => {
  horoscope.get();
}).start();

/**
 * get kuis for today and save it to db at 00.06
 */
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

import IgniteClient from 'apache-ignite-client';
const IgniteClientConfiguration = IgniteClient.IgniteClientConfiguration;
const onStateChanged = (state: any, reason: any) => {
  if (state === IgniteClient.STATE.CONNECTED) {
    console.log('Ignite Client is started');
  } else if (state === IgniteClient.STATE.CONNECTING) {
    console.log('Ignite Client is connecting');
  } else if (state === IgniteClient.STATE.DISCONNECTED) {
    console.log('Ignite Client is stopped');
    if (reason) {
      console.log(reason);
    }
  }
};

(async () => {
  try {
    const igniteClient = new IgniteClient(onStateChanged);
    await igniteClient.connect(new IgniteClientConfiguration('127.0.0.1:10800'));
    await IgniteClass.cobaKuis(igniteClient);
    await IgniteClass.getKuis(igniteClient);
    // await IgniteClass.deleteKuis();
    // sequelize.addModels([TabelOne, kuis_availability, reminder]);
    // await sequelize.sync({ force: false });
    // (await notExists('cache/pangan_per_provinsi.json')) ? hargaPangan.get() : console.log('cache pangan exists');
    // (await notExists('cache/harga_emas.json')) ? hargaEmas.get() : console.log('cache emas exists');
    // (await notExists('cache/weather.json')) ? weather.get() : console.log('cache weather exists');
    // (await notExists('cache/horoscope.json')) ? horoscope.get() : console.log('cache horoscope exists');
    // (await notExists('cache/kuis_today.json')) ? kuis.get() : console.log('cache kuis exists');
    // job.start();
  } catch (e) {
    console.log(e);
  }
})();

server.listen(PORT, () =>
  // tslint:disable-next-line: no-console
  console.log(`Server is running http://localhost:${PORT}...`),
);
