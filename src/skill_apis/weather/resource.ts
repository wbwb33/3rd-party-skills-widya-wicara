import fs from 'fs';
import { bmkg_xml, translateCodeCuaca, formattedDatetime } from './bmkg_data';
import { parseString } from 'xml2js';
import request from 'request-promise';
import {
  WeatherData,
  AreaElement,
  ParameterElement,
  TimerangeElement,
  FormattedWeatherData,
  OneBigStringForWeatherCache,
} from './types';
import async from 'async';
import { igniteSupport } from '../../ignite_support';

class BMKG {
  public get = async () => {
    console.log('getting weather data...');
    const a = await this.getDataFromXMLs();
    await this.saveToIgnite(a);
  }

  public getDataFromXMLs = async (): Promise<FormattedWeatherData[]> => {
    const self = this;
    const dataArray: FormattedWeatherData[] = [];
    
    return new Promise((resolve,reject) => {
      async.forEachOf(
        bmkg_xml,      
        async (link: string) => {
          await request(link)
            .then((response) => {
              // console.log(link);
              // parse XML to Json
              parseString(response, (err: Error, result) => {
                // format the incoming data
                const data: FormattedWeatherData[] = self.formatDataBmkg(result);

                if (err) {
                  console.log(err);
                } else {
                  data.forEach(e => dataArray.push(e));
                }
              });
            })
            .catch(e => {
              console.log(e);
            })
        },
        (err: any) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(dataArray);
              // await this.saveToIgnite(dataArray);
              // fs.writeFile('cache/weather.json', JSON.stringify(dataArray), 'utf-8', e => {
              //   if (e) {
              //     console.log(e);
              //   } else {
              //     console.log('done get weather');
              //   }
              // });
            }
        },
      );
    })
  }

  /** save to ignite */
  private saveToIgnite = async(data:FormattedWeatherData[]) => {
    try {
      // console.log(data.length);
      const oneDataWeather = JSON.parse(`[{"id":1}]`);
      oneDataWeather[0].str = JSON.stringify(data);
      // console.log(oneDataWeather);
      await igniteSupport.insertGeneralWithoutClient(oneDataWeather,new OneBigStringForWeatherCache(),'cacheWeather');
    }
    catch (err) {
      console.log(err.message+' at resource weather');
    }
  }

  /** cek if cache exist */
  public cacheCheck = async(ignite:any) => {
    const a = await igniteSupport.getCacheByName(ignite,'cacheWeather',new OneBigStringForWeatherCache());
    return a?true:false;
  }

  private formatDataBmkg(json: WeatherData): FormattedWeatherData[] {
    const data = json.data.forecast[0].area
      // filter duplicate data
      .filter((element: AreaElement, index: number, inputArray: AreaElement[]) => {
        return inputArray.indexOf(element) === index;
      })
      // filter empty array
      .filter((element: AreaElement) => {
        return element.parameter != null;
      })
      // map output of the data
      .map((area: AreaElement) => {
        // get the minimal temperature value
        const temp_min = area.parameter
          .filter((params: ParameterElement) => {
            return params.$.id === 'tmin';
          })
          .map((params: ParameterElement) => {
            return params.timerange.map((timerange: TimerangeElement) => {
              const dateTime = timerange.$.day ? formattedDatetime(timerange.$.day) : timerange.$.day;
              return {
                date: dateTime,
                value: timerange.value[0]._,
              };
            });
          });

        // get the maximum temperature value
        const temp_max = area.parameter
          .filter((params: ParameterElement) => {
            return params.$.id === 'tmax';
          })
          .map((params: ParameterElement) => {
            return params.timerange.map((timerange: TimerangeElement) => {
              const dateTime = timerange.$.day ? formattedDatetime(timerange.$.day) : timerange.$.day;
              return {
                date: dateTime,
                value: timerange.value[0]._,
              };
            });
          });

        // get the weather
        const weather = area.parameter
          .filter((params: ParameterElement) => {
            return params.$.id === 'weather';
          })
          // take the value of weahter by hour in three days
          .map((params: ParameterElement) => {
            const weahter = params.timerange
              .filter((timerange: TimerangeElement) => {
                return (
                  timerange.$.h === '6' ||
                  timerange.$.h === '18' ||
                  timerange.$.h === '30' ||
                  timerange.$.h === '42' ||
                  timerange.$.h === '54' ||
                  timerange.$.h === '66'
                );
              })
              .map((timerange: TimerangeElement) => {
                const codeCuaca = translateCodeCuaca(parseInt(timerange.value[0]._, 10));
                const dateTime = formattedDatetime(timerange.$.datetime);
                return {
                  date: dateTime,
                  value: codeCuaca,
                };
              });
            return weahter;
          })
          // simplify the output
          .map((val: Array<{ date: string; value: string }>) => {
            return [
              {
                date: val[0].date,
                siang: val[0].value,
                malam: val[1].value,
              },
              {
                date: val[2].date,
                siang: val[2].value,
                malam: val[3].value,
              },
              {
                date: val[4].date,
                siang: val[4].value,
                malam: val[5].value,
              },
            ];
          });

        // simplify again to reduce the file size
        const format = {
          provinsi: area.$.domain,
          kota: area.name[1]._,
          parameter: [
            {
              date: temp_min[0][0].date,
              temp_min: temp_min[0][0].value,
              temp_max: temp_max[0][0].value,
              weather_day: weather[0][0].siang,
              weather_night: weather[0][0].malam,
            },
            {
              date: temp_min[0][1].date,
              temp_min: temp_min[0][1].value,
              temp_max: temp_max[0][1].value,
              weather_day: weather[0][1].siang,
              weather_night: weather[0][1].malam,
            },
            {
              date: temp_min[0][2].date,
              temp_min: temp_min[0][2].value,
              temp_max: temp_max[0][2].value,
              weather_day: weather[0][2].siang,
              weather_night: weather[0][2].malam,
            },
          ],
        };
        return format;
      });

    return data;
  }
}

const bmkg = new BMKG();
export default bmkg;
