import { Request, Response } from 'express-serve-static-core';

import fs from 'fs';


class HargaEmasSkill {
  public index = async(req:Request, res:Response) => {
    fs.readFile('cache/harga_emas.json', (err, data) => {
      if (err) {
        res.sendError('data harga emas not found in cache');
      } else {
        res.send(JSON.parse(data.toString()));
      }
    })
  }
}

const hargaEmasSkill = new HargaEmasSkill();
export default hargaEmasSkill;
