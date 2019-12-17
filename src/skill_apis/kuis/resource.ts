import fs from 'fs';
import { Request, Response } from 'express';
import { kuis_availability } from '../../db/models/kuis';

class KuisData {
  /** main function for NEW DAY, get kuis from dependent, save to cache */
  public get = async () => {
    console.log('getting quizes for today and reset all uuids to not done...');
    const cat = Math.floor(Math.random()*14)+1;
    // console.log(cat);
    await this.updateNewDay();
    fs.readFile(`dependent/kuis/${cat}.json`, (err, data) => {
      if (err) {
        console.log('data dependent kuis not found');
      } else {
        const content = JSON.parse(data.toString());
        const id: number = Math.floor(Math.random()*(content.length-10));
        // console.log(id+5);
        var kuisArr = [];
        for(let i=id;i<(id+10);i++){
          // console.log(i);
          kuisArr.push(content[i]);
        }
        content.splice(id,10);
        // console.log(kuisArr);

        fs.writeFile('cache/kuis_today.json', JSON.stringify(kuisArr), (err) => {
          if(err){
            console.log('cannot write data kuis today, maybe folder not yet created');
          } else {
            console.log("done write quizes for today in cache");
          }
        });
        fs.writeFile(`dependent/kuis/${cat}.json`, JSON.stringify(content), (err) => {
          if(err){
            console.log('cannot write new dependent data kuis');
          } else {
            console.log("done write new dependent data with deleted used quizes");
          }
        });
      }
    });
  }
  
  /** this function will update all done_today to false, will ONLY GET CALLED AT NEW DAY */
  private updateNewDay = async () => {
    kuis_availability.update({
      done_today: false
    }, {
      where: {
        done_today: true
      }
    });
  }
}

const kuis = new KuisData();
export default kuis;