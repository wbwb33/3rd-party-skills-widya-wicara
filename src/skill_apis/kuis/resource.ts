import fs from 'fs';
import { kuis_score } from '../../db/models/kuis';
import { kuis_score_ramadan } from '../../db/models/kuis_ramadhan';
import { IKuisOnly, IKuis } from './types';
import { igniteSupport } from '../../ignite_support';

class KuisData {
  /** delete TEN used quiz from dependent */
  private delUsedQuiz = async (cat:number, content:IKuisOnly[]) => {
    fs.writeFile(`dependent/kuis/${cat}.json`, JSON.stringify(content), (err) => {
      if(err){
        console.log('cannot write new dependent data kuis');
      } else {
        console.log("done write new dependent data with deleted used quizes");
      }
    });
  }

  /** function for get TEN today quiz from dependent */
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
          content.splice(id,10);
          this.delUsedQuiz(cat,content);
          resolve(kuisArr);
        }
      });
    })
  }

  /** main function for NEW DAY, get kuis from dependent, save to cache */
  public get = async () => {
    const data = await this.getTodayQuiz();
    await this.saveToIgnite(data);
    await this.updateNewDay();
  }
  
  /** dev only */
  public reset = async () => {
    await this.updateNewDay();
  }

  /** this function will update all done_today to false, will ONLY GET CALLED AT NEW DAY */
  private updateNewDay = async () => {
    kuis_score.update({
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
  }



  /** kuis ramadan */
  /** function for get TEN today quiz from dependent */
  private getTodayQuizRamadan = async (): Promise<IKuis[]> => {
    return new Promise((resolve, reject) => {
      console.log('getting ramadhan quizes for today and reset all uuids to not done...');
      fs.readFile(`dependent/kuis/ramadhan.json`, (err, data) => {
        if (err) {
          console.log('data dependent kuis ramadan not found');
        } else {
          const content:IKuisOnly[] = JSON.parse(data.toString());
          const id: number = Math.floor(Math.random()*(content.length-10));
          
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
          content.splice(id,10);
          this.delUsedQuizRamadan(content);
          resolve(kuisArr);
        }
      });
    })
  }
  
  /** delete TEN used quiz from dependent */
  private delUsedQuizRamadan = async (content:IKuisOnly[]) => {
    fs.writeFile(`dependent/kuis/ramadhan.json`, JSON.stringify(content), (err) => {
      if(err){
        console.log('cannot write new dependent data kuis ramadan');
      } else {
        console.log("done write new dependent data with deleted used quizes ramadan");
      }
    });
  }

  /** main function for NEW DAY, get kuis from dependent, save to cache */
  public getQuizRamadan = async () => {
    const data = await this.getTodayQuizRamadan();
    console.log("quiz ramadan test");
    await this.saveToIgniteRamadan(data);
    await this.updateNewDayRamadan();
  }

  /** save to ignite */
  private saveToIgniteRamadan = async(data:IKuis[]) => {
    try {
      await igniteSupport.insertGeneralWithoutClient(data,new IKuis(),'cacheQuizRamadan');
    }
    catch (err) {
      console.log(err.message);
    }
  }

  /** cek if cache exist */
  public cacheCheckRamadan = async(ignite:any) => {
    const a = await igniteSupport.getCacheByName(ignite,'cacheQuizRamadan',new IKuis());
    return a?true:false;
  }

  /** this function will update all done_today to false, will ONLY GET CALLED AT NEW DAY */
  private updateNewDayRamadan = async () => {
    kuis_score_ramadan.update({
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