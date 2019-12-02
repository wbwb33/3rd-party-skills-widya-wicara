import fs from 'fs';
import { Request, Response } from 'express';
import { kuis_availability } from '../../db/models/kuis';
import Str from '../../utils/string';
import { CLIENT_RENEG_LIMIT } from 'tls';
import { reject } from 'async';

class Kuis {
  /** for debugging purpose only */
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

  /** for debugging purpose only */
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

  /** test only, delete soon */
  public playQuiz = async () => { //req, res. dev uuid
    const uuid = "haha25";
    const ini = await this.isDone(uuid).then(async (res)  => {
      if(!res[0]) {
        // console.log("not set yet");
        await this.createNewIdAndPlay(uuid);
        const quizToday = await this.getTodayQuiz(Math.floor(Math.random()*5));
        return JSON.parse(`{"status": "success", "skill": "kuis", "allow": "yes", "data": ${JSON.stringify(quizToday)}}`);
      } else if(res[0].done_today) {
        return JSON.parse(`{"status": "success", "skill": "kuis", "allow": "no"}`);
      } else {
        const quizToday = await this.getTodayQuiz(Math.floor(Math.random()*5));
        return JSON.parse(`{"status": "success", "skill": "kuis", "allow": "yes", "data": ${JSON.stringify(quizToday)}}`);
        // return "lets play";
      }
    });
    return ini;
    
  }

  /** main function for Can {uuid} Play Quiz for today? */
  public canWePlayQuiz = async (req: Request, res: Response) => {
    const uuid = req.body.uuid;
    const ini = await this.isDone(uuid).then(async (thisRes)  => {
      if(!thisRes[0]) {
        // console.log("not set yet");
        await this.createNewIdAndPlay(uuid);
        const quizToday = await this.getTodayQuiz(Math.floor(Math.random()*5));
        return JSON.parse(`{"status": "success", "skill": "kuis", "allow": "yes", "data": ${JSON.stringify(quizToday)}}`);
      } else if(thisRes[0].done_today) {
        return JSON.parse(`{"status": "success", "skill": "kuis", "allow": "no"}`);
      } else {
        const quizToday = await this.getTodayQuiz(Math.floor(Math.random()*5));
        return JSON.parse(`{"status": "success", "skill": "kuis", "allow": "yes", "data": ${JSON.stringify(quizToday)}}`);
        // return "lets play";
      }
    });
    // return ini;
    res.send(ini);
  }

  /** this function will get called IF ONLY we get chance to play quiz today (from isDone) */
  private getTodayQuiz = async (oneToFive: number): Promise<object> => {
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

  /** this function only check availability of today's quiz for inputted uuid */
  private isDone = async (device_uuid: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      resolve(kuis_availability.findAll({
        where: {
          uuid: device_uuid
        },
      }))
    })
  }

  /** this function will create IF ONLY there are no {uuid} detected in db  */
  private createNewIdAndPlay = async (device_uuid: string) => {
    await kuis_availability.create({uuid: device_uuid ,score: 0, done_today: false});
  }

  /** increment score if mark's payload from chatbot's post return true */
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

    kuis_availability.update({
      done_today: true
    }, {
      where: {
        uuid: payload.uuid
      }
    })

    res.send(JSON.parse(`{"status": "success", "skill": "kuis", "message": "saved succesfully"}`));
  }
}

const kuis = new Kuis();
export default kuis;