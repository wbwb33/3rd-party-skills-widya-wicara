import fs from 'fs';
import { Request, Response } from 'express';
import { kuis_availability } from '../../db/models/kuis';

class KuisData {
  public get = async () => {
    console.log('getting kuis data for today...');
    const cat = Math.floor(Math.random()*14)+1;
    console.log(cat);
    fs.readFile(`dependent/kuis/${cat}.json`, (err, data) => {
      if (err) {
        console.log('data kuis not found');
      } else {
        const content = JSON.parse(data.toString());
        const id: number = Math.floor(Math.random()*(content.length-5));
        console.log(id+5);
        var kuisArr = [];
        for(let i=id;i<(id+5);i++){
          console.log(i);
          kuisArr.push(content[i]);
        }
        content.splice(id,5);
        console.log(kuisArr);

        fs.writeFile('cache/kuis_today.json', JSON.stringify(kuisArr), (err) => {
          if(err){
            console.log('cannot write data kuis today');
          } else {
            console.log("done for today");
          }
        });
        fs.writeFile(`dependent/kuis/${cat}.json`, JSON.stringify(content), (err) => {
          if(err){
            console.log('cannot write new data kuis');
          } else {
            console.log("done new data");
          }
        });
      }
    });
  }
  
  public updateNewDay = async () => {

    kuis_availability.update({
      done_today: false
    }, {
      where: {
        done_today: true
      }
    });
  }

  // public tryAdd = async () => {
  //   kuis_availability.create({uuid: "haha2", score: 110, done_today: false});
  //   kuis_availability.create({uuid: "haha3", score: 130, done_today: true});
  // }
}

const kuis = new KuisData();
export default kuis;