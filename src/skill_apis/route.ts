import Weather from './weather/skill';
import Horoscope from './horoscope/skill';
import Matdas from './matdas/skill';
import Kuis from './kuis/skill';
import { Endpoint } from '../utils';

const route = new Endpoint();

export default [
  route.get('/weather', Weather.index),
  route.get('/horoscope', Horoscope.index),
  route.get('/matdas', Matdas.index),
  route.get('/db-today-quiz', Kuis.index),
  route.get('/get-today-quiz', Kuis.today),
];
