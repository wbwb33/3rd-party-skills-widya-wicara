import { Request, Response } from 'express-serve-static-core';
import crypto from 'crypto-js';
import ignite from 'apache-ignite-client';

class NewsApiBbcSkill {

  public index = async(req:Request, res:Response) => {
    const data = JSON.parse(await this.getFromCache());
    console.log("Get BBC Audio list","GettingResource");
    res.send(data);
  }

  private getFromCache = async(): Promise<string> => {
    const client = new ignite();

    try {
      await client.connect(new ignite.IgniteClientConfiguration(process.env.BASE_IGNITE));
      const cache = await client.getCache('thirdPartyCaches');
      const dataEncrypted = await cache.get('api-bbc');
      
      const secret = process.env.CACHE_SECRET!;
      const decrypted = crypto.AES.decrypt(dataEncrypted, secret);
      const originalText = decrypted.toString(crypto.enc.Utf8);

      return originalText;
    }
    catch (err) {
      console.log(err.message);
      throw new Error('cannot save to cache');
    }
    finally {
      client.disconnect();
    }
  }
}

const newsApiBbcSkill = new NewsApiBbcSkill();
export default newsApiBbcSkill;
