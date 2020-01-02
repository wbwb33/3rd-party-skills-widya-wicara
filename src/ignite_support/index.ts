import IgniteClient from 'apache-ignite-client';
import { igniteBase } from '../ignite';

const ObjectType = IgniteClient.ObjectType;
const ComplexObjectType = IgniteClient.ComplexObjectType;
const ScanQuery = IgniteClient.ScanQuery;
const IgniteClientConfiguration = IgniteClient.IgniteClientConfiguration;
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

class main {
  private connectClient = async() => {
    try {
      const igniteClient = new IgniteClient();
      await igniteClient.connect(new IgniteClientConfiguration(igniteBase));
      // await igniteClient.connect(new IgniteClientConfiguration('149.129.235.17:31639'));
      // await igniteClient.connect(new IgniteClientConfiguration('127.0.0.1:10800'));
      // await igniteClient.connect(new IgniteClientConfiguration('ignite.ignite:10800'));
      return igniteClient;
    }
    catch(err) {
      console.log(err.message);
    }
  }

  private disconnectClient = async(ignite:any) => {
    try {
      ignite.disconnect();
    }
    catch(err) {
      console.log(err.message);
    }
  }

  public getCacheByName = async(igniteClient: any, cacheName:string, dataInit:any) => {
    try {
      const cache = igniteClient.getCache(cacheName).
        setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER);
      const complexObjectType = new ComplexObjectType(dataInit).
        setFieldType('id', ObjectType.PRIMITIVE_TYPE.INTEGER);
      const length = (await (await cache.query(new ScanQuery())).getAll()).length;
      var tmp = [];
      for(let i=0;i<length;i++){
        const data = await cache.get((i+1));
        const datum = await data.toObject(complexObjectType);
        tmp.push(datum);
      }
    }
    catch (err) {
      console.log(`cache does not exist [${cacheName}]`);
    }
    finally {
      return tmp;
    }
  }

  public getCacheByNameWithoutClient = async(cacheName:string, dataInit:any) => {
    const igniteClient = await this.connectClient();
    try {
      const cache = igniteClient.getCache(cacheName).
        setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER);
      const complexObjectType = new ComplexObjectType(dataInit).
        setFieldType('id', ObjectType.PRIMITIVE_TYPE.INTEGER);
      const length = (await (await cache.query(new ScanQuery())).getAll()).length;
      var tmp = [];
      for(let i=0;i<length;i++){
        const data = await cache.get((i+1));
        const datum = await data.toObject(complexObjectType);
        tmp.push(datum);
      }
    }
    catch (err) {
      console.log(`cache does not exist [${cacheName}]`);
    }
    finally {
      await this.disconnectClient(igniteClient);
      return tmp;
    }
  }

  public getCacheByIdWithoutClient = async(cacheName:string, id: number, dataInit:any) => {
    const igniteClient = await this.connectClient();
    try {
      const cache = igniteClient.getCache(cacheName).
        setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER);
      const complexObjectType = new ComplexObjectType(dataInit).
        setFieldType('id', ObjectType.PRIMITIVE_TYPE.INTEGER);
      const data = await cache.get((id));
      var datum = await data.toObject(complexObjectType);
    }
    catch (err) {
      console.log(`cache does not exist [${cacheName}]`);
    }
    finally {
      await this.disconnectClient(igniteClient);
      return datum;
    }
  }

  public insertGeneral = async(igniteClient:any, dataArray:any, dataInit:any, cacheName: string) => {
    try {
      const cache = await igniteClient.getOrCreateCache(cacheName);
      const kuisComplexObjectType = new ComplexObjectType(dataInit).
          setFieldType('id', ObjectType.PRIMITIVE_TYPE.INTEGER); 
      cache.setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER).
          setValueType(kuisComplexObjectType);
      for(let i=0;i<dataArray.length;i++){
        await cache.put((i+1), dataArray[i]);
      }
    }
    catch (err) {
      console.log(err.message);
    }
    finally {
      console.log(`succesfully writing cache: ${cacheName}`);
    }
  }

  public insertGeneralWithoutClient = async(dataArray:any, dataInit:any, cacheName: string) => {
    const igniteClient = await this.connectClient();
    try {
      const cache = await igniteClient.getOrCreateCache(cacheName);
      const kuisComplexObjectType = new ComplexObjectType(dataInit).
          setFieldType('id', ObjectType.PRIMITIVE_TYPE.INTEGER); 
      cache.setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER).
          setValueType(kuisComplexObjectType);
      for(let i=0;i<dataArray.length;i++){
        await cache.put((i+1), dataArray[i]);
      }
    }
    catch (err) {
      console.log(err.message);
    }
    finally {
      console.log(`succesfully writing cache: ${cacheName}`);
      await this.disconnectClient(igniteClient);
    }
  }

  public insertGeneralByIdWithoutClient = async(dataMain:any, dataInit:any, cacheName: string, id: number) => {
    const igniteClient = await this.connectClient();
    try {
      const cache = await igniteClient.getOrCreateCache(cacheName);
      const dataComplexObjectType = new ComplexObjectType(dataInit).
          setFieldType('id', ObjectType.PRIMITIVE_TYPE.INTEGER); 
      cache.setKeyType(ObjectType.PRIMITIVE_TYPE.INTEGER).
          setValueType(dataComplexObjectType);
      await cache.put((id), dataMain);
    }
    catch (err) {
      console.log(err.message);
    }
    finally {
      await this.disconnectClient(igniteClient);
    }
  }
}

export const igniteSupport = new main();