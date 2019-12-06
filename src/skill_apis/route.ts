import Weather from './weather/skill';
import Horoscope from './horoscope/skill';
import Matdas from './matdas/skill';
import Kuis from './kuis/skill';
import Cooking from './cooking/skill';
import AdzanSkill from './jadwal_salat/skill';
import EntityCity from './entity_city/skill';
import ReminderSkill from './reminder/skill';
import FaqSkill from './faq/skill';
import { Endpoint } from '../utils';

const route = new Endpoint();

export default [
  route.get('/weather', Weather.index),
  route.get('/horoscope', Horoscope.index),
  route.get('/matdas', Matdas.index),
  route.get('/cek-city', EntityCity.index),
  route.get('/db-today-quiz', Kuis.index),
  route.get('/get-today-quiz', Kuis.today),
  route.get('/kuis-answered', Kuis.updateScore),
  route.post('/kuis-answered', Kuis.updateScore),
  route.get('/play-quiz', Kuis.canWePlayQuiz),
  route.post('/play-quiz', Kuis.canWePlayQuiz),
  // route.get('/reset-kuis', KuisData.updateNewDay),
  route.get('/salat-by-lokasi', AdzanSkill.index),
  route.get('/salat-get-db', AdzanSkill.getJadwalSalatFromDb),
  route.get('/cooking', Cooking.search),
  route.get('/get-reminder', ReminderSkill.index),
  route.get('/add-reminder', ReminderSkill.add),
  route.get('/faq', FaqSkill.index)
];
