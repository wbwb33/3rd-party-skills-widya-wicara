import { Request, Response } from 'express-serve-static-core';

function madas(pesan: string){
  let arrMsg = pesan.split(' ');
  let forPreprocessingOpr = "ditambahkan,dikurangkan,dikurangi,dikalikan,dibagikan,plus,minus";
  let forPreprocessingInt = "satu,dua,tiga,empat,lima,enam,tujuh,delapan,sembilan,sepuluh,sebelas,seratus,seribu,sejuta,semiliar,setriliun";

  function mapStrToInt(str: string){
    switch(str){
      case "satu": return 1;
      case "dua": return 2;
      case "tiga": return 3;
      case "empat": return 4;
      case "lima": return 5;
      case "enam": return 6;
      case "tujuh": return 7;
      case "delapan": return 8;
      case "sembilan": return 9;
      case "sepuluh": return 10;
      case "sebelas": return 11;
      case "seratus": return 100;
      case "seribu": case "ribu": return 1000;
      case "sejuta": case "juta": return 1000000;
      case "semiliar": case "miliar": return 1000000000;
      case "setriliun": case "triliun": return 1000000000000;
      default: return str;
    }
  }

  function prosesMapDanDivide(arr:Array<any>){
    let thisArrTemp:Array<any>=[];
    let thisArrHasil:Array<any>=[[],[]];

    function thisCekJikaSebelumnyaBedaKategori(i:number,mark:number){
      if(arr[i-1] === mark){
        thisArrHasil[mark].push(thisArrTemp);
        thisArrTemp = [];
      }
    }

    for(let i=0;i<arr.length;i++){
      if(forPreprocessingInt.includes(arr[i])){ //0
        thisCekJikaSebelumnyaBedaKategori(i,1);
        thisArrTemp.push(mapStrToInt(arr[i]));
        arr[i]=0;
      } else if(forPreprocessingOpr.includes(arr[i])){ //1
        thisCekJikaSebelumnyaBedaKategori(i,0);
        thisArrTemp.push(arr[i]);
        arr[i]=1;
      } else { //2
        thisCekJikaSebelumnyaBedaKategori(i,0);
        thisCekJikaSebelumnyaBedaKategori(i,1);
        arr[i]=2;
      }
    }
    
    thisArrTemp.length>0?
      arr[arr.length-1]===0?
        thisArrHasil[0].push(thisArrTemp)
        :thisArrHasil[1].push(thisArrTemp)
      :0

    return thisArrHasil;
  }

  let arrHasilPreproses = prosesMapDanDivide(arrMsg);
  let arrHasilPreprosesInt = arrHasilPreproses[0];
  let arrHasilPreprosesOpr = arrHasilPreproses[1];
  let ar=[];

  for(let x=0;x<arrHasilPreprosesInt.length;x++){
    let arrTiapRibuan = [];
    let arrArrTiapRibuan = [];
    for(let y=0;y<arrHasilPreprosesInt[x].length;y++) {
      if(arrHasilPreprosesInt[x][y]>=1000 || y===arrHasilPreprosesInt[x].length-1){
        arrTiapRibuan.push(arrHasilPreprosesInt[x][y]);
        arrArrTiapRibuan.push(arrTiapRibuan);
        arrTiapRibuan = [];
      } else {
        arrTiapRibuan.push(arrHasilPreprosesInt[x][y]);
      }
    }
    if(arrTiapRibuan.length>0) arrArrTiapRibuan.push(arrTiapRibuan);
    ar.push(arrArrTiapRibuan);
    arrArrTiapRibuan = [];
  }

  function konversiStringKeInteger(arrFull:any,n:number): number{
    if(n===0) return 0;
    let arr = arrFull[n-1];
    let thisRibuan = arr.length===1?1:arr[arr.length-1]>=1000?arr.pop():1;
    let w = arr.length;
    let thisInteger: number = 0;
    if(w===1){
      thisInteger = arr[0];
    } else if(w===2){
      if(arr.includes("ratus")) thisInteger = arr[0]*100;
      else if(arr.includes("puluh")) thisInteger = arr[0]*10;
      else if(arr.includes("belas")) thisInteger = arr[0]+10;
    } else if(w===3){
      if(arr[0]===100){
        if(arr.includes("puluh")) thisInteger = arr[0]*10+100;
        else if(arr.includes("belas")) thisInteger = arr[0]+10+100;
      } 
      else if(arr.includes("ratus")) thisInteger = arr[0]*100+arr[2];
      else if(arr.includes("puluh")) thisInteger = arr[0]*10+arr[2];
    } else if(w===4){
      if(arr[0]===100 && arr.includes("puluh")) thisInteger = arr[1]*10+arr[3]+100;
      else if(arr.includes("ratus")){
        if(arr.includes("puluh")) thisInteger = (arr[0]*100)+(arr[2]*10);
        else if(arr.includes("belas")) thisInteger = (arr[0]*100)+arr[2]+10;
      }
    } else if(w===5){
        if(arr.includes("puluh") && arr.includes("ratus")) thisInteger = (arr[0]*100)+(arr[2]*10)+arr[4];
    }
    let total = thisInteger*thisRibuan;
    return total = total + konversiStringKeInteger(arrFull,n-1);
  }

  let proc = [];
  for(let x=0;x<ar.length;x++){
    let temp = konversiStringKeInteger(ar[x],ar[x].length);
    proc.push(temp);
  }
  arrHasilPreprosesInt=proc;

  function cekIncludes(strInput:string,modeCek:number){
    let x = modeCek;
    let strCek:string = "err";
    if(x===1) strCek="ditambahkan,plus";
    else if(x===2) strCek="dikurangkan,dikurangi,minus";
    else if(x===3) strCek="dikalikan";
    else if(x===4) strCek="dibagikan";
    if(strCek!=="err"){
      return strCek.includes(strInput);
    }
  }

  if(arrHasilPreprosesOpr.length===arrHasilPreprosesInt.length){
    arrHasilPreprosesOpr.splice(0,1);
    arrHasilPreprosesInt[0]*=(-1);
  }

  let j = 0;
  let step = 0;

  //index opr guide: 1=sum, 2=sub, 3=mul, 4=div
  function operasiMat(indexOpr:number,a:number,b:number,indexJ:number){
    function operasiMatSub(){
      arrHasilPreprosesInt.splice(indexJ,1);
      arrHasilPreprosesOpr.splice(indexJ,1);
      if(indexOpr===1) return a+b;
      else if(indexOpr===2) return a-b;
      else if(indexOpr===3) return a*b;
      else if(indexOpr===4) return a/b;
    }
    arrHasilPreprosesInt[indexJ]=operasiMatSub();
    return indexJ-1;
  }

  while(j<arrHasilPreprosesOpr.length){
    let opr = arrHasilPreprosesOpr[j];
    if(opr.length>1){
      opr.splice(1,1);
      arrHasilPreprosesInt[j+1]*=(-1);
    }
    let a = arrHasilPreprosesInt[j];
    let b = arrHasilPreprosesInt[j+1];
    if(step===0){
      if(cekIncludes(opr,3)){
        j=operasiMat(3,a,b,j);
      } 
      else if(cekIncludes(opr,4)){
        j=operasiMat(4,a,b,j);
      }
    } 
    else if(step===1){
      if(cekIncludes(opr,1)){
        j=operasiMat(1,a,b,j);
      } 
      else if(cekIncludes(opr,2)){
        j=operasiMat(2,a,b,j);
      }
    }
    j++;
    if(j===arrHasilPreprosesOpr.length){
      j=0;
      step++;
    }
    step===2?j=99:j=j
  }

  if(arrHasilPreprosesInt.length===1 && arrHasilPreprosesOpr.length===0){
    return arrHasilPreprosesInt[0];
  } else {
    return -1;
  }
}

class Matdas {
  public index = async (req: Request, res: Response) => {
    const raw_int = req.query.bil;

    let bil: string;
    if (raw_int) {
      bil = raw_int;
    } else {
      res.sendError("query bil can't be null");
    }

    if (raw_int) {
      let hasil = madas(raw_int);
      if(hasil===-1){
        res.sendError('cannot calculate');
      } else {
        res.send({
          hasil: madas(raw_int),
        })
      }
    }
  };
}

const matdas = new Matdas();
export default matdas;
