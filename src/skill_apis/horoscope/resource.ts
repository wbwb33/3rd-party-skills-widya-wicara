import { HoroscopeType } from '../../@types/skills/horoscope_type';
import request from 'request-promise';
import fs from 'fs';
import async from 'async';

class HoroscopeData {
  public get = async () => {
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
        await request(element)
          .then((htmlString: HoroscopeType) => {
            // console.log(id);
            // push the data arrived into the array
            dataArray.push(htmlString);
          })
          .catch(err => {
            console.log(err);
          });
        callback();
      },
      (err: any) => {
        if (err) {
          console.log(err);
        } else {
          // create a file with the data collected
          fs.writeFile('cache/horoscope.json', `[${dataArray}]`, 'utf-8', e => {
            if (e) {
              console.log(e);
            } else {
              console.log('done get horoscope');
            }
          });
        }
      },
    );
  }
}

const horoscope = new HoroscopeData();
export default horoscope;
