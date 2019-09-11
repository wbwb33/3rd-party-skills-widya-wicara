export const translateCodeCuaca = (code: number) => {
    switch (code) {
        case 1 || 2 || 101 || 102: return "cerah berawan";
        case 3 || 4 || 103 || 104: return "berawan";
        case 5: return "udara kabur";
        case 10: return "asap";
        case 45: return "kabut";
        case 60: return "hujan ringan";
        case 61: return "hujan sedang";
        case 63: return "hujan lebat";
        case 80: return "hujan lokal";
        case 95: return "hujan petir";
        case 97: return "hujan petir";
        default: return "cerah"
    }
};

export const formattedDatetime = (datetime: string) => {
    let dateTime = datetime.slice(0, 4) + "-" + datetime.slice(4);
    dateTime = dateTime.slice(0, 7) + "-" + dateTime.slice(7);
    dateTime = dateTime.slice(0, 10) + " " + dateTime.slice(10);
    dateTime = dateTime.slice(0, 13) + ":" + dateTime.slice(13);
    return dateTime;
}

export interface bmkg_xml {
    prov: string,
    link: string
}

export const bmkg_xml = [
    {
        prov: "aceh",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Aceh.xml"
    },
    {
        prov: "bali",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Bali.xml"
    },
    {
        prov: "bangka belitung",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-BangkaBelitung.xml"
    },
    {
        prov: "banten",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Banten.xml"
    },
    {
        prov: "bengkulu",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Bengkulu.xml"
    },
    {
        prov: "yogyakarta",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-DIYogyakarta.xml"
    },
    {
        prov: "dki jakarta",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-DKIJakarta.xml"
    },
    {
        prov: "gorontalo",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Gorontalo.xml"
    },
    {
        prov: "jambi",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Jambi.xml"
    },
    {
        prov: "jawa barat",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-JawaBarat.xml"
    },
    {
        prov: "jawa tengah",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-JawaTengah.xml"
    },
    {
        prov: "jawa timur",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-JawaTimur.xml"
    },
    {
        prov: "kalimantan barat",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanBarat.xml"
    },
    {
        prov: "kalimantan selatan",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanSelatan.xml"
    },
    {
        prov: "kalimantan tengah",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanTengah.xml"
    },
    {
        prov: "kalimantan timur",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KalimantanTengah.xml"
    },
    {
        prov: "kepulauan riau",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-KepulauanRiau.xml"
    },
    {
        prov: "lampung",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Lampung.xml"
    },
    {
        prov: "maluku",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Maluku.xml"
    },
    {
        prov: "maluku utara",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-MalukuUtara.xml"
    },
    {
        prov: "nusa tenggara barat",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-NusaTenggaraBarat.xml"
    },
    {
        prov: "nusa tenggara timur",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-NusaTenggaraTimur.xml"
    },
    {
        prov: "papua",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Papua.xml"
    },
    {
        prov: "papua barat",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-PapuaBarat.xml"
    },
    {
        prov: "riau",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-Riau.xml"
    },
    {
        prov: "sulawesi barat",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiBarat.xml"
    },
    {
        prov: "sulawesi selatan",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiSelatan.xml"
    },
    {
        prov: "sulawesi tengah",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiTengah.xml"
    },
    {
        prov: "sulawesi tenggara",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiTenggara.xml"
    },
    {
        prov: "sulawesi utara",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SulawesiUtara.xml"
    },
    {
        prov: "sumatera barat",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SumateraBarat.xml"
    },
    {
        prov: "sumatera selatan",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SumateraSelatan.xml"
    },
    {
        prov: "sumatera utara",
        link: "http://data.bmkg.go.id/datamkg/MEWS/DigitalForecast/DigitalForecast-SumateraUtara.xml"
    }
];
