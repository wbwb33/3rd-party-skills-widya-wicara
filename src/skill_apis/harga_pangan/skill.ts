import { Request, Response } from 'express-serve-static-core';
import fs from 'fs';

class HargaPanganSkill {
  public index = async(req:Request, res:Response) => {
    fs.readFile('cache/pangan_per_provinsi.json', (err, data) => {
      if (err) {
        res.sendError('data harga emas not found in cache');
      } else {
        res.send(JSON.parse(data.toString()));
      }
    })
  }
}

const hargaPanganSkill = new HargaPanganSkill();
export default hargaPanganSkill;
