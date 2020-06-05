import fs from 'fs';
import { Request, Response } from 'express';
import { kuis_score_ramadan } from '../../db/models/kuis_ramadhan';
import { igniteSupport } from '../../ignite_support';
import { IKuis } from './types';
import { third_party } from '../../db/models/third_party';

class Kuis {

  /** main function for Can {uuid} Play Quiz for today? */
  public canWePlayQuiz = async (req: Request, res: Response) => {
    if(req.query.unlimited!="unlimited") {
      /** for limited attempt */
      const uuid = req.body.uuid;
      var ini = await this.isDone(uuid).then(async (thisRes)  => {
        if(!thisRes[0]) {
          await this.createNewIdAndPlay(uuid);
          // const quizToday = await this.getTodayQuiz(Math.floor(Math.random()*10));
          const quizToday = await this.getDataFromDb(Math.floor(Math.random()*10));
          return JSON.parse(`{"status": "success", "skill": "kuis-ramadhan", "allow": "yes", "first": "yes", "data": ${JSON.stringify(quizToday)}}`);
        } 
        else if(thisRes[0].done_today) {
          return JSON.parse(`{"status": "success", "skill": "kuis-ramadhan", "allow": "no"}`);
        } 
        else {
          // const quizToday = await this.getTodayQuiz(Math.floor(Math.random()*10));
          const quizToday = await this.getDataFromDb(Math.floor(Math.random()*10));
          return JSON.parse(`{"status": "success", "skill": "kuis-ramadhan", "allow": "yes", "first": "no", "data": ${JSON.stringify(quizToday)}}`);
        }
      });
      /** end */
    }

    else {
      /** for unlimited attempt */
      // const quizToday = await this.getTodayQuiz(Math.floor(Math.random()*10));
      const quizToday = await this.getDataFromDb(Math.floor(Math.random()*10));
      var ini = JSON.parse(`{"status": "success", "skill": "kuis-ramadhan", "allow": "yes", "first": "no", "data": ${JSON.stringify(quizToday)}}`);
      /** end */
    }

    res.send(ini);
  }

  /** get from db */
  private getDataFromDb = async (oneToTen: number) : Promise<object> => {
    const a = await third_party.findOne({
      where : {
        skill: 'kuis_ramadan'
      },
      attributes: ['data'],
      raw: true
    }).then(result => {
      return result!.data
    });

    return new Promise(async (resolve, reject) => {
      const tmp = JSON.parse(a);
      resolve(tmp[oneToTen])
    })
  }

  /** this function will get called IF ONLY we get chance to play quiz today (from isDone) */
  private getTodayQuiz = async (oneToTen: number): Promise<object> => {
    const data = await igniteSupport.getCacheByNameWithoutClient('cacheQuizRamadan',new IKuis());
    return new Promise((resolve, reject) => {
      resolve(data![oneToTen])
    })
  }

  /** this function only check availability of today's quiz for inputted uuid */
  private isDone = async (device_uuid: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      resolve(kuis_score_ramadan.findAll({
        where: {
          uuid: device_uuid
        },
      }))
    })
  }

  /** this function will create IF ONLY there are no {uuid} detected in db  */
  private createNewIdAndPlay = async (device_uuid: string) => {
    await kuis_score_ramadan.create({uuid: device_uuid ,score: 0, done_today: false});
  }

  /** increment score if mark's payload from chatbot's post return true */
  public updateScore = async (req: Request, res: Response) => {
    const payload = req.query ?? req.body;
    const uuidQ = payload.uuid;

    if(payload.mark==1) {
      kuis_score_ramadan.increment('score', {
        where: {
          uuid: uuidQ
        }
      });
      // console.log("true");
    } else {
      // console.log("false");
    }

    kuis_score_ramadan.update({
      done_today: true
    }, {
      where: {
        uuid: payload.uuid
      }
    })

    res.send(JSON.parse(`{"status": "success", "skill": "kuis-ramadhan", "message": "saved succesfully"}`));
  }
}

const kuis = new Kuis();
export default kuis;