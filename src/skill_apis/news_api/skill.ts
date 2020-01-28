import { Request, Response } from 'express-serve-static-core';
import rp from 'request-promise';
import { NewsApiType, DataOutput } from './types';

class NewsApi {
  public main = async(req:Request, res:Response) => {
    const msg = req.query.msg;
    const apiKey = "4aa0bdab5b114a4fbcb39deaea7583b8";

    let pre = msg.includes("dong")?msg.split("dong")[0]:msg;

    const bulanr=["januari","februari","maret","april","mei","juni","juli","agustus","september","oktober","november","desember"];
    let about = "";
    let tgl = "";
    let bln = "";
    let thn = "";
    let url = "";
    let err = "";
    let cat = "";
    let out = "";

    if(pre.includes("tentang")) about=pre.split("tentang")[1].trim();
    else if(pre.includes("mengenai")) about=pre.split("mengenai")[1].trim();
    else if(pre.includes("kategori")) about=pre.split("kategori")[1].trim();
    else if(pre.includes("top")||pre.includes("utama")||pre.includes("hari ini")) about="top";
    else if(pre.includes("kemarin lusa")) about="kemarin lusa";
    else if(pre.includes("kemarin")) about="kemarin";
    else if(pre.includes("besok lusa")||pre.includes("besok")) err="besok";
    else {
      const tmp=pre.split("berita")[1].trim();
      
      if(tmp){              
        let i=0;
        do {
          if(tmp.includes(bulanr[i])) bln=i<9?`0${i+1}`:`${i+1}`;
          i++;
        } while (bln.length==0&&i<bulanr.length)
        about=i==bulanr.length?tmp:"tanggal";
      } else about="top";
    }

    if(about=="top") url=`https://newsapi.org/v2/top-headlines?country=id&apiKey=${apiKey}`;
    else if(about=="tanggal"){
      const d = new Date();
      const tmp=pre.split(bulanr[+bln-1]);
      let tgl_from="";
      let tgl_to="";
      
      tgl=tmp[0].replace(/[^0-9]/g,"");
      if(tgl){
        tgl=tgl.length==2?tgl:`${d.getMonth()+1}`;
        tgl=+tgl<9?`0${tgl}`:`${tgl}`;
        tgl_from=tgl;
        tgl_to=tgl;
      } else {
        tgl_from="01";
        const tmp_max_date = +bln<8?(+bln%2?31:(+bln==2?28:30)):(+bln%2?30:31);
        // tgl_to=d.getDate()<10?`0${d.getDate()}`:`${d.getDate()}`;
        tgl_to=`${tmp_max_date}`;
      }

      thn=tmp[1].replace(/[^0-9]/g,"");
      thn=thn==""?`${d.getFullYear()}`:thn;

      const compareNow=Date.UTC(d.getFullYear(),d.getMonth()+1,d.getDate());
      const compareGiven=Date.UTC(+thn,+bln,+tgl);

      if(compareGiven>compareNow) err="besok";
      else {
        const dateUrl = `from=${thn}-${bln}-${tgl_from}&to=${thn}-${bln}-${tgl_to}`;
        url = `https://newsapi.org/v2/everything?q=yang&${dateUrl}&language=id&sortBy=popularity&apiKey=${apiKey}`;
      }
    }
    else if(about=="kemarin lusa"){
      const d = new Date();
      d.setDate(d.getDate()-2);
      const dateUrl = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      url = `https://newsapi.org/v2/everything?q=yang&from=${dateUrl}&to=${dateUrl}&language=id&sortBy=popularity&apiKey=${apiKey}`;
    }
    else if(about=="kemarin"){
      const d = new Date();
      d.setDate(d.getDate()-1);
      const dateUrl = `${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;
      url = `https://newsapi.org/v2/everything?q=yang&from=${dateUrl}&to=${dateUrl}&language=id&sortBy=popularity&apiKey=${apiKey}`;
    }
    else if(err.length==0){
      const tmp = about;
      
      if(tmp=="bisnis") cat="business";
      else if(tmp=="hiburan") cat="entertainment";
      else if(tmp=="sehat") cat="health";
      else if(tmp=="ilmiah"||tmp=="sains") cat="science";
      else if(tmp=="olahraga"||tmp=="sport") cat="sports";
      else if(tmp=="teknologi") cat="technology";
      else url = `https://newsapi.org/v2/everything?q=${about}&sortBy=publishedAt&language=id&apiKey=${apiKey}`;

      if(cat!="") url = `https://newsapi.org/v2/top-headlines?country=id&category=${cat}&apiKey=${apiKey}`;
    }

    if(err=="besok") res.sendError("Maaf ya, Widya belum bisa meramalkan berita masa depan.");
    else {
      //curl
      out = "curl";
      const a = (req.query.full)?await this.getDataFromUrl(url,true):await this.getDataFromUrl(url);
      const b = JSON.parse(`{"action":"news-api.${about}","data":${JSON.stringify(a)}}`);
      (req.query.full)?res.send(a):res.sendOK(b);
    }

    // console.log(`out: ${out}, about: ${about}, url: ${url}`);
  }

  private getDataFromUrl = async(url: string, full?: boolean) => {
    let dataFinal: DataOutput[] = [];

    var options = {
      uri: url,
      json: true
    };
    const task = await rp(options)
      .then((dataUrl: NewsApiType) => {
        let i=0;
        let j=0;
        const tmp = dataUrl.articles;
        do {
          if(tmp[i].content&&tmp[i].source){
            dataFinal.push({
              id: j+1,
              source: tmp[i].source.name,
              author: tmp[i].author||"anonim",
              title: tmp[i].title,
              content: tmp[i].content.replace(/\r?\n?\"|\r?\n|\r/g, " ")
            })
            j++;
          }
          i++;
        } while (j<5&&i<tmp.length)
        
        return dataUrl;
      })
      .catch(err => {
        console.log(err);
      });
    // return task;
    return full?task:dataFinal;
  }
  
}

export const newsApi = new NewsApi();