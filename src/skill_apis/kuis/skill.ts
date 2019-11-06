import fs from 'fs';
import { Request, Response } from 'express';
import Str from '../../utils/string';
import { CLIENT_RENEG_LIMIT } from 'tls';

class Kuis {
  public index = async (req: Request, res: Response) => {
    fs.readFile('cache/data_kuis.json', (err, data) => {
      if (err) {
        res.sendError('data kuis not found');
      } else {
        const content = JSON.parse(data.toString());
        const id = Math.floor(Math.random()*content.length);
        res.send(content[id]);
        content.splice(id,1);
        fs.writeFile('cache/data_kuis_today.json', JSON.stringify(content[id]), (err) => {
          if(err){
            res.sendError('cannot write data kuis today');
          } else {
            console.log("done for today");
          }
        })
        fs.writeFile('cache/data_kuis.json', JSON.stringify(content), (err) => {
          if(err){
            res.sendError('cannot write new data kuis');
          } else {
            console.log("done new data");
          }
        })
      }
    });
  };

  public today = async (req: Request, res: Response) => {
    fs.readFile('cache/data_kuis_today.json', (err, data) => {
      if(err){
        res.sendError('error read for today');
      } else {
        const content = JSON.parse(data.toString());
        res.send(content);
      }
    })
  }
}

const kuis = new Kuis();
export default kuis;