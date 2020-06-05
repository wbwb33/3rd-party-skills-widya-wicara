import fs from 'fs';
import { Request, Response } from 'express';
import { kuis_score } from '../../db/models/kuis';
import { igniteSupport } from '../../ignite_support';
import { IKuis } from './types';
import { third_party } from '../../db/models/third_party';

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
    const quizToday = await this.getTodayQuiz(Math.floor(Math.random()*10));
    res.send(quizToday);
  }

  /** main function for Can {uuid} Play Quiz for today? */
  public canWePlayQuiz = async (req: Request, res: Response) => {
    if(req.query.unlimited!="unlimited") {
      /** uncomment for limited attempt */
      const uuid = req.body.uuid;
      var ini = await this.isDone(uuid).then(async (thisRes)  => {
        if(!thisRes[0]) {
          await this.createNewIdAndPlay(uuid);
          // const quizToday = req.query.fifty=="fifty"?await this.getTodayQuizFifty():await this.getTodayQuiz(Math.floor(Math.random()*10));
          const quizToday = req.query.fifty=="fifty"?await this.getTodayQuizFifty():await this.getDataFromDb(Math.floor(Math.random()*10));
          return JSON.parse(`{"status": "success", "skill": "kuis", "allow": "yes", "first": "yes", "data": ${JSON.stringify(quizToday)}}`);
        } 
        else if(thisRes[0].done_today) {
          return JSON.parse(`{"status": "success", "skill": "kuis", "allow": "no"}`);
        } 
        else {
          // const quizToday = req.query.fifty=="fifty"?await this.getTodayQuizFifty():await this.getTodayQuiz(Math.floor(Math.random()*10));
          const quizToday = req.query.fifty=="fifty"?await this.getTodayQuizFifty():await this.getDataFromDb(Math.floor(Math.random()*10));
          return JSON.parse(`{"status": "success", "skill": "kuis", "allow": "yes", "first": "no", "data": ${JSON.stringify(quizToday)}}`);
        }
      });
      /** end */
    }

    else {
      /** uncomment for unlimited attempt */
      // const quizToday = req.query.fifty=="fifty"?await this.getTodayQuizFifty():await this.getTodayQuiz(Math.floor(Math.random()*10));
      const quizToday = req.query.fifty=="fifty"?await this.getTodayQuizFifty():await this.getDataFromDb(Math.floor(Math.random()*10));
      var ini = JSON.parse(`{"status": "success", "skill": "kuis", "allow": "yes", "first": "no", "data": ${JSON.stringify(quizToday)}}`);
      /** end */
    }

    res.send(ini);
  }

  /** this function will get called IF ONLY we get chance to play quiz today (from isDone) */
  private getTodayQuizFifty = async (): Promise<object> => {
    return new Promise((resolve, reject) => {
      fs.readFile(`dependent/kuis/50_kuis.json`, (err, data) => {
        if (err) {
          console.log('cannot get 50 kuis');
        } else {
          const randomId = Math.floor(Math.random()*49);
          const parsedData:IKuis[] = JSON.parse(data.toString());
          resolve(parsedData[randomId]);
        }
      });
    })
  }

  /** get from db */
  private getDataFromDb = async (oneToTen: number) : Promise<object> => {
    const a = await third_party.findOne({
      where : {
        skill: 'kuis_umum'
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
    const data = await igniteSupport.getCacheByNameWithoutClient('cacheQuiz',new IKuis());
    return new Promise((resolve, reject) => {
      resolve(data![oneToTen])
    })
  }

  /** this function only check availability of today's quiz for inputted uuid */
  private isDone = async (device_uuid: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      resolve(kuis_score.findAll({
        where: {
          uuid: device_uuid
        },
      }))
    })
  }

  /** this function will create IF ONLY there are no {uuid} detected in db  */
  private createNewIdAndPlay = async (device_uuid: string) => {
    await kuis_score.create({uuid: device_uuid ,score: 0, done_today: false});
  }

  /** increment score if mark's payload from chatbot's post return true */
  public updateScore = async (req: Request, res: Response) => {
    // const payload = req.body;
    const payload = req.query ?? req.body;
    const uuidQ = payload.uuid;

    if(payload.mark==1) {
      kuis_score.increment('score', {
        where: {
          uuid: uuidQ
        }
      });
      // console.log("true");
    } else {
      // console.log("false");
    }

    kuis_score.update({
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