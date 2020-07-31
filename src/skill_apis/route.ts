import { Endpoint } from '../utils';
import Weather from './weather/skill';
import Horoscope from './horoscope/skill';
import Matdas from './matdas/skill';
import Kuis from './kuis/skill';
import Cooking from './cooking/skill';
import AdzanSkill from './jadwal_salat/skill';
import EntityCity from './entity_city/skill';
import ReminderSkill from './reminder/skill';
import HargaEmasSkill from './harga_emas/skill';
import HargaPanganSkill from './harga_pangan/skill';
import currencySkill from './currency/skill';
import KuisRamadhan from './kuis/skill.ramadan';
import { newsApi } from './news_api/skill';
import { alarmSkill } from './alarm/skill';
import { kuis_ } from './kuis_/skill';

const route = new Endpoint();

export default [
  route.get('/weather', Weather.index),
  route.get('/horoscope', Horoscope.index),
  route.get('/matdas', Matdas.index),
  route.get('/cek-city', EntityCity.index),
  route.get('/db-today-quiz', Kuis.index),
  route.get('/get-today-quiz', Kuis.today),
  route.get('/kuis-answered', Kuis.updateScore),
  route.get('/play-quiz', Kuis.canWePlayQuiz),
  route.get('/salat-by-lokasi', AdzanSkill.index),
  route.get('/salat-get-db', AdzanSkill.getJadwalSalatFromDb),
  route.get('/salat-insert-to-apps', AdzanSkill.insertOneFullMonth),
  route.get('/cooking', Cooking.getSavedRecipes),
  route.get('/get-reminder', ReminderSkill.index),
  route.get('/add-reminder', ReminderSkill.add),
  route.get('/harga-emas', HargaEmasSkill.index),
  route.get('/harga-pangan-skill', HargaPanganSkill.getHargaPanganFromCache),
  route.get('/currency',currencySkill.get),
  route.get('/news-api',newsApi.main),
  route.get('/play-quiz-ramadhan', KuisRamadhan.canWePlayQuiz),
  route.get('/kuis-answered-ramadhan', KuisRamadhan.updateScore),
  route.get('/set-alarm', alarmSkill.index),
  route.get('/play-quiz-kemerdekaan', kuis_.playQuiz),
  route.get('/set-user-playing-today-kemerdekaan', kuis_.setUserPlayingToday),
  // route.post('/kuis-answered', Kuis.updateScore),
  // route.post('/play-quiz', Kuis.canWePlayQuiz)
];
