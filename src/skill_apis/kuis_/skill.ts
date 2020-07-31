import { Request, Response } from 'express-serve-static-core';
import rp from 'request-promise';

class Kuis_ {
  public playQuiz = async (req: Request, res: Response) => {
    const url = 'play-quiz';
    const uuid = req.query.uuid;
    const requesting = await this.toAPI(url,uuid);
    res.send(JSON.parse(requesting));

  }

  public setUserPlayingToday = async (req: Request, res: Response) => {
    const url = 'set-user-playing-today';
    const uuid = req.query.uuid;
    const requesting = await this.toAPI(url,uuid);
    res.send(JSON.parse(requesting));

  }

  private toAPI = async (url: string, uuid: string) => {
    return new Promise<string>( async (resolve, reject) => {
    //   /merdeka/play-quiz/$uuid
    // api-quiz-master.merapi-dev.svc.cluster.local:5020/merdeka/set-user-playing-today/
      var options = {
        method: 'GET',
        uri: `http://api-quiz-master.merapi-dev.svc.cluster.local:5020/merdeka/${url}/${uuid}`,
      };

      await rp(options)
        .then((body: any) => {
          resolve(JSON.stringify(body));
        })
        .catch((err: any) => {
          reject(err);
        });
    })
  }

}

export const kuis_ = new Kuis_();
