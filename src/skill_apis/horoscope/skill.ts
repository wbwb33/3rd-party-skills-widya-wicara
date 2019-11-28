import fs from 'fs';
import { Request, Response } from 'express-serve-static-core';
import { HoroscopeType, Content, Section } from '../../@types/skills/horoscope_type';
import Str from '../../utils/string';

class Horoscope {
  public index = async (req: Request, res: Response) => {
    const raw_sign = req.query.sign;
    const category = Str.sentenceCase(req.query.cat);
    const day = req.query.hari;

    let sign: string;
    if (raw_sign) {
      sign = Str.sentenceCase(raw_sign);
    } else {
      res.sendError("query sign can't be null");
    }

    if (raw_sign) {
      fs.readFile('cache/horoscope.json', (err, data) => {
        if (err) {
          res.sendError('horoscope not found');
        } else {
          const horoscopeData: HoroscopeType[] = JSON.parse(data.toString());
          const filteredHoroscope = horoscopeData
            .filter((element: HoroscopeType) => element.config.sign_title.includes(sign))
            .map((element: HoroscopeType) => {
              const filteredContent = category
                ? element.content.map(
                    (element: Content): Content => {
                      const section = element.section.filter((element: Section) => {
                        return element.section_title.includes(category);
                      });

                      const content: Content = {
                        day: element.day,
                        date_title: element.date_title,
                        timestamp: element.timestamp,
                        section: section.length !== 0 ? section : element.section,
                      };

                      return content;
                    },
                  )
                : element.content;

              if (day) {
                if (day.includes('besok')) {
                  return {
                    zodiak: element.config.sign_title,
                    content: filteredContent[1],
                  };
                } else if (day.includes('lusa')) {
                  return {
                    zodiak: element.config.sign_title,
                    content: filteredContent[2],
                  };
                }
              } else {
                return {
                  zodiak: element.config.sign_title,
                  content: filteredContent[0],
                };
              }
            });

          if (filteredHoroscope.length > 0) {
            res.send(filteredHoroscope[0]);
          } else {
            res.sendError('zodiak not found or null');
          }
        }
      });
    }
  };
}

const horoscope = new Horoscope();
export default horoscope;
