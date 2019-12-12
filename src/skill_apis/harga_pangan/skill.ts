import { Request, Response } from 'express-serve-static-core';
import rp from 'request-promise';
import $ from 'cheerio';
import fs from 'fs';

interface IHargaPanganPerProvinsi {
  lastUpdate: string;
  idProv: number;
  beras: string;
  ayam: string;
  sapi: string;
  telur: string;
  bawMerah: string;
  bawPutih: string;
  cabMerah: string;
  cabRawit: string;
  minyak: string;
  gula: string;
}

class HargaPanganSkill {
  private getKey = async () => {
    const url = `https://hargapangan.id/tabel-harga/pasar-tradisional/daerah`;
    await rp(url)
      .then(html => {
        const keyForm = $('#adminForm > input', html);
        console.log(keyForm[8].attribs.name);
        return keyForm[8].attribs.name;
      })
      .catch(error => (console.log(error)));
  };

  private readFile = async (int: number): Promise<IHargaPanganPerProvinsi> => {
    return new Promise((resolve, reject) => {
      fs.readFile(`cache/pangan/prov_${(int+1)}.html`,'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const indexLastUpdated = $('#report > tbody > tr > td[title=Beras] > .text-right > strong', data).length;
          const lastUpdated = $('#report > thead > tr > th', data).eq(indexLastUpdated+1).text().replace(/\//g,"-");
          const beras = $('#report > tbody > tr > td[title=Beras] > .text-right > strong', data).last().text();
          const ayam = $('#report > tbody > tr > td[title="Daging Ayam"] > .text-right > strong', data).last().text();
          const sapi = $('#report > tbody > tr > td[title="Daging Sapi"] > .text-right > strong', data).last().text();
          const telur = $('#report > tbody > tr > td[title="Telur Ayam"] > .text-right > strong', data).last().text();
          const bawMerah = $('#report > tbody > tr > td[title="Bawang Merah"] > .text-right > strong', data).last().text();
          const bawPutih = $('#report > tbody > tr > td[title="Bawang Putih"] > .text-right > strong', data).last().text();
          const cabMerah = $('#report > tbody > tr > td[title="Cabai Merah"] > .text-right > strong', data).last().text();
          const cabRawit = $('#report > tbody > tr > td[title="Cabai Rawit"] > .text-right > strong', data).last().text();
          const minyak = $('#report > tbody > tr > td[title="Minyak Goreng"] > .text-right > strong', data).last().text();
          const gula = $('#report > tbody > tr > td[title="Gula Pasir"] > .text-right > strong', data).last().text();
          const fin = {
            lastUpdate:lastUpdated,
            idProv:(int+1),
            beras:beras,
            ayam:ayam,
            sapi:sapi,
            telur:telur,
            bawMerah:bawMerah,
            bawPutih:bawPutih,
            cabMerah:cabMerah,
            cabRawit:cabRawit,
            minyak:minyak,
            gula:gula
          };
          resolve(fin);
        }
      })    
    })
  }

  private getDataFromHtmlDirectly = async (id:number,idProv:number) => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const dMax = `${dd}-${mm}-${yyyy}`;
    d.setDate(d.getDate()-7);
    const ddMin = String(d.getDate()).padStart(2, '0');
    const mmMin = String(d.getMonth() + 1).padStart(2, '0');
    const yyyyMin = d.getFullYear();
    const dMin = `${ddMin}-${mmMin}-${yyyyMin}`;
    const key = (await this.getKey())+"";
    
    const form = JSON.parse(`{
      "task": "",
      "filter_commodity_ids[]": "0",
      "filter_all_commodities": "0",
      "format": "html",
      "price_type_id": "1",
      "${key}": "1",
      "filter_province_ids[]": "${(idProv)}",
      "filter_regency_ids[]": "${(id)}",
      "filter_market_ids[]": "0",
      "filter_layout": "default'",
      "filter_start_date": "${dMin}",
      "filter_end_date": "${dMax}"
    }`);
    var options = {
      method: 'POST',
      uri: 'https://hargapangan.id/tabel-harga/pasar-tradisional/daerah',
      form: form,
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    };
    
    await rp(options)
      .then(html => {
        fs.writeFile(`cache/pangan_cache.html`, html, 'utf-8', err => {
          if(err) console.log('error write tmp cache pangan per provinsi');
          else console.log(`done pangan cache`);
        })
        const data = html.toString();
        const indexLastUpdated = $('#report > tbody > tr > td[title=Beras] > .text-right > strong', data).length;
        const lastUpdated = $('#report > thead > tr > th', data).eq(indexLastUpdated+1).text().replace(/\//g,"-");
        const beras = $('#report > tbody > tr > td[title=Beras] > .text-right > strong', data).last().text();
        const ayam = $('#report > tbody > tr > td[title="Daging Ayam"] > .text-right > strong', data).last().text();
        const sapi = $('#report > tbody > tr > td[title="Daging Sapi"] > .text-right > strong', data).last().text();
        const telur = $('#report > tbody > tr > td[title="Telur Ayam"] > .text-right > strong', data).last().text();
        const bawMerah = $('#report > tbody > tr > td[title="Bawang Merah"] > .text-right > strong', data).last().text();
        const bawPutih = $('#report > tbody > tr > td[title="Bawang Putih"] > .text-right > strong', data).last().text();
        const cabMerah = $('#report > tbody > tr > td[title="Cabai Merah"] > .text-right > strong', data).last().text();
        const cabRawit = $('#report > tbody > tr > td[title="Cabai Rawit"] > .text-right > strong', data).last().text();
        const minyak = $('#report > tbody > tr > td[title="Minyak Goreng"] > .text-right > strong', data).last().text();
        const gula = $('#report > tbody > tr > td[title="Gula Pasir"] > .text-right > strong', data).last().text();
        const fin = {
          lastUpdate:lastUpdated,
          idProv:(idProv),
          beras:beras,
          ayam:ayam,
          sapi:sapi,
          telur:telur,
          bawMerah:bawMerah,
          bawPutih:bawPutih,
          cabMerah:cabMerah,
          cabRawit:cabRawit,
          minyak:minyak,
          gula:gula
        };
        console.log(fin);
      })
      .catch(error => console.log(error))
  }

  private findIndexLocation = async(strMsg:string) : Promise<Object> => {
    return new Promise ((resolve,reject) => {
      fs.readFile('dependent/lokasi_pangan.json', (err, data) => {
        if (err) {
          // res.sendError('data lokasi is not found');
          reject(err);
        } else {
          const msg:string = strMsg;
          const dataR = JSON.parse(data.toString());
          var found = 0;
          for(var i=0;i<dataR.length;i++){
            if(msg.includes(dataR[i].lokasi.toLowerCase())){
              found = 1;
              break;
            }
          }
          if(found){
            const id = dataR[i].id;
            const idProv = dataR[i].idProv;
            const lokasi = dataR[i].lokasi;
            // res.send(JSON.parse(`{"id":"${id}","idProv":"${idProv}","value":"${lokasi}"}`));
            resolve(JSON.parse(`{"id":"${id}","idProv":"${idProv}","value":"${lokasi}"}`));
          } else {
            resolve(JSON.parse(`{"message":"sorry not found"}`));
          }
        }
      })
    })
  }

  public index = async(req:Request, res:Response) => {
    const resLocation = JSON.parse(JSON.stringify((await this.findIndexLocation(req.query.msg))));
    const id = resLocation.id;
    const idProv = resLocation.idProv;
    const value = resLocation.value;
    console.log(resLocation);
    // res.send(resLocation);
    await this.getDataFromHtmlDirectly(id,idProv);
  }
}

const hargaPanganSkill = new HargaPanganSkill();
export default hargaPanganSkill;
