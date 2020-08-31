import { status_game } from '../../db/models/status_game';
import { Request, Response } from 'express';

class StatusGame {

  public cekStatus = async (req: Request, res: Response) => {
    const uuid = req.query.uuid;
    let game = req.query.game;

    if(game=='sambungayat') game = 'sambung_ayat';
    else game = 'error';

    if(game=='error') return res.send(JSON.parse('{"status":"error","message":"cannot find game or game is undefined"}'));
    else {
      const ifNull = await this.getDataFromDb(uuid);
      console.log(typeof ifNull);
      let first;
      
      if(!ifNull){
        await this.createNewId(uuid,game);
        first = 'yes';
      }
      else if((typeof ifNull == 'object')) first = 'no';
      else return res.send(JSON.parse(`{"status":"error","message":"error getting data from db"}`));

      return res.send(JSON.parse(`{"status":"success","message":"game sambung ayat","data":{"uuid":"${uuid}","first":"${first}"}}`))
    }
  }

  private getDataFromDb = async (uuid: string)=> {
    return await status_game.findOne({
      where : {
        uuid
      },
      raw: true
    }).then(result => {
      return result;
    }).catch(e => {
      return e.message;
    });
  }

  private createNewId = async (uuid: string, game: string) => {
    await status_game.create({uuid, [game]: true});
  }

}

export const statusGame = new StatusGame();