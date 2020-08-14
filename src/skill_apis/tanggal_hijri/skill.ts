import { Request, Response } from 'express-serve-static-core';
import rp from 'request-promise';
import moment from 'moment';
import momentHijri from 'moment-hijri';
import * as dotenv from 'dotenv';
dotenv.config();

class TanggalHijriSkill {
  public convertToHijri = async (req: Request, res: Response) => {
    
    const dateM = req.query.date;
    const dateH = momentHijri(dateM,"YYYY-MM-DD").format('iYYYY-iM-iD');
    const monthH = momentHijri(dateM,"YYYY-MM-DD").format('iM');

    const monthHString = ["Muharrom","Shafar","Robiyul Awal","Robiyul Akhir","Jumadil Awal","Jumadil Akhir","Rajab","Syakban","Ramadan","Syawal","Dzulqoidah","Dzulhijjah"];
    
    res.send(JSON.parse(`{"status":"success", "hijriah":"${dateH}", "bulan": "${monthHString[+monthH-1]}"}`));
  }

}

export const tanggalHijriSkill = new TanggalHijriSkill();
