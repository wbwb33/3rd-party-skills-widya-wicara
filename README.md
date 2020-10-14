# Widya Wicara 3rd Party Skills

Backend Service untuk 3rd Party Skills API widya wicara smart speaker.

## Table of Contents

- [Widya Wicara 3rd Party Skills](#widya-wicara-3rd-party-skills)
  - [Table of Contents](#table-of-contents)
  - [Skills](#skills)
    - [Horoscope](#horoscope)
    - [Weather](#weather)
    - [Alarm](#alarm)
    - [Currency Converter](#currency-converter)
    - [Find City](#find-city)
    - [Harga Emas](#harga-emas)

## Skills

Untuk setiap skill widya wicara menggunakan endpoint:

```
http://localhost:5000/
```

### Horoscope

Endpoint: `http://localhost:5000/horoscope` <br />
Method: `GET` <br />
Skill weather menggunakan data 3rd Party API:

```
http://wb.mon-horoscope-du-jour.com/widyawicara.com/webservicejson.php?tz=Asia/Makassar&sign_id=${sign_id}
```

Variabel sign_id adalah representasi dari 12 zodiak dengan nilai 0 - 11. Url ini di looping di server dan di update sehari sekali pada pukul 00.00 dan di save di cache sehingga user tidak perlu mengambil data langsung dari 3rd Party. Data ini otomatis update setiap hari. <br />
Ada beberapa parameter ketika request, yaitu `sign`, `cat`, dan `hari`. Parameter `sign` bersifat mandatory dan berisi zodiak dengan huruf kecil:

- aries
- scorpio
- taurus
- kaprikornus
- libra
- pises
- virgo
- gemini
- cancer
- leo
- akuarius
- sagitarius

Untuk parameter `cat` adalah kategori horoscope `(pekerjaan, cinta, suasana hati, keuangan, perkenalan)`, apabila tidak di isi, maka akan memberikan semua parameter. Untuk parameter `hari` yaitu `(besok, lusa)` ketika tidak di isi maka akan otomatis mendapatkan data hari ini.

Skill horoscope menggunakan susunan endpoint sebagai berikut:

```
http://localhost:5000/horoscope?sign=libra&cat=pekerjaan&hari=lusa
```

### Weather

Endpoint: `http://localhost:5000/weather` <br />
Method: `GET` <br />
Skill weather menggunakan data dari BMKG. Data ini otomatis update setiap hari. Ada beberapa parameter ketika request, yaitu `kota` dan `hari`. Parameter `kota` bersifat mandatory. Untuk parameter `hari` yaitu `(besok, lusa)` ketika tidak di isi maka akan otomatis mendapatkan data hari ini.

Skill weather menggunakan susunan endpoint sebagai berikut:

```
http://localhost:5000/weather?kota=yogyakarta&hari=besok
```

### Alarm

Endpoint: `http://localhost:5000/set-alarm` <br />
Method: `GET`/`POST` <br />
Skill alarm untuk memasang alarm dengan perintah suara.

Body (`application/x-www-form-urlencoded`):
```
username: "username1"
dsn: "dsn1"
scheduleTime: 2020-10-20T12:12:12+0000
alertToken: "token1"
```

### Currency Converter

Endpoint: `http://localhost:5000/currency` <br />
Method: `GET` <br />
Skill untuk konversi mata uang.

Query:
```
input: 1 dolar berapa rupiah

http://localhost:5000/currency?msg=1%20dolar%20berapa%20rupiah
```

### Find City

Endpoint: `http://localhost:5000/cek-city` <br />
Method: `GET` <br />
Skill untuk mencari nama kota/kab indonesia di input pesan.

Query:
```
input: cuaca di sleman

http://localhost:5000/cek-city?msg=cuaca%20di%20sleman
```

### Harga Emas

Endpoint: `http://localhost:5000//harga-emas` <br />
Method: `GET` <br />
Skill untuk mendapatkan harga emas terkini. Harga emas secara otomatis di dapatkan oleh API setiap pukul 12 malam. Sumber berasal dari link `https://harga-emas.org/`


---

Widya Wicara Skills Backend Services. <br />
<small>Version: 1.1.10</small> <br />
<small>doc by: Wibisana Wiratama</small> <br />
