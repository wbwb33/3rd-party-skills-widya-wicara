import Weather from './skill';
import { Endpoint } from '../../utils';

const route = new Endpoint('/weather');

export default [route.get('/', Weather.index)];
