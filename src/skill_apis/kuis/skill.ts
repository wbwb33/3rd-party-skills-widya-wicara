import fs from 'fs';
import { Request, Response } from 'express';
import { kuis_availability } from '../../db/models/kuis';
import Str from '../../utils/string';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { reject } from 'async';

class Kuis {
  public index = async (req: Request, res: Response) => {
    fs.readFile('dependent/data_kuis.json', (err, data) => {
      if (err) {
        res.sendError('data kuis not found');
      } else {
        const content = JSON.parse(data.toString());
        const id = Math.floor(Math.random()*content.length);
        res.send(content[id]);
        content.splice(id,1);
        fs.writeFile('cache/kuis_today.json', JSON.stringify(content[id]), (err) => {
          if(err){
            res.sendError('cannot write data kuis today');
          } else {
            console.log("done for today");
          }
        })
        fs.writeFile('dependent/data_kuis.json', JSON.stringify(content), (err) => {
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
    fs.readFile('cache/kuis_today.json', (err, data) => {
      if(err){
        res.sendError('error read for today');
      } else {
        const content = JSON.parse(data.toString());
        res.send(content);
      }
    })
  }

  public updateId = async (req: Request, res: Response) => {
    const payload = req.body;
    console.log(payload);
    const device_uuid = payload.device_uuid;

    kuis_availability.create({uuid: device_uuid,score: 10, done_today: true});
  }

  public playQuiz = async () => {
    const ini = await this.isDone("haha2").then(async (res)  => {
      // console.log(res[0].uuid);
      if(res[0].done_today) {

        // return "try tomorrow";
      } else {
        await this.getTodayQuiz(Math.floor(Math.random()*5));
        // return "lets play";
      }
      
    });
    // return ini;
  }

  public canWePlayQuiz = async () => {
    const ini = await this.isDone("haha2").then(async (res)  => {
      // console.log(res[0].uuid);
      if(res[0].done_today) {

        // return "try tomorrow";
      } else {
        /* if we can play, then get random quiz from today's cache and send it back to chatbot */
        await this.getTodayQuiz(Math.floor(Math.random()*5));
      }
      
    });
    // return ini;
  }

  private getTodayQuiz = async (oneToFive: number): Promise<object> => {
    /* this function will get called IF ONLY we get chance to play quiz today */
    return new Promise((resolve, reject) => {
      fs.readFile('cache/kuis_today.json', (err, data) => {
        if(err){
          console.log(err);
          // res.sendError('file of quiz for today is not found');
        } else {
          const content = JSON.parse(data.toString());
          // console.log(content[oneToFive]);
          resolve(content[oneToFive]);
          // res.send(content[oneToFive]);
        }
      })
    })
  }

  private isDone = async (device_uuid: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      resolve(kuis_availability.findAll({
        where: {
          uuid: device_uuid
        },
      }))
    })
  }


  public updateScore = async (req: Request, res: Response) => {
    const payload = req.body;

    if(payload.mark==1) {
      kuis_availability.increment('score', {
        where: {
          uuid: payload.uuid
        }
      });
      console.log("true");
    } else {
      console.log("false");
    }
  }
}

const kuis = new Kuis();
export default kuis;