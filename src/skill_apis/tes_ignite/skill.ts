import rp from 'request-promise';
import async from 'async';

class TTD {
  public tesRp = async () => {
    const ar = [1,5,8,10,3,20,50];
    let ar2: number[] = [];
    let i = 0;
    
    do{
      ar2 = ar2.length?await this.tesRpSub1(ar2):await this.tesRpSub1();
      i++;
      // ar2.length?console.log(`ada ${ar2}`):console.log('tidak');
    } while(ar2.length>0&&i<3)

  }

  private tesRpSub1 = async (id?:number[]) => {
    let arErr: number[] = [];
    const range = {
      from: 0,
      to: id?id.length-1:33,

      [Symbol.iterator]() {
        return {
          current: this.from,
          last: this.to,
          next() {
            if (this.current <= this.last) {
              return {
                done: false,
                value: id?id![this.current++]:this.current++,
              };
            } else {
              return { done: true };
            }
          },
        };
      },
    };

    async.forEachOf(
      range,
      async(id:any) => {
        if(id%10==0){
          arErr.push(id);
          throw "zero";
        } else {
          console.log(id);
        }
      },
      (err: any) => {
        if(err) {
          console.log('error');
        }
        else console.log('haha');
      }
    )

    console.log(arErr);
    return arErr;
  }
}

export const tes = new TTD();