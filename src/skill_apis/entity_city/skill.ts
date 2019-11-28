import * as kab from './data_kab.json';
import * as kota from './data_kota.json';
import { Request, Response } from 'express-serve-static-core';

class EntityCity {
  public index = async (req: Request, res: Response) => {
    const kotar = Object.values(kota);
    const q = req.query.msg.toLowerCase();
    var found:string = "";

    const cek = kotar.every((val) => {
      try {
        found = val.toLowerCase();
      } catch (error) {
        found = val;
      } 
      return !q.includes(found);  
    });

    if(cek){
      const kabr = Object.values(kab);
      const cek2 = kabr.every((val2) => {
        try {
          found = val2.toLowerCase();
        } catch (error) {
          found = val2;
        }
        return !q.includes(found);
      });
  
      if(cek2){
        res.send(JSON.parse(`{"type": "error", "data": "null"}`));
      } else {
        res.send(JSON.parse(`{"type": "success", "data": {"loc": "${found}", "type": "kab"}}`));  
      }
    } else {
      res.send(JSON.parse(`{"type": "success", "data": {"loc": "${found}", "type": "kota"}}`));
    }

  }
}

const entityCity = new EntityCity();
export default entityCity;