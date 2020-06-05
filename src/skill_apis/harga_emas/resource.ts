import rp from 'request-promise';
import $ from 'cheerio';
import fs from 'fs';
import { OneBigStringForHargaEmasCache } from './types';
import { igniteSupport } from '../../ignite_support';
import { third_party } from '../../db/models/third_party';

class HargaEmas {
  public get = async () => {
    const tmp = await this.getHargaEmasFromWeb();
    await this.saveToDb(tmp);
    // await this.saveToIgnite(tmp);
  };

  private getHargaEmasFromWeb = async () :Promise<any> => {
    return new Promise(async (resolve,reject) => {
      const url = `https://harga-emas.org/`;
      await rp(url)
        .then(html => {
          const mainTable = $('.in_table > tbody > tr', html);
          
          const g10 = mainTable[19].children;
          const g5 = mainTable[20].children;
          const g1 = mainTable[23].children;
          const sell = mainTable[25].children;
          
          const batangAntamG10 = g10[3].children[0].data?.split(" ")[0];
          const gramAntamG10 = g10[5].children[0].data?.split(" ")[0];
          const batangGadaiG10 = g10[7].children[0].data;
          const gramGadaiG10 = g10[9].children[0].data;
          const batangAntamG5 = g5[3].children[0].data?.split(" ")[0];
          const gramAntamG5 = g5[5].children[0].data?.split(" ")[0];
          const batangGadaiG5 = g5[7].children[0].data;
          const gramGadaiG5 = g5[9].children[0].data;
          const batangAntam = g1[3].children[0].data?.split(" ")[0];
          const gramAntam = g1[5].children[0].data?.split(" ")[0];
          const batangGadai = g1[7].children[0].data;
          const gramGadai = g1[9].children[0].data;
          const sellAntam = sell[3].children[4].children[0].data?.split(" ")[1].split("/")[0];

          const finalResult = JSON.parse(
            `{
              "g10": {"antam": {"batang": "${batangAntamG10}", "gram": "${gramAntamG10}" },"pegadaian": {"batang": "${batangGadaiG10}", "gram": "${gramGadaiG10}" }},
              "g5": {"antam": {"batang": "${batangAntamG5}", "gram": "${gramAntamG5}" },"pegadaian": {"batang": "${batangGadaiG5}", "gram": "${gramGadaiG5}" }},
              "g1": {"antam": {"batang": "${batangAntam}", "gram": "${gramAntam}" },"pegadaian": {"batang": "${batangGadai}", "gram": "${gramGadai}" }},
              "jual": "${sellAntam}"
            }`
          );
          
          resolve(finalResult);
        })
        .catch(error => (console.log(error)));
      })
  }

  /** save to db */
  private saveToDb = async(dataToSave:any) => {
    try {
      await third_party.findAll({
        where: {
          skill: 'harga_emas'
        },
      }).then(async (data) => {
        if(!data[0]){
          await third_party.create({skill: 'harga_emas', data: ''});
        }

        await third_party.update({
          data: JSON.stringify(dataToSave)
        }, {
          where: {
            skill: 'harga_emas'
          }
        })
      })
    }
    catch (err) {
      console.log(err.message+' at resource harga emas');
    }
  }

  /** save to ignite */
  private saveToIgnite = async(data:any) => {
    try {
      const oneDataHargaEmas = JSON.parse(`[{"id":1}]`);
      oneDataHargaEmas[0].str = JSON.stringify(data);
      
      await igniteSupport.insertGeneralWithoutClient(oneDataHargaEmas,new OneBigStringForHargaEmasCache(),'cacheHargaEmas');
    }
    catch (err) {
      console.log(err.message+' at resource harga emas');
    }
  }

  /** cek if cache exist */
  public cacheCheck = async(ignite:any) => {
    const a = await igniteSupport.getCacheByName(ignite,'cacheHargaEmas',new OneBigStringForHargaEmasCache());
    return a?true:false;
  }
}

const hargaEmas = new HargaEmas();
export default hargaEmas;