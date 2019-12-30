import rp from 'request-promise';
import $ from 'cheerio';
import fs from 'fs';
import async from 'async';
import {IHargaPanganPerProvinsi} from './types';
import {igniteSupport} from '../../ignite_support';

class HargaPangan {
  public get = async () => {
    var hrstart = process.hrtime();
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
    
    // make an iterator
    const range = {
      from: 0,
      to: 33,

      [Symbol.iterator]() {
        return {
          current: this.from,
          last: this.to,
          next() {
            if (this.current <= this.last) {
              return {
                done: false,
                value: this.current++,
              };
            } else {
              return { done: true };
            }
          },
        };
      },
    };

    let hargaPanganPerProvinsi:IHargaPanganPerProvinsi[] = [];

    async.forEachOf(
      range,
      async(id:any) => {
        if(id>=30) await new Promise(r => setTimeout(r, 60000));
        else if(id>=20) await new Promise(r => setTimeout(r, 40000));
        else if(id>=10) await new Promise(r => setTimeout(r, 20000));
        const form = JSON.parse(`{
          "task": "",
          "filter_commodity_ids[]": "0",
          "filter_all_commodities": "0",
          "format": "html",
          "price_type_id": "1",
          "${key}": "1",
          "filter_province_ids[]": "${(id+1)}",
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
        
        const fin = await rp(options)
          .then(data => {
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
            const fin: IHargaPanganPerProvinsi = {
              id:(id+1),
              lastUpdate:lastUpdated,
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
            hargaPanganPerProvinsi.push(fin);
            return fin;
          })
          .catch(error => console.log(error));

          await igniteSupport.insertGeneralByIdWithoutClient(fin,new IHargaPanganPerProvinsi(),"cacheHargaPangan",(id+1));
      },
      (err: any) => {
        if (err) console.log(err);
        else {
          const hrend = process.hrtime(hrstart);
          console.log(`succesfully writing cache: cacheHargaPangan, in ${hrend[0]}s ${hrend[1]}ms `);
          // fs.writeFile('cache/pangan_per_provinsi.json', JSON.stringify(hargaPanganPerProvinsi), err => {
          //   if(err) console.log('error write data harga pangan per provinsi tes');
          //   else console.log('done write data harga pangan per provinsi tes');
          // })
        }
      }
    )
  }

  public get2 = async () => {
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
            else {
              if(i%5==0||i==33){
                console.log(`done save html harga pangan prov ${(i+1)} of 34`);
              }
            }
          })
        })
        .catch(error => console.log(error))
    }
    this.getDataHargaPanganFromHtml();
  }

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
            id:(int+1),
            lastUpdate:lastUpdated,
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

  private getDataHargaPanganFromHtml = async() => {
    let hargaPanganPerProvinsi:IHargaPanganPerProvinsi[] = [];
    for(let i=0;i<34;i++){
      const fin:IHargaPanganPerProvinsi = await this.readFile(i);
      if(i%5==0||i==33){
        console.log(`done get harga pangan from html prov ${(i+1)} of 34`);
      }
      await this.delHtmlCacheAfterUse(i);
      hargaPanganPerProvinsi.push(fin);
    }
    // await igniteSupport.insertGeneralWithoutClient(hargaPanganPerProvinsi,new IHargaPanganPerProvinsi(),'cacheHargaPangan');
    fs.writeFile('cache/pangan_per_provinsi.json', JSON.stringify(hargaPanganPerProvinsi), err => {
      if(err) console.log('error write data harga pangan per provinsi');
      else console.log('done write data harga pangan per provinsi');
    })
  }

  private delHtmlCacheAfterUse = async(int:number) => {
    fs.unlink(`cache/pangan/prov_${(int+1)}.html`, (err) => {
      if (err) {
        console.error(err)
      }
    })
  }

  public cacheCheck = async(ignite:any) => {
    const a = await igniteSupport.getCacheByName(ignite,'cacheHargaPangan',new IHargaPanganPerProvinsi());
    return a?true:false;
  }

}

const hargaPangan = new HargaPangan();
export default hargaPangan;