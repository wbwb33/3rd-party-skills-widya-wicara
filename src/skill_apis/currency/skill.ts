import { Request, Response } from 'express';
import rp from 'request-promise';

class CurrencySkill {
  public get = async(req: Request, res: Response) => {
    var hrstart = process.hrtime();
    const arr:any[] = await this.preprocessingMsg(req.query.msg);
    // console.log(arr);

    const arrMataUang = ["Euro", "Dolar Singapura", "Dolar Australia", "Dolar Hong Kong", "Dolar Kanada", "Dolar", "Rupiah", "Ringgit", "Poundsterling", "Yuan", "Renmibi", "Lira", "Peso Meksiko", "Yen", "Won", "Riyal", "Dirham", "rupee", "Rufiyaa", "Baht", "Peso", "Forint", "Franc"];
    // const arrNegara = ["Eropa", "Singapura", "Australia", "Hong Kong", "Kanada", "Amerika Serikat", "Indonesia", "Malaysia", "Inggris", "China", "China", "Italia", "Meksiko", "Jepang", "Korea", "Saudi Arabia", "Arab", "India", "Maladewa (Maldives)", "Thailand", "Filipina", "Hungary", "Swiss"]; 
    const arrKode = ["EUR","SGD","AUD","HKD","CAD","USD","IDR","MYR","GBP","CNY","CNH","ITL","MXN","JPY","KRW","SAR","AED","INR","MVR","THB","PHP","HUF","CHF"];

    let ar: any[] = [];
    let arStrMataUang: string[] = [];

    for(let i=0;i<arrMataUang.length;i++){
      if(!ar[0] && arr[0].includes(arrMataUang[i].toLowerCase())){
        ar[0] = arrKode[i];
        arStrMataUang[0] = arrMataUang[i];
      }
      if(!ar[1] && arr[1].includes(arrMataUang[i].toLowerCase())){
        ar[1] = arrKode[i];
        arStrMataUang[1] = arrMataUang[i];
      }
      if(ar[0]&&ar[1]){
        break;
      }
    }
    ar[2]=arr[2];

    if(!ar[1]) {
      ar[1] = "IDR";
      arStrMataUang[1] = "Rupiah";
    }

    const final = await this.getDataFromLink(ar[0],ar[1],ar[2]);
    const round = Number(Math.round(+(final+'e2'))+'e-2');

    const hrend = process.hrtime(hrstart);
    
    res.send(JSON.parse(`{
      "status": "success",
      "action": "currency-found",
      "data": {
        "from": {
          "currency":"${ar[0]}",
          "string":"${arStrMataUang[0]}",
          "value":"${ar[2]}"
        },"to": {
          "currency":"${ar[1]}",
          "string":"${arStrMataUang[1]}",
          "value":"${round}"
        }
      },
      "in": "${hrend[0]}s ${hrend[1]/1000000}ms"
    }`));
  }

  private preprocessingMsg = async(msg:string) => {
    let str = msg.toLowerCase();
    str = str.replace("dollar","dolar");
    str = str.replace("nilai tukar","kurs");
    str = str.replace("valas","kurs");

    let tmp = str.indexOf("kurs") + 5; 
    str = str.substr(tmp);

    let tmpArr = str.split(/\s+/);
    str = tmpArr.slice(0,2).join(' ');

    let num = 1;
    let tmpNum = str.search(/[0-9]+/g);
    if(tmpNum!=-1){
      let tmp = str.substring(tmpNum).split(/\s+/g)[0];
      num = +tmp;
      str = tmpArr.slice(1,3).join(' ');
      var str2 = tmpArr.slice(3,(tmpArr.length)).join(' ');
    } else {
      var str2 = tmpArr.slice(2,(tmpArr.length)).join(' ');
    }
    
    // str: possible first currency, str2: possible second currency, num (default is 1): value to convert
    return [str,str2,num];
  }

  private getDataFromLink = async(cur1:string,cur2:string,int:number) => {

    const link = `https://freecurrencyrates.com/api/action.php?s=fcr&iso=${cur1}-${cur2}&f=${cur1}&v=${int}&do=cvals&ln=en`;

    const result = await rp(link)
      .then((data) => {
        const tmp = JSON.parse(data);
        return tmp[cur2];
      })
      .catch((err) => console.log(`error in currency's skill: ${err.message}`))
    
    return result;
  }
}

const currencySkill = new CurrencySkill();
export default currencySkill;