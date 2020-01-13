import fs from 'fs';
import { Request, Response } from 'express';
import { FixedWeather, OneBigStringForWeatherCache } from './types';
import Str from '../../utils/string';
import { igniteSupport } from '../../ignite_support';

class Weather {
  public index = async (req: Request, res: Response) => {
    const rawcity = req.query.kota;

    let city: string;
    if (rawcity) {
      city = Str.capitalizeEachWord(rawcity);
    } else {
      res.sendError("query kota can't be null");
    }

    const day = req.query.hari;

    if (rawcity) {
      const fixedWeather: FixedWeather[] = await this.getDataFromCache();
      const weatherData = fixedWeather
        .filter((element: FixedWeather) => element.kota.includes(city))
        .map((element: FixedWeather) => {
          if (day) {
            if (day.includes('besok')) {
              return {
                provinsi: element.provinsi,
                kota: element.kota,
                parameter: element.parameter[1],
              };
            } else if (day.includes('lusa')) {
              return {
                provinsi: element.provinsi,
                kota: element.kota,
                parameter: element.parameter[2],
              };
            }
          } else {
            return {
              provinsi: element.provinsi,
              kota: element.kota,
              parameter: element.parameter[0],
            };
          }
        });

      if (weatherData.length > 1) {
        res.send(weatherData[1]);
      } else if (weatherData.length > 0) {
        res.send(weatherData[0]);
      } else {
        res.sendError('city not found or null');
      }
    }

    // if (rawcity) {
    //   fs.readFile('cache/weather.json', (err, data) => {
    //     if (err) {
    //       res.sendError('location not found');
    //     } else {
    //       const fixedWeather: FixedWeather[] = JSON.parse(data.toString());
    //       const weatherData = fixedWeather
    //         .filter((element: FixedWeather) => element.kota.includes(city))
    //         .map((element: FixedWeather) => {
    //           if (day) {
    //             if (day.includes('besok')) {
    //               return {
    //                 provinsi: element.provinsi,
    //                 kota: element.kota,
    //                 parameter: element.parameter[1],
    //               };
    //             } else if (day.includes('lusa')) {
    //               return {
    //                 provinsi: element.provinsi,
    //                 kota: element.kota,
    //                 parameter: element.parameter[2],
    //               };
    //             }
    //           } else {
    //             return {
    //               provinsi: element.provinsi,
    //               kota: element.kota,
    //               parameter: element.parameter[0],
    //             };
    //           }
    //         });

    //       if (weatherData.length > 1) {
    //         res.send(weatherData[1]);
    //       } else if (weatherData.length > 0) {
    //         res.send(weatherData[0]);
    //       } else {
    //         res.sendError('city not found or null');
    //       }
    //     }
    //   });
    // }
      // jika provinsi error atau tidak ditemukan
    else {
      res.sendError('provinsi not found or null');
    }
  };

  private getDataFromCache = async () : Promise<FixedWeather[]> => {
    const data = await igniteSupport.getCacheByNameWithoutClient('cacheWeather',new OneBigStringForWeatherCache());
    return new Promise((resolve, reject) => {
      resolve(JSON.parse(data![0].str))
    })
  }

  // private findWeather = async () => {
  //   const weatherData = fixedWeather
  //     .filter((element: FixedWeather) => element.kota.includes(city))
  //     .map((element: FixedWeather) => {
  //       if (day) {
  //         if (day.includes('besok')) {
  //           return {
  //             provinsi: element.provinsi,
  //             kota: element.kota,
  //             parameter: element.parameter[1],
  //           };
  //         } else if (day.includes('lusa')) {
  //           return {
  //             provinsi: element.provinsi,
  //             kota: element.kota,
  //             parameter: element.parameter[2],
  //           };
  //         }
  //       } else {
  //         return {
  //           provinsi: element.provinsi,
  //           kota: element.kota,
  //           parameter: element.parameter[0],
  //         };
  //       }
  //     });
  // }
}

const weather = new Weather();
export default weather;
