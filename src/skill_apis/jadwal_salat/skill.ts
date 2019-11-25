import { Request, Response } from 'express-serve-static-core';
import rp from 'request-promise';
import $ from 'cheerio';
import {TabelOne} from '../../db/models/tabel_one';

class AdzanSkill {
  public index = async (req: Request, res: Response) => {
    const lok = req.query.city;
    const index = req.query.index;

    // var final_array: FinalDataGetJadwalSalat[] = [];

    const url = `http://jadwalsholat.pkpu.or.id/?id=${index + 1}`;
    await rp(url)
      .then(html => {
        const d = new Date();
        const dd = String(d.getDate()).padStart(2, '0');
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const yyyy = d.getFullYear();

        const subuhJam = $('.table_highlight > td', html)[1].children[0].data;
        const dzuhurJam = $('.table_highlight > td', html)[2].children[0].data;
        const asharJam = $('.table_highlight > td', html)[3].children[0].data;
        const maghribJam = $('.table_highlight > td', html)[4].children[0].data;
        const isyaJam = $('.table_highlight > td', html)[5].children[0].data;

        res.send(JSON.parse(
          `{
            "lokasi": "${lok}",
            "subuh": "${subuhJam}",
            "dzuhur": "${dzuhurJam}",
            "ashar": "${asharJam}",
            "maghrib": "${maghribJam}",
            "isya": "${isyaJam}"
          }`
        ));
      })
      .catch(error => (error));
  };

  public getJadwalSalatFromDb = async (req: Request, res: Response) => {
    try {
      res.send(await TabelOne.findAll({
        where: {
          id:60
        }
      }));
    } catch (e) {
      console.log(e);
    }
  }
}

const adzanSkill = new AdzanSkill();
export default adzanSkill;
