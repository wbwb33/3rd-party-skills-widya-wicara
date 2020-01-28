import * as kab from './data_kab.json';
import * as kota from './data_kota.json';
import { Request, Response } from 'express-serve-static-core';

class EntityCity {
  public index = async (req: Request, res: Response) => {
    const q = req.query.msg.toLowerCase();
    const kota = await this.cekPesan(q);
    res.send(JSON.parse(kota));
  }

  public cekPesan = async (msg:string) => {
    const kotar = Object.values(kota);
    const q = msg;
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
  
      return (cek2)
        ?`{"type": "error", "data": "null"}`
        :`{"type": "success", "data": {"loc": "${found}", "type": "kab"}}`;
    } else {
      return `{"type": "success", "data": {"loc": "${found}", "type": "kota"}}`;
    }
  }
}

const entityCity = new EntityCity();
export default entityCity;