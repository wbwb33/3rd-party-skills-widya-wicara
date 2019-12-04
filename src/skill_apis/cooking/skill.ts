import { Request, Response } from 'express';
import rp from 'request-promise';
import $ from 'cheerio';

class CookingSkill {
  public search = async (req: Request, res: Response) => {
    const msg = req.query.msg;
    const temp_msg = msg.replace(/resep/g, "").trim();
    
    const main_url = `https://resepkoki.id/?s=${temp_msg}`;

    var list_url: string[] = [];
    var list_pilihan: string[] = [];
    const title = "search";

    const out = await rp(main_url)
      .then(async(html) => {
        $('.masonry-grid', html).find('> div > article > div > div > header > h3 > a').each((index, element) => {
          let url = $(element).attr('href');
          list_url.push(url);
        });

        // mendapatkan text endpoint category : replace  https://resepkoki.id/resep/resep-udang-pete-balado/ --> resep udang pete balado
        for(let i=0;i<list_url.length;i++){
          let category = list_url[i].replace(/https:\/\/resepkoki.id\/resep\//g,'');
          category = category.replace(/\/|-/g,' ');
          category = category.replace(/https:/g,'');
          category = category.replace(/resepkoki.id/g,'');
          category = category.replace(/resep/g,'');
          list_pilihan.push(category.trim());
          // console.log(category.trim());
          // cukup 5 pilihan untuk user
          if(i == 4){
            break;
          }
        };

        for(let i=0;i<list_pilihan.length;i++){
          console.log(i);
          // terdapat resep pada list pencarian 
          if(temp_msg === list_pilihan[i]){
            console.log(`cocok`);
            return await this.detailResep(list_url[i]);
          }
          else if(i === (list_pilihan.length-1))
          {
            const obj = `{"pilihan1": ${list_pilihan}}`;
            return await this.logData(title, list_url, list_pilihan);
          }
        }
      });
    console.log(`output : ${out}`);
    res.send(JSON.parse(`${out}`));
  }

  private detailResep = async (url: string) => {
    let title = "detail-resep";

    const out = await rp(url)
      .then(async(html) => {
        var list_bahan: string[] = [];
        $('.ingredients-table', html).find('> tbody > tr > td ').each(function (index, element) {
            let bahan = $(element).text();
            // preprocessing untuk tts
            bahan = bahan.replace(/\n/g, "");
            bahan = bahan.replace(/[^a-z^A-z]\-[^a-z^A-z]/g," sebanyak ");
            bahan = bahan.replace(/\-/g," ");
            bahan = bahan.replace(/sdm/g,"sendok makan");
            bahan = bahan.replace(/sdt/g,"sendok teh");
            bahan = bahan.replace(/ml/g,"mili liter");
            bahan = bahan.replace(/1\/2/g,"setengah");
            bahan = bahan.replace(/1\/3/g,"se per tiga");
            bahan = bahan.replace(/2\/3/g,"dua per tiga");
            bahan = bahan.replace(/1\/4/g,"se per empat");

            list_bahan.push(bahan);
        });

        // remove item kosong dari array 
        for(var i = list_bahan.length-1; i--;){
            if(list_bahan[i] === '' || list_bahan[i] === ' ') list_bahan.splice(i,1);
        }

        let list_langkah: string[] = [];
        $('.recipe-steps-table', html).find('> tbody > tr > td').each(function (index, element) {
            let single_step_title = $(element).find('> h4').text();
            let single_step_description = $(element).find('> .single-step-description-i').text();

            // ganti enter \n new line dengan kosong
            single_step_description = single_step_description.replace(/\n/g, "");

            // keluar saat tips terdeteksi
            if(single_step_title.toLowerCase() === 'tips'){
                return false;
            }

            list_langkah.push(single_step_title);
            list_langkah.push(single_step_description);
        });

        // delete array kosong
        for(var i = list_langkah.length-1; i--;){
            if(list_langkah[i] === '' || list_langkah[i] === ' ') list_langkah.splice(i,1);
        }

        return await this.logData(title,list_bahan, list_langkah);
      });
    return out;
  }

  private logData = async(title:string, list:string[], detail:string[]) => {
    var title_category =['search','detail-resep'];
    if(title === title_category[1])
    {
        // set bahan as paragraf
        let bahan = "";
        for(let i=0;i<list.length;i++){
            bahan = bahan + list[i] + ". ";
        }

        // set langkah as paragraf
        let langkah = "";
        for(let i=0;i<detail.length;i++){
            langkah = langkah + detail[i] + ". ";
        }

        var obj = `{"status": "success","action": "cooking-detail","data":{"bahan": "${bahan}", "langkah": "${langkah}"}}`
        // console.log(JSON.parse(obj));
        return obj;

    }else{
        var obj = `{"pilihan": ${detail}}`
        // console.log(JSON.stringify(obj));
        return obj;
    }
  }
}

const cookingSkill = new CookingSkill();
export default cookingSkill;