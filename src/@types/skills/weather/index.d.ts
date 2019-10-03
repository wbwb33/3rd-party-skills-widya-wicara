/**
 * Fixed weather type for normalized weather data
 */
export interface FixedWeather {
  provinsi: string;
  kota: string;
  parameter: FixedWeatherParameter[];
}

/**
 * Fixed weather parameter type for normalized weather data
 */
export interface FixedWeatherParameter {
  date: Date;
  temp_min: string;
  temp_max: string;
  weather_day: string;
  weather_night: string;
}

/**
 * Formatted weather data type for process normalized weather data
 */
export interface FormattedWeatherData {
  provinsi: string;
  kota: string;
  parameter: {
    date: string | undefined;
    temp_min: string;
    temp_max: string;
    weather_day: string;
    weather_night: string;
  }[];
}

// Below is the type interface for easier data parsing from json converted xml (bmkg data)
export interface WeatherData {
  data: Data;
}

export interface Data {
  $: DataClass;
  forecast: ForecastElement[];
}

export interface DataClass {
  source: string;
  productioncenter: string;
}

export interface ForecastElement {
  $: Forecast;
  issue: Issue[];
  area: AreaElement[];
}

export interface Forecast {
  domain: string;
}

export interface AreaElement {
  $: Area;
  name: NameElement[];
  parameter: ParameterElement[];
}

export interface Area {
  id: string;
  latitude: string;
  longitude: string;
  coordinate: string;
  type: PurpleType;
  region: string;
  level: string;
  description: string;
  domain: Domain;
  tags: string;
}

export enum Domain {
  Aceh = "Aceh"
}

export enum PurpleType {
  Land = "land"
}

export interface NameElement {
  _: string;
  $: Name;
}

export interface Name {
  "xml:lang": XMLLang;
}

export enum XMLLang {
  EnUS = "en_US",
  IDID = "id_ID"
}

export interface ParameterElement {
  $: Parameter;
  timerange: TimerangeElement[];
}

export interface Parameter {
  id: ID;
  description: Description;
  type: FluffyType;
}

export enum Description {
  Humidity = "Humidity",
  MaxHumidity = "Max humidity",
  MaxTemperature = "Max temperature",
  MinHumidity = "Min humidity",
  MinTemperature = "Min temperature",
  Temperature = "Temperature",
  Weather = "Weather",
  WindDirection = "Wind direction",
  WindSpeed = "Wind speed"
}

export enum ID {
  Hu = "hu",
  Humax = "humax",
  Humin = "humin",
  T = "t",
  Tmax = "tmax",
  Tmin = "tmin",
  Wd = "wd",
  Weather = "weather",
  Ws = "ws"
}

export enum FluffyType {
  Daily = "daily",
  Hourly = "hourly"
}

export interface TimerangeElement {
  $: Timerange;
  value: ValueElement[];
}

export interface Timerange {
  type: FluffyType;
  h?: string;
  datetime: string;
  day?: string;
}

export interface ValueElement {
  _: string;
  $: Value;
}

export interface Value {
  unit: Unit;
}

export enum Unit {
  C = "C",
  Card = "CARD",
  Deg = "deg",
  Empty = "%",
  F = "F",
  Icon = "icon",
  Kph = "KPH",
  Kt = "Kt",
  MS = "MS",
  Mph = "MPH",
  Sexa = "SEXA"
}

export interface Issue {
  timestamp: string[];
  year: string[];
  month: string[];
  day: string[];
  hour: string[];
  minute: string[];
  second: string[];
}
