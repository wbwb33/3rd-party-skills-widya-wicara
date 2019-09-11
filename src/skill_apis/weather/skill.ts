import fs from 'fs';
import { Request, Response } from 'express';
import { translateCodeCuaca, formattedDatetime } from './bmkg_data';
import { WeatherData, ForecastElement, AreaElement, ParameterElement } from '../../@types/skills/weather';

class Weather {

    public index = async (req: Request, res: Response) => {
        const province = req.query.provinsi;
        const rawcity = req.query.kota;

        let city: string;
        if (rawcity) {
            city = rawcity.toLowerCase()
                .split(' ')
                .map((s: string) => s.charAt(0).toUpperCase() + s.substring(1))
                .join(' ');
        } else {
            res.sendError("query kota can't be null");
        }

        const day = req.query.hari;
        const time = req.query.waktu;

        if (province) {
            fs.readFile('cache/' + province + '.json', (err, data) => {
                if (err) {
                    res.sendError("location not found")
                } else {

                    let weather: WeatherData = JSON.parse(data.toString());
                    let weatherData = weather.data.forecast
                        .filter((element: ForecastElement) =>
                            element.area.some((area: AreaElement) => area.name[0]._ === city))

                        .map((element: ForecastElement) => {
                            let rawElm = Object.assign({}, element); // copies element
                            return rawElm.area.filter((area: AreaElement) => area.name[0]._ === city);
                        })

                        .map((element: AreaElement[]) => {
                            let elm = element[0]
                            let temperatur = elm.parameter
                                .filter((params: ParameterElement) => params.$.id === 't')
                                .map((temp: ParameterElement) => {
                                    if (day === 'besok') {
                                        switch (time) {
                                            case 'siang':
                                                return temp.timerange[5].value[0]._;
                                            case 'sore':
                                                return temp.timerange[6].value[0]._;
                                            case 'malam':
                                                return temp.timerange[7].value[0]._;
                                            default:
                                                return temp.timerange[4].value[0]._;
                                        }
                                    } else if (day === 'lusa') {
                                        switch (time) {
                                            case 'siang':
                                                return temp.timerange[8].value[0]._;
                                            case 'sore':
                                                return temp.timerange[9].value[0]._;
                                            case 'malam':
                                                return temp.timerange[10].value[0]._;
                                            default:
                                                return temp.timerange[11].value[0]._;
                                        }
                                    } else {
                                        switch (time) {
                                            case 'siang':
                                                return temp.timerange[1].value[0]._;
                                            case 'sore':
                                                return temp.timerange[2].value[0]._;
                                            case 'malam':
                                                return temp.timerange[3].value[0]._;
                                            default:
                                                return temp.timerange[0].value[0]._;
                                        }
                                    };
                                });

                            let codeCuaca = elm.parameter
                                .filter((params: ParameterElement) => params.$.id === 'weather')
                                .map((weather: ParameterElement) => {
                                    if (day === 'besok') {
                                        switch (time) {
                                            case 'siang':
                                                return weather.timerange[5].value[0]._;
                                            case 'sore':
                                                return weather.timerange[6].value[0]._;
                                            case 'malam':
                                                return weather.timerange[7].value[0]._;
                                            default:
                                                return weather.timerange[4].value[0]._;
                                        }
                                    } else if (day === 'lusa') {
                                        switch (time) {
                                            case 'siang':
                                                return weather.timerange[8].value[0]._;
                                            case 'sore':
                                                return weather.timerange[9].value[0]._;
                                            case 'malam':
                                                return weather.timerange[10].value[0]._;
                                            default:
                                                return weather.timerange[11].value[0]._;
                                        }
                                    } else {
                                        switch (time) {
                                            case 'siang':
                                                return weather.timerange[1].value[0]._;
                                            case 'sore':
                                                return weather.timerange[2].value[0]._;
                                            case 'malam':
                                                return weather.timerange[3].value[0]._;
                                            default:
                                                return weather.timerange[0].value[0]._;
                                        }
                                    }
                                });

                            let datetime = elm.parameter
                                .filter((params: ParameterElement) => params.$.id === 't')
                                .map((temp: ParameterElement) => {
                                    if (day === 'besok') {
                                        switch (time) {
                                            case 'siang':
                                                return temp.timerange[5].$.datetime;
                                            case 'sore':
                                                return temp.timerange[6].$.datetime;
                                            case 'malam':
                                                return temp.timerange[7].$.datetime;
                                            default:
                                                return temp.timerange[4].$.datetime;
                                        }
                                    } else if (day === 'lusa') {
                                        switch (time) {
                                            case 'siang':
                                                return temp.timerange[8].$.datetime;
                                            case 'sore':
                                                return temp.timerange[9].$.datetime;
                                            case 'malam':
                                                return temp.timerange[10].$.datetime;
                                            default:
                                                return temp.timerange[11].$.datetime;
                                        }
                                    } else {
                                        switch (time) {
                                            case 'siang':
                                                return temp.timerange[1].$.datetime;
                                            case 'sore':
                                                return temp.timerange[2].$.datetime;
                                            case 'malam':
                                                return temp.timerange[3].$.datetime;
                                            default:
                                                return temp.timerange[0].$.datetime;
                                        }
                                    };
                                });

                            let cuaca = translateCodeCuaca(parseInt(codeCuaca[0]));
                            let dateTime = formattedDatetime(datetime[0]);

                            let tunedElm = {
                                provinsi: elm.$.domain,
                                kota: elm.name[0]._,
                                parameter: {
                                    datetime: dateTime,
                                    temperatur: temperatur[0],
                                    cuaca: cuaca
                                }
                            };

                            return tunedElm;
                        });

                    if (weatherData[0]) {
                        res.send(weatherData[0]);
                    } else {
                        res.sendError("city not found or null");
                    }
                };
            });

            // jika provinsi error atau tidak ditemukan
        } else {
            res.sendError("provinsi not found or null");
        };
    };

}

const weather = new Weather()
export default weather;