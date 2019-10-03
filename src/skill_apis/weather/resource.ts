import fs from 'fs';
import { bmkg_xml, translateCodeCuaca, formattedDatetime } from './bmkg_data';
import { parseString } from 'xml2js';
import request from 'request';
import {
  WeatherData,
  AreaElement,
  ParameterElement,
  TimerangeElement,
  FormattedWeatherData,
} from '../../@types/skills/weather';
import async from 'async';

class BMKG {
  public get = async () => {
    const self = this;
    const dataArray: FormattedWeatherData[] = [];

    // tslint:disable-next-line: no-console
    console.log('getting weather data...');

    async.forEachOf(
      bmkg_xml,
      (link: string, key: string | number, callback: async.ErrorCallback<Error>) => {
        request(link, (error: Error, response: request.Response, body: any) => {
          if (!error && response.statusCode === 200) {
            // parse XML to Json
            parseString(response.body, (err: Error, result) => {
              // format the incoming data
              const data: FormattedWeatherData[] = self.formatDataBmkg(result);

              if (err) {
                // tslint:disable-next-line: no-console
                console.log(err);
              } else {
                data.forEach(e => dataArray.push(e));
              }
              callback();
            });
          }
        });
      },
      (err: any) => {
        if (err) {
          // tslint:disable-next-line: no-console
          console.log(err);
        } else {
          fs.writeFile('cache/weather.json', JSON.stringify(dataArray), 'utf-8', e => {
            if (e) {
              // tslint:disable-next-line: no-console
              console.log(e);
            } else {
              // tslint:disable-next-line: no-console
              console.log('done get weather');
            }
          });
        }
      },
    );
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
