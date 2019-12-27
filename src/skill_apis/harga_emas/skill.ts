import { Request, Response } from 'express-serve-static-core';
import fs from 'fs';
import { OneBigStringForHargaEmasCache } from './types';
import { igniteSupport } from '../../ignite_support';

class HargaEmasSkill {
  public index = async(req:Request, res:Response) => {
    const tmp = await this.getDataFromCache();
    const data = JSON.parse(tmp);
    res.send(data);
    // fs.readFile('cache/harga_emas.json', (err, data) => {
    //   if (err) {
    //     res.sendError('data harga emas not found in cache');
    //   } else {
    //     res.send(JSON.parse(data.toString()));
    //   }
    // });
  }

  private getDataFromCache = async () : Promise<string> => {
    const data = await igniteSupport.getCacheByNameWithoutClient('cacheHargaEmas',new OneBigStringForHargaEmasCache());
    return new Promise((resolve, reject) => {
      resolve(data![0].str);
    })
  }
}

const hargaEmasSkill = new HargaEmasSkill();
export default hargaEmasSkill;
