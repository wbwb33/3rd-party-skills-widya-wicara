import IgniteClient from 'apache-ignite-client';
import fs from 'fs';
const IgniteClientConfiguration = IgniteClient.IgniteClientConfiguration;
const ObjectType = IgniteClient.ObjectType;
const CacheEntry = IgniteClient.CacheEntry;
const ComplexObjectType = IgniteClient.ComplexObjectType;

const CacheConfiguration = IgniteClient.CacheConfiguration;
const QueryEntity = IgniteClient.QueryEntity;
const QueryField = IgniteClient.QueryField;
const SqlQuery = IgniteClient.SqlQuery;

const onStateChanged = (state: any, reason: any) => {
  if (state === IgniteClient.STATE.CONNECTED) {
      console.log('Ignite Client is started');
  }
  else if (state === IgniteClient.STATE.CONNECTING) {
      console.log('Ignite Client is connecting');
  }
  else if (state === IgniteClient.STATE.DISCONNECTED) {
      console.log('Ignite Client is stopped');
      if (reason) {
          console.log(reason);
      }
  }
}

// const igniteClientConfiguration = new IgniteClientConfiguration('149.129.236.17:31639');

interface Person {
  id: any,
  name: any,
  salary: any
}

class Person {
  constructor(id: number, name: string, salary: number) {
      this.id = id;
      this.name = name;
      this.salary = salary;
  }
}

interface KuisOnly {
  pertanyaan: string,
  benar: string,
  benar2: string,
  choice: string
}

interface Kuis {
  id:any,
  q: any,
  benar: any,
  benar2: any
}

class Kuis {
  constructor(id: number, q: string, benar: string, benar2: string) {
    this.id = id;
    this.q = q;
    this.benar = benar;
    this.benar2 = benar2;
  }
}

class main {
  private get = async (): Promise<KuisOnly[]> => {
    return new Promise((resolve, reject) => {
      console.log('getting quizes ignite');
      const cat = Math.floor(Math.random()*14)+1;
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
          resolve(kuisArr);
        }
      });
    })
  }

  public cobaKuis = async(ignite:any) => {
    // const igniteClient = new IgniteClient(onStateChanged);
    const igniteClient = ignite;
    try {
      const dataKuis:KuisOnly[] = await this.get();
      // await igniteClient.connect(new IgniteClientConfiguration('127.0.0.1:10800'));
      const cache = await igniteClient.getOrCreateCache('myKuis');
      // Complex Object type for JavaScript Person class instances
      const personComplexObjectType = new ComplexObjectType(new Kuis(0,'', '', '')).
          setFieldType('id', ObjectType.PRIMITIVE_TYPE.INTEGER); 
      // set cache key and value types
      cache.setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER).
          setValueType(personComplexObjectType);
      // put Complex Objects to the cache
      // await cache.put(1, new Person(1, 'John Doe', 1000));
      // await cache.put(2, new Person(2, 'Jane Roe', 2000));
      for(let i=0;i<dataKuis.length;i++){
        // console.log(dataKuis[i]);
        await cache.put((i+1), new Kuis((i+1), dataKuis[i].pertanyaan, dataKuis[i].benar, dataKuis[i].benar2))
      }

      console.log(await cache.get(1));
    }
    catch (err) {
      console.log(err.message);
    }
    // finally {
    //   igniteClient.disconnect();
    // }
  }

  public getKuis = async(ignite:any) => {
    // const igniteClient = new IgniteClient(onStateChanged);
    const igniteClient = ignite;
    try {
      // await igniteClient.connect(new IgniteClientConfiguration('127.0.0.1:10800'));
      const cache = igniteClient.getCache('myKuis').
        setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER);
      const personComplexObjectType = new ComplexObjectType(new Kuis(0,'', '', '')).
        setFieldType('id', ObjectType.PRIMITIVE_TYPE.INTEGER); 
      for(let i=0;i<5;i++){
        const person = await cache.get((i+1));
        console.log(await person.toObject(personComplexObjectType));
        // await cache.put((i+1), new Kuis((i+1), dataKuis[i].pertanyaan, dataKuis[i].benar, dataKuis[i].benar2))
      }
    }
    catch (err) {
      console.log(err.message);
    }
    finally {
      igniteClient.disconnect();
    }
  }

  public deleteKuis = async() => {
    const igniteClient = new IgniteClient(onStateChanged);
    try {
      await igniteClient.connect(new IgniteClientConfiguration('127.0.0.1:10800'));
      await igniteClient.destroyCache('myKuis');
    }
    catch (err) {
      console.log(err.message);
    }
    finally {
      igniteClient.disconnect();
    }
  }

  public performSqlQuery = async() => {
    const igniteClient = new IgniteClient(onStateChanged);
    try {
      await igniteClient.connect(new IgniteClientConfiguration('127.0.0.1:10800'));
      // cache configuration required for sql query execution
      const cacheConfiguration = new CacheConfiguration().
          setQueryEntities(
              new QueryEntity().
                  setValueTypeName('Person').
                  setFields([
                      new QueryField('name', 'java.lang.String'),
                      new QueryField('salary', 'java.lang.Double')
                  ]));
      const cache = (await igniteClient.getOrCreateCache('sqlQueryPersonCache', cacheConfiguration)).
          setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER).
          setValueType(new ComplexObjectType({ 'name' : '', 'salary' : 0 }, 'Person'));

      // put multiple values using putAll()
      await cache.putAll([
          new CacheEntry(1, { 'name' : 'John Doe', 'salary' : 1000 }),
          new CacheEntry(2, { 'name' : 'Jane Roe', 'salary' : 2000 }),
          new CacheEntry(3, { 'name' : 'Mary Major', 'salary' : 1500 })]);

      // create and configure sql query
      const sqlQuery = new SqlQuery('Person', 'salary > ? and salary <= ?').
          setArgs(900, 1600);
      // obtain sql query cursor
      const cursor = await cache.query(sqlQuery);
      // getAll cache entries returned by the sql query
      for (let cacheEntry of await cursor.getAll()) {
          console.log(cacheEntry.getValue());
      }

      await igniteClient.destroyCache('sqlQueryPersonCache');
    }
    catch (err) {
      console.log(err.message);
    }
    finally {
      igniteClient.disconnect();
    }
  }


  public putGetComplexAndBinaryObjects = async () => {
    const igniteClient = new IgniteClient();
    try {
      await igniteClient.connect(new IgniteClientConfiguration('127.0.0.1:10800'));
      const cache = await igniteClient.getOrCreateCache('myPersonCache');
      // Complex Object type for JavaScript Person class instances
      const personComplexObjectType = new ComplexObjectType(new Person(0, '', 0)).
          setFieldType('id', ObjectType.PRIMITIVE_TYPE.INTEGER); 
      // set cache key and value types
      cache.setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER).
          setValueType(personComplexObjectType);
      // put Complex Objects to the cache
      await cache.put(1, new Person(1, 'John Doe', 1000));
      await cache.put(2, new Person(2, 'Jane Roe', 2000));
      // get Complex Object, returned value is an instance of Person class
      const person = await cache.get(1);
      console.log(person);

      // new CacheClient instance of the same cache to operate with BinaryObjects
      const binaryCache = igniteClient.getCache('myPersonCache').
          setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER);
      // get Complex Object from the cache in a binary form, returned value is an instance of BinaryObject class
      let binaryPerson = await binaryCache.get(2);
      console.log('Binary form of Person:');       
      for (let fieldName of binaryPerson.getFieldNames()) {
          let fieldValue = await binaryPerson.getField(fieldName);
          console.log(fieldName + ' : ' + fieldValue);
      }
      // modify Binary Object and put it to the cache
      binaryPerson.setField('id', 3, ObjectType.PRIMITIVE_TYPE.INTEGER).
          setField('name', 'Mary Major');
      await binaryCache.put(3, binaryPerson);

      // get Binary Object from the cache and convert it to JavaScript Object
      for(let i=0;i<3;i++){
        binaryPerson = await binaryCache.get(i+1);
        console.log(await binaryPerson.toObject(personComplexObjectType));
      }

      await igniteClient.destroyCache('myPersonCache');
    }
    catch (err) {
      console.log(err.message);
    }
    finally {
      igniteClient.disconnect();
    }
  }
}

export const IgniteClass = new main();