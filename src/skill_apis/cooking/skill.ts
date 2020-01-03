import { Request, Response } from 'express';
import rp from 'request-promise';
import $ from 'cheerio';
import fs from 'fs';

class CookingSkill {
  public testing = async (req: Request, res: Response) => {
    const hrstart = process.hrtime();
    const msg = req.query.msg;
    const resep = ["tumis kangkung", "ikan balado pedas", "tekwan", "chicken wings", "ketupat sayur", "sop buntut", "tahu gejrot", "perkedel daging", "tahu goreng kriuk", "kering tempe", "keripik bayam", "telur ceplok balado", "semur jengkol pedas", "tahu krispi", "empal daging", "kering kentang", "bakwan jagung", "kulit dimsum", "tahu tempe bacem", "iga bakar", "sambal goreng hati", "tahu isi sayuran", "pepes bandeng presto", "bebek goreng kremes", "capcay goreng jamur", "nasi kuning", "nasi uduk", "kunyit asam", "jamu beras kencur", "es cincau", "cumi hitam", "ayam kecap", "sop ayam.", "sop ikan", "ikan bakar berkuah", "nasi goreng", "mie dokdok", "brokoli krispi saus pedas", "oseng kangkung", "sambal terasi", "sambal teri", "sambal ijo", "terong balado", "tumis buncis", "udang pedas manis", "spaghetti saus pedas", "rawon", "sayur asem", "bakso sapi", "gurame bakar", "kepiting saus padang", "steak", "topokki", "makaroni  schotel", "burger", "donat kentang", "kue bolu", "nastar", "putri salju", "kue kastengel", "brownies kukus", "bakpau", "bala-bala", "tempe mendoan krispi", "nacho cheese", "martabak telur mini", "jamur crispy", "sup krim jagung", "siomay isi", "onion ring", "tahu isi", "lumpia ayam", "chicken fingers", "calamari", "gado-gado", "karedok", "pie buah", "pisang goreng", "puding cokelat", "penkeik apel", "pai susu", "kelepon ketan", "kue lapis", "putu ayu", "pancake apel", "klepon ketan meletus", "butter cookies", "mata kebo", "es krim alpukat susu", "lava cake", "mochi ", "es buah", "es oyen segar", "cemplon singkong", "kue cucur gula merah empuk", "bola-bola timus ubi", "kue samir", "kue cupcake", "cheese cake", "pisang nugget", "banana muffin", "lapis singkong pelangi", "serabi telur", "kue cubit", "brownies panggang cokelat", "cake carrot aroma khas klasik", "macaroon oreo", "nasi goreng", "rendang", "oseng cumi asin", "cumi pedas isi telur tahu", "cumi asin mercon", "cumi goreng tepung", "donat isi", "salad buah", "cilok", "ayam geprek", "pancake", "ketoprak", "spageti", "opor ayam kuning", "ayam goreng mentega", "ayam goreng kremes", "ayam goreng lengkuas", "ayam goreng kecap", "ayam goreng tepung", "telur dadar", "telur gulung", "sayur asem", "daging sapi lada hitam", "semur daging", "boba", "grinti late", "teh madu", "thai ti", "kopi susu", "donat", "opor ayam"];

    for(var i=0;i<resep.length;i++){
      if(msg.includes(resep[i])){
        break;
      }
    }

    if(i==138) {
      const hrend = process.hrtime(hrstart);
      res.send(JSON.parse(`{"status":"error","message":"resep-not-found","in":"${hrend[0]}s ${hrend[1]/1000000}"}`));
    }
    else {
      fs.readFile(`src/skill_apis/cooking/step.json`, (err, data) => {
        const parsed = JSON.parse(data.toString());
        const bahan = parsed.bahan[i];
        const cara = parsed.cara[i];
        const hrend = process.hrtime(hrstart);
        res.send(JSON.parse(`{"status":"success","bahan":"${bahan}","cara":"${cara}","in":"${hrend[0]}s ${hrend[1]/1000000}"}`));
      });
    }

    // res.send(JSON.parse(`{"i":"${i}","in":"${hrend[0]}s ${hrend[1]/1000000}"}`));
  }


  public search = async (req: Request, res: Response) => {
    const hrstart = process.hrtime();
    const msg = req.query.msg;
    const temp_msg = msg.replace(/resep/g, "").trim();
    
    const main_url = `https://resepkoki.id/?s=${temp_msg}`;

    var list_url: string[] = [];
    var list_pilihan: string[] = [];
    const title = "search";

    const out = await rp(main_url)
      .then(async(html) => {
        $('.masonry-grid', html).find('> div > article > div > div > header > h3 > a').each((index, element) => {
          let url = $(element).attr('href')!;
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
          if(i == 9){
            break;
          }
        };

        for(let i=0;i<list_pilihan.length;i++){
          // console.log(i);
          // terdapat resep pada list pencarian 
          if(temp_msg === list_pilihan[i]){
            // console.log(`cocok`);
            return await this.detailResep(list_url[i]);
          }
          else if(i === (list_pilihan.length-1))
          {
            // const obj = `{"pilihan1": [${list_pilihan}]}`;
            return await this.logData(title, list_url, list_pilihan);
          }
        }
      });
    // console.log(`output : ${out}`);
    const hrend = process.hrtime(hrstart);
    if(out) {
      res.send(JSON.parse(`${out},"in":"${hrend[0]}s ${hrend[1]/1000000}ms"}`));
    } else {
      res.send(JSON.parse(`{"status": "error","action": "cooking-not-found","message": "NULL","in":"${hrend[0]}s ${hrend[1]/1000000}ms"}`));
    }
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

        var obj = `{"status": "success","action": "cooking-detail","data":{"bahan": "${bahan}", "langkah": "${langkah}"}`;
        // console.log(JSON.parse(obj));
        return obj;

    }else{
        let pilihan = "";
        let pilihan2 = "";
        for(let i=0;i<detail.length;i++){
          if(i<5){
            pilihan = pilihan + (i+1) + " " + detail[i] + ", ";
          } else {
            pilihan2 = pilihan2 + (i+1) + " " + detail[i] + ", ";
          }
        }
        var obj = `{"status": "success","action": "cooking-pilihan","data": {"pilihan": ${JSON.stringify(detail)}, "pesan": ${JSON.stringify(pilihan)}, "pesan2": ${JSON.stringify(pilihan2)}}`;
        return obj;
    }
  }
}

const cookingSkill = new CookingSkill();
export default cookingSkill;