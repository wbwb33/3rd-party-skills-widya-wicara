# Widya Wicara 3rd Party Skills

Backend Service untuk 3rd Party Skills API widya wicara smart speaker.

## Table of Contents

- [Skills](#skills)
  - [Horoscope](#horoscope)
  - [Weather](#weather)

## Skills

Untuk sestiap skill widya wicara menggunakan endpoint:

```
https://skills.widyawicara.com/
```

### Horoscope

Endpoint: `https://skills.widyawicara.com/horoscope` <br />
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
https://skills.widyawicara.com/horoscope?sign=libra&cat=pekerjaan&hari=lusa
```

### Weather

Endpoint: `https://skills.widyawicara.com/weather` <br />
Method: `GET` <br />
Skill weather menggunakan data dari BMKG. Data ini otomatis update setiap hari. Ada beberapa parameter ketika request, yaitu `kota` dan `hari`. Parameter `kota` bersifat mandatory. Untuk parameter `hari` yaitu `(besok, lusa)` ketika tidak di isi maka akan otomatis mendapatkan data hari ini.

Skill weather menggunakan susunan endpoint sebagai berikut:

```
https://skills.widyawicara.com/weather?kota=yogyakarta&hari=besok
```

---

Widya Wicara Skills Backend Services. <br />
<small>Version: 0.2.0</small> <br />
<small>doc by: Bagas Alfiandhi N</small> <br />
