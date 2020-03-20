import * as kab from './data_kab.json';
import * as kota from './data_kota.json';
import * as kabKota from './data_kab_kota.json';
import { Request, Response } from 'express-serve-static-core';

class EntityCity {
  public index = async (req: Request, res: Response) => {
    const q = req.query.msg.toLowerCase();
    const locationResult = (req.query.joined)?await this.cekPesan(q,true):await this.cekPesan(q);
    res.send(JSON.parse(locationResult));
  }

  public cekPesan = async (msg:string, useJoinedDataKabKota?: boolean) => {
    const q = msg;
    var found:string = "";
    
    if(useJoinedDataKabKota) {
      const kabKotaR = Object.values(kabKota);
      const cek = kabKotaR.every((val) => {
        try {
          found = val.toLowerCase();
        } catch (error) {
          found = val;
        }
        return !q.includes(found);
      });

      return (cek)
        ?`{"type": "error", "data": "cannot find location (joined)"}`
        :`{"type": "success", "data": {"loc": "${found}", "type": "kabkota"}}`;
    } 
    
    else {
      const kotar = Object.values(kota);
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
          ?`{"type": "error", "data": "cannot find location"}`
          :`{"type": "success", "data": {"loc": "${found}", "type": "kab"}}`;
      } else {
        return `{"type": "success", "data": {"loc": "${found}", "type": "kota"}}`;
      }
    }
  }
}

const entityCity = new EntityCity();
export default entityCity;