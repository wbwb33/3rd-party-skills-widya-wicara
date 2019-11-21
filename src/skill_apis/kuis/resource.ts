import fs from 'fs';
import { Request, Response } from 'express';

class KuisData {
  public get = async () => {
    console.log('getting kuis data for today...');
    fs.readFile('dependent/data_kuis.json', (err, data) => {
      if (err) {
        console.log('data kuis not found');
      } else {
        const content = JSON.parse(data.toString());
        const id = Math.floor(Math.random()*content.length);
        content.splice(id,1);
        fs.writeFile('cache/kuis_today.json', JSON.stringify(content[id]), (err) => {
          if(err){
            console.log('cannot write data kuis today');
          } else {
            console.log("done for today");
          }
        })
        fs.writeFile('dependent/data_kuis.json', JSON.stringify(content), (err) => {
          if(err){
            console.log('cannot write new data kuis');
          } else {
            console.log("done new data");
          }
        })
      }
    });
  }
}

const kuis = new KuisData();
export default kuis;