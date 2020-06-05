import { HoroscopeType, OneBigStringForHoroscopeCache } from './types';
import request from 'request-promise';
import fs from 'fs';
import async from 'async';
import { igniteSupport } from '../../ignite_support';
import { third_party } from '../../db/models/third_party';

class HoroscopeData {
  public get = async () => {
    const hrstart = process.hrtime();
    console.log('getting horoscope data...');

    // make an iterator
    const range = {
      from: 0,
      to: 11,

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

    // declare an array
    const dataArray: HoroscopeType[] = [];

    // start a call to api and iterate
    async.forEachOf(
      range,
      async (id: any, key: any, callback: async.ErrorCallback<Error>) => {
        // set the api
        const element = `http://wb.mon-horoscope-du-jour.com/widyawicara.com/webservicejson.php?sign_id=${id}&tz=Asia/Makassar`;

        // call the api with the iteration
        const task = await request(element)
          .then((htmlString) => {
            // push the data arrived into the array
            // dataArray.push(htmlString);
            // const tmp: OneBigStringForHoroscopeCache = {
            //   id: (id+1),
            //   str: JSON.stringify(htmlString)
            // };
            // return tmp;
            // if(id==1) htmlString.replace(/(\r\n|\n|\r)/g,"").replace('"{','{').replace('}"','}');
            // return JSON.parse(htmlString.replace(/(\r\n|\n|\r)/g,"").replace(" : ",":"));
            // console.log(JSON.parse(htmlString));
            return (htmlString.replace(/(\r\n|\n|\r)/g,""));
          })
          .catch(err => {
            console.log(err);
          });

        await this.saveToDb((task),id+1);
        // await igniteSupport.insertGeneralByIdWithoutClient(task, new OneBigStringForHoroscopeCache(), 'cacheHoroscope', (id+1));
      },
      (err: any) => {
        if (err) {
          console.log(err);
        } else {
          const hrend = process.hrtime(hrstart);
          console.log(`succesfully writing cache: cacheHoroscope, in ${hrend[0]}s ${hrend[1]}ms `);
          // create a file with the data collected
          // fs.writeFile('cache/horoscope.json', `[${dataArray}]`, 'utf-8', e => {
          //   if (e) {
          //     console.log(e);
          //   } else {
          //     console.log('done get horoscope');
          //   }
          // });
        }
      },
    );
  }

  /** save to db */
  private saveToDb = async(dataToSave:any, id:number) => {
    try {
      await third_party.findAll({
        where: {
          skill: `horoskop_${id}`
        },
      }).then(async (data) => {
        if(!data[0]){
          await third_party.create({skill: `horoskop_${id}`, data: ''});
        }

        await third_party.update({
          data: JSON.stringify(dataToSave)
        }, {
          where: {
            skill: `horoskop_${id}`
          }
        })
      })
    }
    catch (err) {
      console.log(err.message+' at resource horoskop');
    }
  }

  /** cek if cache exist */
  public cacheCheck = async(ignite:any) => {
    const a = await igniteSupport.getCacheByName(ignite,'cacheHoroscope',new OneBigStringForHoroscopeCache());
    return a?true:false;
  }
}

const horoscope = new HoroscopeData();
export default horoscope;
