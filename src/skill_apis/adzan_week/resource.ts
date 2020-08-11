import rp from 'request-promise';
import $ from 'cheerio';
import fs from 'fs';
import async from 'async';
import { AdzanStatus } from '../../db/models/adzan_status';
import moment from 'moment';
import { CreateAdzanStatus} from '../../@types/skills/adzan_status_type';

class AdzanWeekResource {
  public createOrUpdateUuid = async (uuid: string, last: number) => {

    const week = last==7?true:false;
    const lastYear = moment().add(last,'days').format('YYYY');
    const lastMonth = moment().add(last,'days').format('M');
    const lastDay = moment().add(last,'days').format('D');

    AdzanStatus.findOrCreate({
      where:{
        uuid
      }
    })
      .then((body) => { 
        return AdzanStatus.update({
          lastYear,lastMonth,lastDay,week
        }, {
          where: {
            uuid
        }})
          .then((body) => { 
            console.log("sukses update status adzan by uuid");
            return;
          })
          .catch((err) => { console.log(err);})
      })
      .catch((err) => { console.log(err);});

  }

  public get = async (uuid: string) => {
    return await AdzanStatus.findOne({
      attributes: ['week'],
      where: {uuid}, raw: true
    }).then((body) => {
      if(typeof body == null ) return;
      return body;
    }).catch((err) => { console.log(err); })
  }

  public reset = async () => {
    const nowYear = moment().format('YYYY');
    const nowMonth = moment().format('M');
    const nowDay = moment().format('D');

    AdzanStatus.findAll({
      attributes: ['id'],
      where: {
        lastYear: nowYear,
        lastMonth: nowMonth,
        lastDay: nowDay
      }, raw: true
    }).then((body) => {
      if(body.length==0) return;
      body.map(index => {
        AdzanStatus.destroy({
          where: {
            id: index.id
          }
        }).then((body) => {
          console.log(`sukses delete adzan state, id: ${index.id}`);
        }).catch((err) => { console.log(err);})
      });
    }).catch((err) => { console.log(err); })
  }

}

const adzanWeekResource = new AdzanWeekResource();
export default adzanWeekResource;