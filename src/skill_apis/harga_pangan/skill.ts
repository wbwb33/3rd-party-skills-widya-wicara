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
  public getHargaPanganFromCache = async (req:Request,res:Response) => {
    if(!(req.query.msg)) res.send(JSON.parse(`{"error":"no input msg"}`));
    else {
      const dataLokasi = await this.findIndexLocation(req.query.msg);
      if(dataLokasi.status=="error") res.send(JSON.parse(`{"error":"${dataLokasi.message}"}`));
      else {
        const id = dataLokasi.id;
        const idProv = dataLokasi.idProv;
        const lokasi = dataLokasi.lokasi;
        const dataHarga = await this.readCacheFile((idProv-1));
        // console.log(dataHarga);
        res.send(JSON.parse(JSON.stringify(dataHarga)));
      }
    }
  }

  private readCacheFile = async (index:number): Promise<IHargaPanganPerProvinsi> => {
    return new Promise((resolve,reject) => {
      fs.readFile(`cache/pangan_per_provinsi.json`, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data.toString())[index]);
        }
      })
    })
  }

  private findIndexLocation = async(msg:string) : Promise<any> => {
    return new Promise ((resolve,reject) => {
      fs.readFile('dependent/lokasi_pangan.json', (err, data) => {
        if (err) {
          reject(err);
        } else {
          const dataR = JSON.parse(data.toString());
          const provR = ["Aceh","Sumatera Utara","Sumatera Barat","Riau","Kepulauan Riau","Jambi","Bengkulu","Sumatera Selatan","Kepulauan Bangka Belitung","Lampung","Banten","Jawa Barat","DKI Jakarta","Jawa Tengah","DI Yogyakarta","Jawa Timur","Bali","Nusa Tenggara Barat","Nusa Tenggara Timur","Kalimantan Barat","Kalimantan Selatan","Kalimantan Tengah","Kalimantan Timur","Kalimantan Utara","Gorontalo","Sulawesi Selatan","Sulawesi Tenggara","Sulawesi Tengah","Sulawesi Utara","Sulawesi Barat","Maluku","Maluku Utara","Papua","Papua Barat"];
          var found = 0;
          for(var i=0;i<dataR.length;i++){
            // console.log(provR[dataR[i].idProv-1]);
            if(msg.includes(provR[(dataR[i].idProv-1)].toLowerCase())||msg.includes(dataR[i].lokasi.toLowerCase())){
              found = 1;
              break;
            }
          }
          if(found){
            const id = dataR[i].id;
            const idProv = dataR[i].idProv;
            const lokasi = dataR[i].lokasi;
            // res.send(JSON.parse(`{"id":"${id}","idProv":"${idProv}","value":"${lokasi}"}`));
            resolve(JSON.parse(`{"id":"${id}","idProv":"${idProv}","lokasi":"${lokasi}"}`));
          } else {
            resolve(JSON.parse(`{"status":"error","message":"no match location"}`));
          }
        }
      })
    })
  }

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

}

const hargaPanganSkill = new HargaPanganSkill();
export default hargaPanganSkill;
