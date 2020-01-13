import { Request, Response } from 'express-serve-static-core';
import {reminder} from '../../db/models/reminder';

export interface ProcessedData {
  no:       number;
  about:    string;
  tanggal:  string;
  jam:      string;
}

class ReminderSkill {
  //get reminder by uuid
  public index = async (req: Request, res: Response) => {
    const uuidReq = req.query.uuid;
    const result = await reminder.findAll({
      raw: true,
      where: {
        uuid: uuidReq
      }
    });
    if(result.length<1){
      res.send(JSON.parse(`{"status":"success","action":"reminder","data": "NULL"}`));
    } else {
      let processedRes: ProcessedData[] = [];
      let arr_bln = ["januari","februari","maret","april","mei","juni","juli","agustus","september","oktober","november","desember"];
      for(let i=0;i<result.length;i++){
        let tmp_tgl = result[i].date_rem.getDate();
        let tmp_bln = arr_bln[result[i].date_rem.getMonth()];
        let tmp_thn = result[i].date_rem.getFullYear();
        let tmp_jam = result[i].date_rem.getHours();
        let tmp_mnt = result[i].date_rem.getMinutes();
        let str_tmp_mnt = tmp_mnt!=0?`lebih ${tmp_mnt} menit`:"tepat";
        processedRes.push({
          no: (i+1), 
          about: result[i].about_rem, 
          tanggal: tmp_tgl+" "+tmp_bln+" "+tmp_thn, 
          jam: `${tmp_jam} ${str_tmp_mnt}`
        });
      }
      res.send(JSON.parse(`{"status":"success","action":"reminder","data": ${JSON.stringify(processedRes)}}`));
    }
  }

  public add = async (req: Request, res: Response) => {
    const uuidReq = req.query.uuid;
    const aboutReq = req.query.about;
    const dateReq = new Date(req.query.date);
    try{
      await reminder.create({uuid: uuidReq ,about_rem: aboutReq, date_rem: dateReq});
      res.send(JSON.parse(`{"status":"success","action":"add-reminder"}`));
    } catch (e) {
      console.log(e);
      res.send(JSON.parse(`{"status":"error","action":"add-reminder"}`));
    }    
    // console.log(dateReq);
  }
}

const reminderSkill = new ReminderSkill();
export default reminderSkill;
