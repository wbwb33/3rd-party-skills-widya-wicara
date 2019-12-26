import fs from 'fs';
import { kuis_availability } from '../../db/models/kuis';
import { IKuisOnly, IKuis } from './types';
import { igniteSupport } from '../../ignite_support';

class KuisData {
  private getTodayQuiz = async (): Promise<IKuis[]> => {
    return new Promise((resolve, reject) => {
      console.log('getting quizes for today and reset all uuids to not done...');
      const cat = Math.floor(Math.random()*14)+1;
      fs.readFile(`dependent/kuis/${cat}.json`, (err, data) => {
        if (err) {
          console.log('data dependent kuis not found');
        } else {
          const content:IKuisOnly[] = JSON.parse(data.toString());
          const id: number = Math.floor(Math.random()*(content.length-10));
          // console.log(id+5);
          var kuisArr:IKuis[] = [];
          for(let i=id;i<(id+10);i++){
            const j=i-id;
            const tmp = {
              id: (j+1),
              q:content[i].pertanyaan,
              benar:content[i].benar,
              benar2:content[i].benar2,
              choice:content[i].choice
            }
            kuisArr.push(tmp);
          }
          resolve(kuisArr);
        }
      });
    })
  }

  /** main function for NEW DAY, get kuis from dependent, save to cache */
  public get = async (start: boolean) => {
    const data = await this.getTodayQuiz();
    // console.log(data);
    await this.saveToIgnite(data);
    !start??await this.updateNewDay();
    // fs.readFile(`dependent/kuis/${cat}.json`, (err, data) => {
    //   if (err) {
    //     console.log('data dependent kuis not found');
    //   } else {
    //     const content:KuisOnly[] = JSON.parse(data.toString());
    //     const id: number = Math.floor(Math.random()*(content.length-10));
    //     // console.log(id+5);
    //     var kuisArr:Kuis[] = [];
    //     for(let i=id;i<(id+10);i++){
    //       // console.log(i);
    //       // kuisArr.push(content[i]);
    //       const j=i-id;
    //         const tmp = {
    //           id: (j+1),
    //           q:content[i].pertanyaan,
    //           benar:content[i].benar,
    //           benar2:content[i].benar2,
    //           choice:content[i].choice
    //         }
    //         kuisArr.push(tmp);
    //     }
    //     // content.splice(id,10);
    //     // console.log(kuisArr);
        
    //     // fs.writeFile('cache/kuis_today.json', JSON.stringify(kuisArr), (err) => {
    //     //   if(err){
    //     //     console.log('cannot write data kuis today, maybe folder not yet created');
    //     //   } else {
    //     //     console.log("done write quizes for today in cache");
    //     //   }
    //     // });
    //     // fs.writeFile(`dependent/kuis/${cat}.json`, JSON.stringify(content), (err) => {
    //     //   if(err){
    //     //     console.log('cannot write new dependent data kuis');
    //     //   } else {
    //     //     console.log("done write new dependent data with deleted used quizes");
    //     //   }
    //     // });
    //   }
    // });
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

  /** save to ignite */
  private saveToIgnite = async(data:IKuis[]) => {
    try {
      await igniteSupport.insertGeneralWithoutClient(data,new IKuis(),'cacheQuiz');
    }
    catch (err) {
      console.log(err.message);
    }
  }

  /** cek if cache exist */
  public cacheCheck = async(ignite:any) => {
    const a = await igniteSupport.getCacheByName(ignite,'cacheQuiz',new IKuis());
    return a?true:false;
    // try {
    //   await igniteSupport.getCacheByName(ignite,'cacheQuizz',new IKuis());
    //   return true;
    // } catch (err) {
    //   // console.log(err.message);
    //   return false;
    // }
  }
}

const kuis = new KuisData();
export default kuis;