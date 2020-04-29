import { Request, Response } from 'express-serve-static-core';
import rp from 'request-promise';
import $ from 'cheerio';
import {JadwalAdzan} from '../../db/models/jadwal_adzan';
import CekCity from '../entity_city/skill';
import moment from 'moment';
import * as dotenv from 'dotenv';
dotenv.config();

class AdzanSkill {
  public index = async (req: Request, res: Response) => {
    const hrstart = process.hrtime();
    const q = req.query.msg;
    const imsakOnly = req.query.imsak;
    const bukaOnly = req.query.buka;
    const cek = await CekCity.cekPesan(q,true);

    if(cek.includes("error")){
      const hrend = process.hrtime(hrstart);
      res.send(JSON.parse(`{"status": "error","action": "city-not-found","message": "NULL","in":"${hrend[0]}s ${hrend[1]/1000000}ms"}`));
    } 
    
    else if(imsakOnly || bukaOnly) {
      const tmp = JSON.parse(cek);
      const city = tmp.data.loc;
      const final = await this.findIndexByCity(city, imsakOnly?"imsak":"buka");
      const hrend = process.hrtime(hrstart);
      res.send(JSON.parse(`{${final},"in":"${hrend[0]}s ${hrend[1]/1000000}ms"}`));
    }

    else {
      const tmp = JSON.parse(cek);
      const city = tmp.data.loc;
      const final = await this.findIndexByCity(city);
      const hrend = process.hrtime(hrstart);
      res.send(JSON.parse(`{${final},"in":"${hrend[0]}s ${hrend[1]/1000000}ms"}`));
    }
  }

  private findIndexByCity = async (city:string, imsakOrBuka?:string) => {
    const listLokasi = ["Ambarawa","Ambon","Amlapura","Amuntai","Argamakmur","Atambua","Babo","Bagan Siapiapi","Bajawa","Balige","Balikpapan","Aceh","Bandar lampung","Bandung","Bangkalan","Bangkinang","Bangko","Bangli","Banjar","Banjarbaru","Banjarmasin","Banjarnegara","Bantaeng","Banten","Bantul","Banyuwangi","Barabai","Barito","Barru","Batam","Batang","Batu","Baturaja","Batusangkar","Baubau","Bekasi","Bengkalis","Bengkulu","Benteng","Biak","Bima","Binjai","Bireuen","Bitung","Blitar","Blora","Bogor","Bojonegoro","Bondowoso","Bontang","Boyolali","Brebes","Bukit Tinggi","Bulukumba","Buntok","Cepu","Ciamis","Cianjur","Cibinong","Cilacap","Cilegon","Cimahi","Cirebon","Curup","Demak","Denpasar","Depok","Dili","Dompu","Donggala","Dumai","Ende","Enggano","Enrekang","Fakfak","Garut","Gianyar","Gombong","Gorontalo","Gresik","Gunung Sitoli","Indramayu","Jambi","Jayapura","Jember","Jeneponto","Jepara","Jombang","Kabanjahe","Kalabahi","Kalianda","Kandangan","Karanganyar","Karawang","Kasungan","Kayuagung","Kebumen","Kediri","Kefamenanu","Kendal","Kendari","Kertosono","Ketapang","Kisaran","Klaten","Kolaka","Kota Baru Pulau Laut","Kota Bumi","Kota Jantho","Kotamobagu","Kuala Kapuas","Kuala Kurun","Kuala Pembuang","Kuala Tungkal","Kudus","Kuningan","Kupang","Kutacane","Kutoarjo","Labuhan","Lahat","Lamongan","Langsa","Larantuka","Lawang","Lhoseumawe","Limboto","Lubuk Basung","Lubuk Linggau","Lubuk Pakam","Lubuk Sikaping","Lumajang","Luwuk","Madiun","Magelang","Magetan","Majalengka","Majene","Makale","Makassar","Malang","Mamuju","Manna","Manokwari","Marabahan","Maros","Martapura Kalsel","Masohi","Mataram","Maumere","Medan","Mempawah","Menado","Mentok","Merauke","Metro","Meulaboh","Mojokerto","Muara Bulian","Muara Bungo","Muara Enim","Muara Teweh","Muaro Sijunjung","Muntilan","Nabire","Negara","Nganjuk","Ngawi","Nunukan","Pacitan","Padang","Padang Panjang","Padang Sidempuan","Pagaralam","Painan","Palangkaraya","Palembang","Palopo","Palu","Pamekasan","Pandeglang","Pangka_","Pangkajene Sidenreng","Pangkalan Bun","Pangkalpinang","Panyabungan","Par_","Parepare","Pariaman","Pasuruan","Pati","Payakumbuh","Pekalongan","Pekan Baru","Pemalang","Pematangsiantar","Pendopo","Pinrang","Pleihari","Polewali","Pondok Gede","Ponorogo","Pontianak","Poso","Prabumulih","Praya","Probolinggo","Purbalingga","Purukcahu","Purwakarta","Purwodadigrobogan","Purwokerto","Purworejo","Putussibau","Raha","Rangkasbitung","Rantau","Rantauprapat","Rantepao","Rembang","Rengat","Ruteng","Sabang","Salatiga","Samarinda","Sampang","Sampit","Sanggau","Sawahlunto","Sekayu","Selong","Semarang","Sengkang","Serang","Serui","Sibolga","Sidikalang","Sidoarjo","Sigli","Singaparna","Singaraja","Singkawang","Sinjai","Sintang","Situbondo","Slawi","Sleman","Soasiu","Soe","Solo","Solok","Soreang","Sorong","Sragen","Stabat","Subang","Sukabumi","Sukoharjo","Sumbawa Besar","Sumedang","Sumenep","Sungai Liat","Sungai Penuh","Sungguminasa","Surabaya","Surakarta","Tabanan","Tahuna","Takalar","Takengon","Tamiang Layang","Tanah Grogot","Tangerang","Tanjung Balai","Tanjung Enim","Tanjung Pandan","Tanjung Pinang","Tanjung Redep","Tanjung Selor","Tapak Tuan","Tarakan","Tarutung","Tasikmalaya","Tebing Tinggi","Tegal","Temanggung","Tembilahan","Tenggarong","Ternate","Tolitoli","Tondano","Trenggalek","Tual","Tuban","Tulungagung","Ujung Berung","Ungaran","Waikabubak","Waingapu","Wamena","Watampone","Watansoppeng","Wates","Wonogiri","Wonosari","Wonosobo","Yogyakarta","Jakarta Pusat","Jakarta Barat","Jakarta Selatan","Jakarta Timur","Jakarta Utara","Sambas, Kalbar","Masamba, Sulsel","Bula Sbt, Maluku","Bahaur, Kalteng"];
    
    let index = listLokasi.length;
    for(let i=0;i<listLokasi.length;i++){
      if(city.includes(listLokasi[i].toLowerCase())){
        if((listLokasi[i]=="Banjar" || listLokasi[i]=="Padang") && city!=listLokasi[i].toLowerCase()){
          //skip
        } else {
          index = i+1;
          break;
        }
      }
    }

    if(imsakOrBuka){
      const dataFromUrl = await this.getImsakOrBukaRamadan(index, listLokasi[index-1], imsakOrBuka);
      return dataFromUrl;
    }
    
    else if(index<listLokasi.length){
      const dataFromUrl = await this.getDataJadwalFromUrl(index, listLokasi[index-1]);
      return dataFromUrl;
    } 
    
    else {
      return '"status": "error","action": "city-not-found","message": "NULL"';
    }
  }

  private getDataJadwalFromUrl = async (index: number, lok: string): Promise<string>=> {
    return new Promise( async (resolve) => {
      const url = `https://www.jadwalsholat.org/adzan/monthly.php?id=${index}`;

      await rp(url)
        .then(async (html) => {
          const gmt = $('.table_title > td[align=center] > h1', html).text().replace(/[^0-9]/g,"");
          const imsakJam = $('.table_highlight > td', html)[1].children[0].data;
          const subuhJam = $('.table_highlight > td', html)[2].children[0].data;
          const dzuhurJam = $('.table_highlight > td', html)[5].children[0].data;
          const asharJam = $('.table_highlight > td', html)[6].children[0].data;
          const maghribJam = $('.table_highlight > td', html)[7].children[0].data;
          const isyaJam = $('.table_highlight > td', html)[8].children[0].data;

          const ifEndOfMonth = $('.table_highlight', html)[0].next.next.attribs.class;
          if(ifEndOfMonth=="table_block_title") {
            await rp(`${url}&m=5`)
              .then(htmlNext => {
                const imsakJamBesok = $('.table_light > td', htmlNext)[1].children[0].data;
                const subuhJamBesok = $('.table_light > td', htmlNext)[2].children[0].data;
                const dzuhurJamBesok = $('.table_light > td', htmlNext)[5].children[0].data;
                const asharJamBesok = $('.table_light > td', htmlNext)[6].children[0].data;
                const maghribJamBesok = $('.table_light > td', htmlNext)[7].children[0].data;
                const isyaJamBesok = $('.table_light > td', htmlNext)[8].children[0].data;
                const jsonBesok = `{"imsak": "${imsakJamBesok}","subuh": "${subuhJamBesok}","dzuhur": "${dzuhurJamBesok}","ashar": "${asharJamBesok}","maghrib": "${maghribJamBesok}","isya": "${isyaJamBesok}"}`;

                resolve(`"lokasi": "${lok}","gmt": ${gmt?gmt:7},"imsak": "${imsakJam}","subuh": "${subuhJam}","dzuhur": "${dzuhurJam}","ashar": "${asharJam}","maghrib": "${maghribJam}","isya": "${isyaJam}","besok": ${jsonBesok}`);
              })
              .catch(errorNext => console.log(errorNext));
          } else {
            const imsakJamBesok = $('.table_highlight', html)[0].next.next.children[1].children[0].data;
            const subuhJamBesok = $('.table_highlight', html)[0].next.next.children[2].children[0].data;
            const dzuhurJamBesok = $('.table_highlight', html)[0].next.next.children[5].children[0].data;
            const asharJamBesok = $('.table_highlight', html)[0].next.next.children[6].children[0].data;
            const maghribJamBesok = $('.table_highlight', html)[0].next.next.children[7].children[0].data;
            const isyaJamBesok = $('.table_highlight', html)[0].next.next.children[8].children[0].data;
            const jsonBesok = `{"imsak": "${imsakJamBesok}","subuh": "${subuhJamBesok}","dzuhur": "${dzuhurJamBesok}","ashar": "${asharJamBesok}","maghrib": "${maghribJamBesok}","isya": "${isyaJamBesok}"}`;

            resolve(`"lokasi": "${lok}","gmt": ${gmt?gmt:7},"imsak": "${imsakJam}","subuh": "${subuhJam}","dzuhur": "${dzuhurJam}","ashar": "${asharJam}","maghrib": "${maghribJam}","isya": "${isyaJam}","besok": ${jsonBesok}`);
          }
        })
        .catch(error => console.log(error));
    });
  };

  public getJadwalSalatFromDb = async (req: Request, res: Response) => {
    try {
      res.send(await JadwalAdzan.findAll({
        where: {
          id:60
        }
      }));
    } catch (e) {
      console.log(e);
    }
  }

  private getImsakOrBukaRamadan = async (index: number, lok: string, imsakOrBuka: string): Promise<string> => {
    return new Promise( async (resolve) => {
      const url = `https://www.jadwalsholat.org/adzan/monthly.php?id=${index}`;
      var arrayImsak: (string)[] = [];

      var d = new Date();

      const switcher = imsakOrBuka=="imsak"?1:7;

      await rp(url)
        .then(async (html) => {
          let gmt = $('.table_title > td[align=center] > h1', html).text().replace(/[^0-9]/g,"");

          for(let i=0;i<7;i++){
            let tmp = $('tbody > tr', html)[i+27].children[switcher].children[0].data!;
            
            d.setUTCFullYear(2020, 3, i+24);
            d.setUTCHours(+tmp.split(':')[0]-+gmt);
            d.setUTCMinutes(+tmp.split(':')[1]);
            d.setUTCSeconds(0);

            let isoDate = d.toISOString().split('.')[0]+'+0000';
            
            arrayImsak.push(isoDate);
          }
        })
        .catch(error => console.log(error));
      
      await rp(url+'&m=5')
        .then(async (html) => {
          let gmt = $('.table_title > td[align=center] > h1', html).text().replace(/[^0-9]/g,"");

          for(let i=0;i<23;i++){
            let tmp = $('tbody > tr', html)[i+5].children[switcher].children[0].data!;
            
            d.setUTCFullYear(2020, 4, i+1);
            d.setUTCHours(+tmp.split(':')[0]-+gmt);
            d.setUTCMinutes(+tmp.split(':')[1]);
            d.setUTCSeconds(0);

            let isoDate = d.toISOString().split('.')[0]+'+0000';
            
            arrayImsak.push(isoDate);
          }
        })
        .catch(error => console.log(error));

      resolve(`"lokasi": "${lok}", "data": ${JSON.stringify(arrayImsak)}`);
    })
  }

  /** this function will send JADWAL IMSAK or BUKA one FULL MONTH to Apps by uuid  */
  public insertOneFullMonth = async (req: Request, res: Response) => {
    const id = req.query.uuid;
    const city = req.query.city;
    const imsakOrBuka = req.query.imsak?"imsak":"buka";
    const gmt = req.query.gmt;

    this.insertOneFullMonthMain(id,city,imsakOrBuka,gmt);

    res.send(JSON.parse(`{ "status": "success", "action":"Add 1 month reminder of ${imsakOrBuka} to Apps", "message": "see logs"}`));

  }

  /** this is the main function of above function */
  private insertOneFullMonthMain = async (id:string, city:string, imsakOrBuka:string, gmt:number) => {
    
    const final = await this.findIndexByCity(city, imsakOrBuka);
    
    const dataWaktuSebulan = JSON.parse(`{${final}}`)["data"];
    const dataLabel = imsakOrBuka=="imsak"?'pengingat untuk waktu imsyak':'pengingat untuk berbuka puasa';
    const dataUuid = id.split('-')[1];
    const dataAlertToken = imsakOrBuka=="imsak"?'-imsak':'-maghrib';

    const { BASE_BACKEND } = process.env;

    for(let i=0;i<dataWaktuSebulan.length;i++) {
      let tmpDateForApps = moment(dataWaktuSebulan[i]).add(gmt, "hours").utc().format('YYYY-MM-DD HH:mm:ss');

      var options = {
        method: 'GET',
        uri: `http://${BASE_BACKEND}/function/reminder`,
        form: {
          label:dataLabel,
          ringtone:'default.mp3',
          datetime:`${tmpDateForApps}`,
          device_uuid:dataUuid,
          alert_token:`${id}${dataAlertToken}${dataWaktuSebulan[i]}`
        }
      };

      await rp(options)
        .then(function (body) {
          // success
        })
        .catch(function (err) {
          console.log(err);
        });
    }

    console.log(`succesfully added 1 month of ${imsakOrBuka} to Apps with id: ${id}`);
  }
}

const adzanSkill = new AdzanSkill();
export default adzanSkill;
