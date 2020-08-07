import { Request, Response } from 'express-serve-static-core';
import rp from 'request-promise';
import * as dotenv from 'dotenv';
import moment, { unix } from 'moment';
dotenv.config();

class AdzanWeekSkill {
  public index = async (req: Request, res: Response) => {
    const addZero = async(int:number) => { return int>9?`${int}`:`0${int}`}

    const kota = req.query.kota;
    const offset = isNaN(+req.query.offset)?7:+req.query.offset;
    const year = req.query.year;
    const month = await addZero(req.query.month);
    const day = await addZero(req.query.day);
    // const uuid = req.query.uuid;

    const tanggal = `${year}-${month}-${day}`;

    const tmp: any = await this.getFromApiBanghasan(kota,offset,tanggal);

    const flatten = tmp.flat(1);

    const sorter = flatten.sort((a: any,b: any)=>{
      return (moment(a).unix()) - (moment(b).unix());
    })

    // const flatten = moment('2020-08-12T04:31:00+0700').utc();
 
    // const arrayHasilApi = [
    //   "2020-08-07T04:32:00+0000",
    //   "2020-08-07T11:47:00+0000",
    //   "2020-08-07T15:08:00+0000",
    //   "2020-08-07T17:41:00+0000",
    //   "2020-08-07T18:53:00+0000",
    //   "2020-08-08T04:31:00+0000",
    //   "2020-08-08T11:47:00+0000",
    //   "2020-08-08T15:08:00+0000",
    //   "2020-08-08T17:41:00+0000",
    //   "2020-08-08T18:52:00+0000",
    //   "2020-08-09T04:31:00+0000",
    //   "2020-08-09T11:47:00+0000",
    //   "2020-08-09T15:08:00+0000",
    //   "2020-08-09T17:41:00+0000",
    //   "2020-08-09T18:52:00+0000",
    //   "2020-08-10T04:31:00+0000",
    //   "2020-08-10T11:47:00+0000",
    //   "2020-08-10T15:07:00+0000",
    //   "2020-08-10T17:41:00+0000",
    //   "2020-08-10T18:52:00+0000",
    //   "2020-08-11T04:31:00+0000",
    //   "2020-08-11T11:47:00+0000",
    //   "2020-08-11T15:07:00+0000",
    //   "2020-08-11T17:41:00+0000",
    //   "2020-08-11T18:52:00+0000",
    //   "2020-08-12T04:31:00+0000",
    //   "2020-08-12T11:46:00+0000",
    //   "2020-08-12T15:07:00+0000",
    //   "2020-08-12T17:41:00+0000",
    //   "2020-08-12T18:52:00+0000"
    // ];

    res.send(sorter);
  }

  private getFromApiBanghasan = async(kota: number, offset: number, tanggal: string) => {
    return new Promise( async (resolve, reject) => {
      const tanggalNextSix = [
        moment(tanggal,"YYYY-MM-DD").add(1,'days').format('YYYY-MM-DD'),
        moment(tanggal,"YYYY-MM-DD").add(2,'days').format('YYYY-MM-DD'),
        moment(tanggal,"YYYY-MM-DD").add(3,'days').format('YYYY-MM-DD'),
        moment(tanggal,"YYYY-MM-DD").add(4,'days').format('YYYY-MM-DD'),
        moment(tanggal,"YYYY-MM-DD").add(5,'days').format('YYYY-MM-DD'),
        moment(tanggal,"YYYY-MM-DD").add(6,'days').format('YYYY-MM-DD'),
      ]

      const dataToReturn = await this.asyncGet(tanggalNextSix,kota,offset);

      resolve(dataToReturn);
    })
  }

  private asyncGet = async(array: any, kota:number, offset:number) => {
    return new Promise( async (resolve,reject) => {
      let dataToReturn: any[] = [];
      
      let requests = await array.map((item: any) => {
        return new Promise( async(resolve,reject) => {
          try {dataToReturn.push(await this.asyncGet2Step(kota,offset,item,resolve));}
          catch (error) {console.log(error);}
        });
      })
    
      Promise.all(requests).then(() => resolve(dataToReturn!));
    })
  }

  private asyncGet2Step = async(kota:number,offset:number,item:string, cb: any) => {
    let dataToReturn: string[] = [];
    let zeroOffset = ((Math.abs(offset)+'').length>1)?Math.abs(offset):`0${Math.abs(offset)}`;
    let isoOffset = (offset<0)?`:00-${zeroOffset}00`:`:00+${zeroOffset}00`;

    await rp({uri:`http://api.banghasan.com/sholat/format/json/jadwal/kota/${kota}/tanggal/${item}`,json:true})
      .then((body) => {
        dataToReturn.push(moment(item+'T'+body.jadwal.data.subuh+isoOffset).utc().format("YYYY-MM-DDTHH:mm:00+0000"));
        dataToReturn.push(moment(item+'T'+body.jadwal.data.dzuhur+isoOffset).utc().format("YYYY-MM-DDTHH:mm:00+0000"));
        dataToReturn.push(moment(item+'T'+body.jadwal.data.ashar+isoOffset).utc().format("YYYY-MM-DDTHH:mm:00+0000"));
        dataToReturn.push(moment(item+'T'+body.jadwal.data.maghrib+isoOffset).utc().format("YYYY-MM-DDTHH:mm:00+0000"));
        dataToReturn.push(moment(item+'T'+body.jadwal.data.isya+isoOffset).utc().format("YYYY-MM-DDTHH:mm:00+0000"));
        cb();
      })
      .catch(err => {
        console.log("err");
      })

    return dataToReturn;
  }

}

export const adzanWeekSkill = new AdzanWeekSkill();
