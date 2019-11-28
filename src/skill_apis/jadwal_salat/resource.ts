import rp from 'request-promise';
import $ from 'cheerio';
import fs from 'fs';
import async from 'async';
import {TabelOne} from '../../db/models/tabel_one';
import {DataDevice, DataJadwalSalat, FinalData} from '../../@types/skills/jadwal_salat_type';

class AdzanResources {
  public index = async () => {
      const data_device = await this.getDataDevice();
      var temp_array: any[] = [];
      var final_array: FinalData[] = [];

      async.forEachOf(
        data_device,
        async(value, key, callback: async.ErrorCallback<Error>) => {
          let fin: any[]=[];
          const i = await this.getJadwalSalat(value[3]);
          const url = `http://jadwalsholat.pkpu.or.id/?id=${i+1}`;
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
          
              const subuh = new Date(`${yyyy}-${mm}-${dd} ${subuhJam}:00`);
              const dzuhur = new Date(`${yyyy}-${mm}-${dd} ${dzuhurJam}:00`);
              const ashar = new Date(`${yyyy}-${mm}-${dd} ${asharJam}:00`);
              const maghrib = new Date(`${yyyy}-${mm}-${dd} ${maghribJam}:00`);
              const isya = new Date(`${yyyy}-${mm}-${dd} ${isyaJam}:00`);

              fin = [value[0],subuh,dzuhur,ashar,maghrib,isya];
              temp_array.push(fin);
            })
            .catch(console.error);
          // callback();
        },
        (err: any) => {
          if (err) {
            console.log(err);
          } else {
            temp_array.forEach((value, key) => {
              final_array[key] = {
                uuid: value[0],
                subuh: value[1],
                dzuhur: value[2],
                ashar: value[3],
                maghrib: value[4],
                isya: value[5]
              }
            });
            return TabelOne.create(final_array[0]);
          }
        }
      )
    
  }

  private getDataDevice = async (): Promise<string[][]> => {
    return new Promise((resolve,reject) => {
      fs.readFile('dependent/data_device.json', (err,data) => {
        if (err) {
          reject(err);
        } else {
          const data_device: DataDevice[] = JSON.parse(data.toString());
          // console.log(data_device);
          const dataProcessed = data_device.map(val => {
            let temp = [
              val.device_uuid, 
              val.gps_lat, 
              val.gps_long, 
              val.gps_address.split(',')[val.gps_address.split(',').length-2].trim().toLowerCase()
            ];
            return temp;
          });
          resolve(dataProcessed);
        }
      })
    })
  }

  private getJadwalSalat = async (lok: string): Promise<number> => {
    return new Promise((resolve,reject) => {
      fs.readFile('dependent/index_lokasi.json', (err,data) => {
        if (err) {
          reject(err);
        } else {
          const temp = JSON.parse(data.toString());
          let x: number = 999;
          for(let i=0;i<temp.length;i++){
            if(lok === temp[i].toLowerCase()){
              x = i;
              break;
            }
          }
          resolve(x);
        }
      })
    })
  }
}

const adzanRes = new AdzanResources();
export default adzanRes;