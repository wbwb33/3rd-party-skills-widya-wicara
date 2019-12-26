import IgniteClient from 'apache-ignite-client';
import fs from 'fs';
import { Request, Response } from 'express';
import {igniteSupport} from '../../ignite_support';
const IgniteClientConfiguration = IgniteClient.IgniteClientConfiguration;
const ObjectType = IgniteClient.ObjectType;
const ScanQuery = IgniteClient.ScanQuery;
const ComplexObjectType = IgniteClient.ComplexObjectType;
// const CacheEntry = IgniteClient.CacheEntry;

// const CacheConfiguration = IgniteClient.CacheConfiguration;
// const QueryEntity = IgniteClient.QueryEntity;
// const QueryField = IgniteClient.QueryField;
// const SqlQuery = IgniteClient.SqlQuery;

// const onStateChanged = (state: any, reason: any) => {
//   if (state === IgniteClient.STATE.CONNECTED) {
//       console.log('Ignite Client is started');
//   }
//   else if (state === IgniteClient.STATE.CONNECTING) {
//       console.log('Ignite Client is connecting');
//   }
//   else if (state === IgniteClient.STATE.DISCONNECTED) {
//       console.log('Ignite Client is stopped');
//       if (reason) {
//           console.log(reason);
//       }
//   }
// }

// const igniteClientConfiguration = new IgniteClientConfiguration('149.129.235.17:31639');

interface KuisOnly {
  pertanyaan: string,
  benar: string,
  benar2: string,
  choice: string
}

interface Kuis {
  id: number,
  q: string,
  benar: string,
  benar2: string,
  choice: string
}

class Kuis {
  // id: number, q: string, benar: string, benar2: string
  constructor() {
    this.id = 0;
    this.q = '';
    this.benar = '';
    this.benar2 = '';
    this.choice = '';
  }
}

class main {
  private get = async (): Promise<Kuis[]> => {
    return new Promise((resolve, reject) => {
      console.log('getting quizes ignite');
      const cat = Math.floor(Math.random()*14)+1;
      fs.readFile(`dependent/kuis/${cat}.json`, (err, data) => {
        if (err) {
          console.log('data dependent kuis not found');
        } else {
          const content:KuisOnly[] = JSON.parse(data.toString());
          const id: number = Math.floor(Math.random()*(content.length-10));
          // console.log(id+5);
          var kuisArr:Kuis[] = [];
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

  private connectClient = async() => {
    try {
      const igniteClient = new IgniteClient();
      await igniteClient.connect(new IgniteClientConfiguration('149.129.235.17:31639'));
      // await igniteClient.connect(new IgniteClientConfiguration('127.0.0.1:10800'));
      return igniteClient;
    }
    catch(err) {
      console.log(err.message);
    }
  }

  private disconnectClient = async(igniteClient:any) => {
    try {
      igniteClient.disconnect();
    }
    catch(err) {
      console.log(err.message);
    }
  }

  public cobaKuis = async(ignite:any) => {
    const igniteClient = ignite;
    try {
      // await igniteClient.connect(new IgniteClientConfiguration('127.0.0.1:10800'));
      const dataKuis:Kuis[] = await this.get();
      // const cache = await igniteClient.getOrCreateCache('myKuis');
      // const kuisComplexObjectType = new ComplexObjectType(new Kuis()).
      //     setFieldType('id', ObjectType.PRIMITIVE_TYPE.INTEGER); 
      // cache.setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER).
      //     setValueType(kuisComplexObjectType);
      // for(let i=0;i<dataKuis.length;i++){
      //   await cache.put((i+1), dataKuis[i]);
      // }
      await igniteSupport.insertGeneral(igniteClient,dataKuis,new Kuis(),'myKuis');
    }
    catch (err) {
      console.log(err.message);
    }
    // finally {
      // igniteClient.disconnect();
      // await this.disconnectClient(igniteClient);
    // }
  }

  public getRandomQuiz = async(req:Request,res:Response) => {
    const igniteClient:any = await this.connectClient();
    try {
      const idRandom = Math.floor(Math.random()*10)+1;
      const cache = igniteClient.getCache('myKuis2').
        setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER);
      const personComplexObjectType = new ComplexObjectType(new Kuis()).
        setFieldType('id', ObjectType.PRIMITIVE_TYPE.INTEGER);
      const person = await cache.get(+idRandom);
      const result = await person.toObject(personComplexObjectType)
      console.log(result.benar);
      res.send(result);
    }
    catch (err) {
      console.log(err.message);
    }
    finally {
      await this.disconnectClient(igniteClient);
    }
  }

  public getKuis = async(ignite:any) => {
    const igniteClient = ignite;
    // const igniteClient = new IgniteClient(onStateChanged);
    try {
      // await igniteClient.connect(new IgniteClientConfiguration('127.0.0.1:10800'));
      const cache = igniteClient.getCache('myKuis').
        setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER);
      const personComplexObjectType = new ComplexObjectType(new Kuis()).
        setFieldType('id', ObjectType.PRIMITIVE_TYPE.INTEGER);
      const length = (await (await cache.query(new ScanQuery())).getAll()).length;
      for(let i=0;i<length;i++){
        const person = await cache.get((i+1));
        console.log(await person.toObject(personComplexObjectType));
      }
    }
    catch (err) {
      console.log(err.message);
    }
    // finally {
    //   await this.disconnectClient(igniteClient);
    // }
  }

  public deleteKuis = async(ignite:any) => {
    const igniteClient = ignite;
    // const igniteClient = new IgniteClient(onStateChanged);
    try {
      await igniteClient.destroyCache('myKuis');
      console.log("deleted myKuis");
    }
    catch (err) {
      console.log(err.message);
    }
    // finally {
    //   await this.disconnectClient(igniteClient);
    // }
  }
}

export const IgniteClass = new main();