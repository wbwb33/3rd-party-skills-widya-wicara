# Widya Wicara Backend API

- [Backend Services](#backend-services)
- [Skills](#skills)

## Backend Services
### Authentication
Authentication menggunakan JWT dengan format Authentication **Bearer Token**. Setiap endpoint akan memerlukan token yang diperoleh saat user login. <br /> 
Endpoint yang tidak memerlukan token yaitu:
- Login Route <br /> 
	POST: https://api.widyawicara.com/user/login
- Register Route <br /> 
	POST: https://api.widyawicara.com/user/

Ketika sebuah request tidak melampirkan token maka akan mendapat error `400 Bad Request` dengan struktur response seperti berikut:

    "message": "Token is not provided"

### Response
1. 200 OK dan 201 Created <br />
Setiap request yang berhasil akan memberikan struktur response seperti berikut:
	```
	status: "success",
    message: {
        action: "",
        data: ""
    }
    ```

2. 404 Not Found <br />
Route dengan method yang tidak terdefinisi akan memberikan struktur response seperti berikut:
	```
    "error": "route /pairing/ with method DELETE not found"
    ```

3. 400 Bad Request <br />
Server akan mengirim error `400 Bad Request` ketika ada data yang dibutuhkan di body tidak terisi atau ketika request tidak bisa dijalankan. Error ini memiliki struktur seperti berikut:
    ```
	"status": "error",
    "message": "additional data is required!"
    
    // atau
    
    "status": "error",
    "message": {
        detail: "",
        property: ""
    }
    ```

4. 500 Internal Server Error <br /> 
Server akan mengirimkan `500 Internal Server Error` ketika ada error yang tidak diketahui dengan struktur seperti berikut:
    ```
    status: "internal server error"
    ```

### Backend Behaviour
Setiap request akan meminta token untuk mendapatkan response, token yang di dapat saat login adalah representasi dari User ID, oleh karena itu setiap data yang di request akan berhubungan dengan user tersebut. Contoh ketika akan menambah pairing device, maka hanya perlu memasukkan data speaker, dan akan otomatis ter-pair ke user yang bersangkutan, berlaku juga untuk delete pairing, dan lain-lain.
<br />

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
<br /> 
Widya Wicara Backend Services. <br /> 
<small>Version: 0.1-alpha.</small> <br /> 
<small>doc by: Bagas Alfiandhi N</small>