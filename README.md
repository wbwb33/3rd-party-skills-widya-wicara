# Widya Wicara 3rd Party Skills
Backend Service untuk 3rd Party Skills API widya wicara smart speaker.

## Table of Contents
- [Skills](#skills)
  - [Weather](#weather)

## Skills
Untuk sestiap skill widya wicara menggunakan endpoint:
```
https://api.widyawicara.com/skills/
```

### Weather
Skill weather menggunakan data dari BMKG. Data ini otomatis update setiap hari. Ada beberapa parameter ketika request, yaitu `kota` dan `hari`. Parameter `kota` bersifat mandatory, untuk parameter `hari` ketika tidak di isi maka akan otomatis mendapatkan data hari ini.

Skill weather menggunakan susunan endpoint sebagai berikut:
```
https://api.widyawicara.com/skills/weather?kota=yogyakarta&hari=besok
```
Untuk parameter hari yang bisa digunakan yaitu: `hari ini`, `besok`, atau `lusa`.
- - -

Widya Wicara Skills Backend Services. <br />
<small>Version: 0.1.0</small>  <br />
<small>doc by: Bagas Alfiandhi N</small> <br />
