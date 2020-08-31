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
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Aceh.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Bali.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-BangkaBelitung.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Banten.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Bengkulu.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-DIYogyakarta.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-DKIJakarta.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Gorontalo.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Jambi.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-JawaBarat.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-JawaTengah.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-JawaTimur.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanBarat.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanSelatan.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanTengah.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanTimur.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanUtara.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KepulauanRiau.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Lampung.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Maluku.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-MalukuUtara.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-NusaTenggaraBarat.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-NusaTenggaraTimur.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Papua.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-PapuaBarat.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Riau.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiBarat.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiSelatan.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiTengah.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiTenggara.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiUtara.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SumateraBarat.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SumateraSelatan.xml',
  'https://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SumateraUtara.xml',
];
