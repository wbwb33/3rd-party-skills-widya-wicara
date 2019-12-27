export const translateCodeCuaca = (code: number) => {
  switch (code) {
    case 1 || 2 || 101 || 102:
      return 'cerah berawan';
    case 3 || 4 || 103 || 104:
      return 'berawan';
    case 5:
      return 'udara kabur';
    case 10:
      return 'asap';
    case 45:
      return 'kabut';
    case 60:
      return 'hujan ringan';
    case 61:
      return 'hujan sedang';
    case 63:
      return 'hujan lebat';
    case 80:
      return 'hujan lokal';
    case 95:
      return 'hujan petir';
    case 97:
      return 'hujan petir';
    default:
      return 'cerah';
  }
};

export const formattedDatetime = (datetime: string) => {
  let dateTime = datetime.slice(0, 4) + '-' + datetime.slice(4);
  dateTime = dateTime.slice(0, 7) + '-' + dateTime.slice(7);
  dateTime = dateTime.slice(0, 10);
  return dateTime;
};

export const bmkg_xml = [
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Aceh.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Bali.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-BangkaBelitung.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Banten.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Bengkulu.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-DIYogyakarta.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-DKIJakarta.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Gorontalo.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Jambi.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-JawaBarat.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-JawaTengah.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-JawaTimur.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanBarat.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanSelatan.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanTengah.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanTimur.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanUtara.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KepulauanRiau.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Lampung.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Maluku.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-MalukuUtara.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-NusaTenggaraBarat.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-NusaTenggaraTimur.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Papua.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-PapuaBarat.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Riau.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiBarat.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiSelatan.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiTengah.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiTenggara.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiUtara.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SumateraBarat.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SumateraSelatan.xml',
  'http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SumateraUtara.xml',
];
