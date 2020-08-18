import { AdzanStatus } from '../../db/models/adzan_status';
import moment from 'moment';
import { Op } from 'sequelize';
import { CreateAdzanStatus} from '../../@types/skills/adzan_status_type';
import { where } from 'sequelize/types';

class AdzanWeekResource {
  public createOrUpdateUuid = async (uuid: string, salat: string, amount: number) => {

    AdzanStatus.findOrCreate({
      where:{
        uuid
      }
    })
      .then((body) => { 
        return AdzanStatus.update({
          [`last_${salat}`]:amount
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
      .catch((err) => { console.log(err.message);});

  }

  public get = async (uuid: string) => {
    return await AdzanStatus.findOne({
      where: {uuid}, raw: true
    }).then((body) => {
      if(body == null ) return "not-found";
      return body;
    }).catch((err) => { console.log(err); })
  }

  // public reset = async () => {
  //   const nowYear = moment().format('YYYY');
  //   const nowMonth = moment().format('M');
  //   const nowDay = moment().format('D');

  //   AdzanStatus.findAll({
  //     attributes: ['id'],
  //     where: {
  //       lastYear: nowYear,
  //       lastMonth: nowMonth,
  //       lastDay: nowDay
  //     }, raw: true
  //   }).then((body) => {
  //     if(body.length==0) return;
  //     body.map(index => {
  //       AdzanStatus.destroy({
  //         where: {
  //           id: index.id
  //         }
  //       }).then((body) => {
  //         console.log(`sukses delete adzan state, id: ${index.id}`);
  //       }).catch((err) => { console.log(err);})
  //     });
  //   }).catch((err) => { console.log(err); })
  // }

  public decrement = async () => {
    await AdzanStatus.increment({ last_subuh: -1},{ where: {last_subuh: { [Op.gt]: 1}}});
    await AdzanStatus.increment({ last_dzuhur: -1},{ where: {last_dzuhur: { [Op.gt]: 1}}});
    await AdzanStatus.increment({ last_ashar: -1},{ where: {last_ashar: { [Op.gt]: 1}}});
    await AdzanStatus.increment({ last_maghrib: -1},{ where: {last_maghrib: { [Op.gt]: 1}}});
    await AdzanStatus.increment({ last_isya: -1},{ where: {last_isya: { [Op.gt]: 1}}});
    await AdzanStatus.increment({ last_all: -1},{ where: {last_all: { [Op.gt]: 1}}});
  }

}

const adzanWeekResource = new AdzanWeekResource();
export default adzanWeekResource;