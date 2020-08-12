import { Request, Response } from 'express-serve-static-core';
import rp from 'request-promise';
import moment from 'moment';
import momentHijri from 'moment-hijri';
import * as dotenv from 'dotenv';
dotenv.config();

class TanggalHijriSkill {
  public convertToHijri = async (req: Request, res: Response) => {
    momentHijri.locale('en-US');
    
    const dateM = req.query.date;
    // const addZero = async(int:number) => { return int>9?`${int}`:`0${int}`}
    // const yearM = req.query.y;
    // const monthM = await addZero(req.query.m);
    // const dayM = await addZero(req.query.d);
    // const dateM = yearM+monthM+dayM;

    // const isyaPlatform = moment(isyaFormatter).utc().format("YYYY-MM-DDTHH:mm:00+0000");
    const dateH = momentHijri(dateM,"YYYY-MM-DD").format('iYYYY-iM-iD');
    const monthM = momentHijri(dateM,"YYYY-MM-DD").format('iM');

    const monthMString = ["Muharrom","Shafar","Robiyul Awal","Robiyul Akhir","Jumadil Awal","Jumadil Akhir","Rajab","Syakban","Ramadan","Syawal","Dzulqoidah","Dzulhijjah"];
    
    res.send(JSON.parse(`{"status":"success", "hijriah":"${dateH}", "bulan": "${monthMString[+monthM-1]}"}`));
  }

}

export const tanggalHijriSkill = new TanggalHijriSkill();
