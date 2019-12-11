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

class HargaPangan {
  private getKey = async () => {
    const url = `https://hargapangan.id/tabel-harga/pasar-tradisional/daerah`;
    await rp(url)
      .then(html => {
        const keyForm = $('#adminForm > input', html);
        console.log(keyForm[8].attribs.name);
        return keyForm[8].attribs.name;
        
        // fs.writeFile('cache/harga_emas.json', JSON.stringify(finalResult), (err) => {
        //   if(err){
        //     console.log('cannot write data harga emas today');
        //   } else {
        //     console.log("done harga emas");
        //   }
        // })
      })
      .catch(error => (console.log(error)));
  };

  public getAndSaveDataHtml = async () => {
    
    let hargaPanganPerProvinsi:IHargaPanganPerProvinsi[] = [];
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
    
    for(let i=0;i<34;i++){
      const form = JSON.parse(`{
        "task": "",
        "filter_commodity_ids[]": "0",
        "filter_all_commodities": "0",
        "format": "html",
        "price_type_id": "1",
        "${key}": "1",
        "filter_province_ids[]": "${(i+1)}",
        "filter_regency_ids[]": "0",
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
        .then(data => {
          fs.writeFile(`cache/pangan/prov_${(i+1)}.html`, data, 'utf-8', err => {
            if(err) console.log('error write html harga pangan per provinsi');
            else console.log(`done save html harga pangan prov ${(i+1)} of 34`);
          })
        })
        .catch(error => console.log(error))
    }
    this.getDataHargaPanganFromHtml();
    // fs.writeFile('cache/pangan_per_provinsi_crawl.json', JSON.stringify(hargaPanganPerProvinsi), err => {
    //   if(err) console.log('error write pangan per provinsi');
    //   else console.log('done write pangan per provinsi');
    // })
  }

  public getAndSaveDataHtmlThatStillMissing = async (i:number) => {
    
    let hargaPanganPerProvinsi:IHargaPanganPerProvinsi[] = [];
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
      "filter_province_ids[]": "${(i+1)}",
      "filter_regency_ids[]": "0",
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
      .then(data => {
        fs.writeFile(`cache/pangan/prov_${(i+1)}.html`, data, 'utf-8', err => {
          if(err) console.log('error write html harga pangan per provinsi');
          else console.log(`done save html harga pangan prov ${(i+1)} of 34`);
        })
      })
      .catch(error => console.log(error))
  }

  private readOnly = async (): Promise<string> => {
    return new Promise((resolve,reject) => {
      fs.readFile('cache/pangan_per_provinsi.json', (err, data) => {
        if(err) reject(err);
        else {
          resolve(data.toString());
        }
      })
    })
  }

  public searchForMissing = async () => {
    const a = JSON.parse(await this.readOnly());
    for(let i=0;i<a.length;i++){
      const d = new Date();
      const dd = String(d.getDate()).padStart(2, '0');
      const tmpDate = a[i].lastUpdate.split('-')[0];
      console.log(dd+" <> "+tmpDate);
      if(dd!=tmpDate){
        await this.getAndSaveDataHtmlThatStillMissing(i);
        a[i] = await this.readFile(i);
      }
    }
    fs.writeFile('cache/pangan_per_provinsi.json', JSON.stringify(a), err => {
      if(err) console.log('error write NEW data harga pangan per provinsi');
      else console.log('done write NEW data harga pangan per provinsi');
    })

  }

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

  public getDataHargaPanganFromHtml = async() => {
    let hargaPanganPerProvinsi:IHargaPanganPerProvinsi[] = [];
    for(let i=0;i<34;i++){
      const fin:IHargaPanganPerProvinsi = await this.readFile(i);
      console.log(`done get harga pangan from html prov ${(i+1)} of 34`);
      hargaPanganPerProvinsi.push(fin);
    }
    fs.writeFile('cache/pangan_per_provinsi2.json', JSON.stringify(hargaPanganPerProvinsi), err => {
      if(err) console.log('error write data harga pangan per provinsi');
      else console.log('done write data harga pangan per provinsi');
    })
  }

  public generateLokasiPangan = async() => {
    var generated:string[] = [];
    for(let i=0;i<34;i++){
      fs.readFile(`cache/pangan/prov_${(i+1)}.html`,'utf-8', (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const a = $('#filter_regency_ids > option', data);
          for(let j=0;j<a.length;j++){
            const tmp = `{"idProv":"${(i+1)}","id":"${a.eq(j).attr('value')}","lokasi":"${a.eq(j).text()}"},`
            console.log(tmp);
          }
        }
      })
    }
  }
}

const hargaPangan = new HargaPangan();
export default hargaPangan;