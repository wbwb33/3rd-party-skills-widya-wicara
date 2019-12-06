import { Request, Response } from 'express-serve-static-core';
import fs from 'fs';
import ss from 'sentence-similarity';

class FaqSkill {
  public index = async(req: Request, res: Response) => {
    const msg = req.query.msg;
    const respond = await this.findSimilar(msg);
    // console.log(JSON.parse(respond));
    res.send(JSON.parse(respond));
  }

  private findSimilar = async (str: string): Promise<string> => {
    let similarity = ss.sentenceSimilarity;
    let similarityScore = ss.similarityScore;
    let msg = str.toLowerCase().replace(/[^a-z|\s]+/g,"").split(" ");
    let winkOpts = { f: similarityScore.winklerMetaphone, options : {threshold: 0} }
    return new Promise((resolve,reject) => {
      fs.readFile('dependent/faq.json', (err,data) => {
        if (err) {
          reject(err);
        } else {
          const a = JSON.parse(data.toString());
          for(let i=0;i<a.length;i++){
            // if((i/1000)%1==0){
            //   console.log(i);
            // }
            if(a[i].respond){
              var resp = a[i].respond;
            }
            var strCompare = a[i].keywords.toLowerCase().replace(/[^a-z|\s]+/g,"").split(" ");
            if(similarity(msg,strCompare,winkOpts).exact==strCompare.length){
              let result = `{"detected": "${a[i].keywords}","respond": ${JSON.stringify(resp)}}`;
              // console.log("detected:"+strCompare);
              resolve(result);
              break;
            }
          }
        }
      })
    })
  }
}

const faqSkill = new FaqSkill();
export default faqSkill;
