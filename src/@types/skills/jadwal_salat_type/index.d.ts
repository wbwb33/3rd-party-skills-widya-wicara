export interface DataDevice {
  device_uuid:  string;
  gps_long:     string;
  gps_lat:      string;
  gps_address:  string;
}

export interface DataJadwalSalat {
  data:     Data;
  time:     Time;
  location: Location;
  debug:    Debug;
  status:   string;
}

export interface Data {
  Fajr:            string;
  Sunrise:         string;
  Dhuhr:           string;
  Asr:             string;
  Sunset:          string;
  Maghrib:         string;
  Isha:            string;
  SepertigaMalam:  string;
  TengahMalam:     string;
  DuapertigaMalam: string;
  method:          string[];
}

export interface Debug {
  sunrise: string;
  sunset:  string;
}

export interface Location {
  latitude:  string;
  longitude: string;
  // address:   string;
}

export interface Time {
  date:     Date;
  time:     string;
  timezone: string;
  offset:   number;
}

export interface FinalData {
  uuid: string;
  subuh: Date;
  dzuhur: Date;
  ashar: Date;
  maghrib: Date;
  isya: Date;
}