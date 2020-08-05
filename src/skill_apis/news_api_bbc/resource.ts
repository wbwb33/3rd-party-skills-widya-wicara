import rp from 'request-promise';
import errors from 'request-promise/errors';
import $ from 'cheerio';
import moment from 'moment';
import crypto from 'crypto-js';
import ignite from 'apache-ignite-client';

class NewsApiBbc {

  public get = async(): Promise<void> => {
    const arrayAudioInString = await this.getFromUrl();
    const toReturn = JSON.parse(
      `{
        "status": "success",
        "message": "BBC Audio Found",
        "data": ${arrayAudioInString}
      }`);

    await this.setToIgnite(JSON.stringify(toReturn));
    console.log("succesfully save BBC","SavingResource");
  }

  private getFromUrl = async(): Promise<string> => {
    const options = {
      uri: 'http://podcasts.files.bbci.co.uk/p02pc9v6.rss',
      xml: true
    } 

    const a = await rp(options)
      .then(xml => {
        const html = $.load(xml).xml();
        const tmpDate = moment($('itunes\\:image > pubdate', html).text()).utcOffset(420).toString();
        const items = $('atom\\:link > item', html);

        const tmp: any = {};
        for(let i=0;i<items.length;i++){
          const tmpDate = moment($('pubDate', items).eq(i).text()).format('DD-MM-YYYY');
          tmp[tmpDate] = $('enclosure', items).eq(i).attr('url');          
        }

        const final = `{
          "lastUpdateDate": "${tmpDate}",
          "lastUpdateAudio": "${$('enclosure', items).eq(0).attr('url')}",
          "audio": ${JSON.stringify(tmp)}
        }`

        return final;
      })
      .catch(errors.TransformError, function (reason) {
        console.log(reason.cause.message);
        throw new Error('cannot parse');
      });
      
    return a;
  }

  private setToIgnite = async(data: string): Promise<any> => {
    const client = new ignite();

    try {
      await client.connect(new ignite.IgniteClientConfiguration(process.env.BASE_IGNITE));
      const cache = (await client.getOrCreateCache('thirdPartyCaches')).setKeyType(ignite.ObjectType.PRIMITIVE_TYPE.STRING);
      
      const secret = process.env.CACHE_SECRET!;
      const toCrypt = data;
      const encrypted = crypto.AES.encrypt(toCrypt, secret).toString();
      await cache.put('api-bbc', encrypted);
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

const newsApiBbc = new NewsApiBbc();
export default newsApiBbc;