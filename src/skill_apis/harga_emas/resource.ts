import rp from 'request-promise';
import $ from 'cheerio';
import fs from 'fs';

class HargaEmas {
  public get = async () => {
    const url = `https://harga-emas.org/`;
    await rp(url)
      .then(html => {
        const mainTable = $('.col-md-8 > .in_table > tbody > tr', html);
        const g10 = mainTable[14].children;
        const g5 = mainTable[15].children;
        const g1 = mainTable[18].children;
        const sell = mainTable[20].children;

        // sell.forEach((element, key) => {
        //   console.log(key);
        //   console.log(element);
        // });
        
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
        
        fs.writeFile('cache/harga_emas.json', JSON.stringify(finalResult), (err) => {
          if(err){
            console.log('cannot write data harga emas today');
          } else {
            console.log("done harga emas");
          }
        })
      })
      .catch(error => (console.log(error)));
  };
}

const hargaEmas = new HargaEmas();
export default hargaEmas;