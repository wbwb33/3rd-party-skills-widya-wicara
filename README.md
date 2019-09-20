# Widya Wicara Backend API

- [Backend Services](#backend-services)
- [Skills](#skills)

## Backend Services
### Authentication

Authentication menggunakan JWT dengan format Authentication **Bearer Token**. Setiap endpoint akan memerlukan token yang diperoleh saat user login. 

Endpoint yang tidak memerlukan token yaitu:

- Login Route
  
  POST: https://api.widyawicara.com/user/login

- Register Route

  POST: https://api.widyawicara.com/user/

Ketika sebuah request tidak melampirkan token atau ada error token maka akan mendapat error `400 Bad Request` dengan struktur response seperti berikut:
```
"message": "Token is not provided"

// atau

"name": "JsonWebTokenError",
"message": "invalid token"

// atau

"name": "TokenExpiredError",
"message": "jwt expired",
"expiredAt": "2019-09-13T04:22:59.000Z"
```

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

## Endpoint Sample Response
### User 
#### Add user/Register User
Endpoint : `https://api.widyawicara.com/user` <br />
Method : `POST`

Body (`application/x-www-form-urlencoded`) :  
```
username : "admin"
password : "password"
name : "Administrator"
email : "widya@gmail.com"
```

`200 Success` Sample Response :
```
"status": "success",
"message": {
  "action": "register user",
  "data": {
    "name": "Testing Testing",
    "username": "admin",
    "email": "widya@gmail.com"
  }
}
```

`400 Bad Request` Sample Response :
```
"status": "error",
"message": [
  {
    "property": "name",
    "error": {
       "minLength": "name must be longer than or equal to 3 characters"
    }
  },
  {
    "property": "email",
    "error": {
      "isEmail": "email must be an email"
    }
  }
]
```
#### Login User:
Endpoint : `https://api.widyawicara.com/user/login` <br />
Method : `POST`

Body (`application/x-www-form-urlencoded`) :  
```
email : "tiffa@gmail.co.id"
password : "password"
```

`200 Success` Sample Response :
```
"status": "success",
"message": {
  "action": "user login",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTU2ODY4NzU5NSwiZXhwIjoxNTY5MjkyMzk1fQ.TkT8ReNYUs2plv_u6m5huwHqQHU2pJtX58yfPojUkCI"
  }
}
```

`400 Bad Request` Sample Response :
```
"status": "error",
"message": "some values are missing"

// atau

"status": "error",
"message": "password not match"

// atau

"status": "error",
"message": "email not found"
```
#### Update User
Endpoint : `https://api.widyawicara.com/user` <br />
Method : `PUT`

Authentication (`Bearer Token`)  : `token provided from login`

Body (`application/x-www-form-urlencoded`) optional :  
```
username : "admin"
name : "Administrator"
email : "widya@gmail.com"
```

`200 Success` Sample Response :
```
"status": "success",
"message": {
  "action": "update user data",
  "data": {
    "id": 12,
    "username": "admin",
    "email": "widya@gmail.co.id",
    "name": "Administrator"
  }
}
```
`400 Bad Request` Sample Response :
```
"status": "error",
"message": "user not found"
```
#### Update User
Endpoint : `https://api.widyawicara.com/user` <br />
Method : `PUT`

Authentication (`Bearer Token`)  : `token provided from login`

Body (`application/x-www-form-urlencoded`) optional :  
```
username : "admin"
name : "Administrator"
email : "widya@gmail.com"
```

`200 Success` Sample Response :
```
"status": "success",
"message": {
  "action": "update user data",
  "data": {
    "id": 12,
    "username": "admin",
    "email": "widya@gmail.co.id",
    "name": "Administrator"
  }
}
```
`400 Bad Request` Sample Response :
```
"status": "error",
"message": "user not found"
```
#### Update User Password
Endpoint : `https://api.widyawicara.com/user/update-password` <br />
Method : `PUT`

Authentication (`Bearer Token`)  : `token provided from login`

Body (`application/x-www-form-urlencoded`) :  
```
old_password: "test"
new_password: "testing"
```

`200 Success` Sample Response :
```
"status": "success",
"message": {
  "action": "update user password",
  "data": {
    "id": 12,
    "username": "admin",
    "email": "widya@gmail.co.id",
    "name": "Administrator"
  }
}
```
`400 Bad Request` Sample Response :
```
"status": "error",
"message": "old password not match"

// atau

"status": "error",
"message": "new password not match"
```
### Device
#### Add Device
Endpoint : `https://api.widyawicara.com/device` <br />
Method : `POST`

Authentication (`Bearer Token`)  : `token provided from login`

Body (`application/x-www-form-urlencoded`) optional :  
```
device_key: "912512512512348523657"
device_ip: "192.168.200.189"
firmware_version: "12"
```

`200 Success` Sample Response :
```
"status": "success",
"message": {
  "action": "create device",
  "data": {
    "device_key": "912512512512348523657",
    "device_ip": "192.168.200.189",
    "firmware_version": "12",
    "device_name": null,
    "device_type": null,
    "id": 11
  }
}
```

`400 Bad Request` Sample Response :
```
"status": "error",
"message": [
  {
    "property": "device_key",
    "error": {
      "isNotEmpty": "Required"
    }
  }
]
```
#### Get Selected Device
Endpoint : `https://api.widyawicara.com/device/912512512512348523657` <br />
Method : `GET`

Authentication (`Bearer Token`)  : `token provided from login`

`200 Success` Sample Response :
```
"status": "success",
"message": {
  "action": "get device",
  "data": {
    "id": 1,
    "device_key": "9102269610348523657",
    "device_ip": "192.168.100.189",
    "firmware_version": "12",
    "device_name": "Widya Speaker Ku",
    "device_type": "WOW",
    "pairedTo": {
      "name": "Tiffa Sutopo"
    }
  }
}
```

`400 Bad Request` Sample Response :
```
"status": "error",
"message": "device with uuid: 912512512512348523657 not found"
```
#### Delete Device
Endpoint : `https://api.widyawicara.com/device/912512512512348523657` <br />
Method : `DELETE`

Authentication (`Bearer Token`)  : `token provided from login`

`200 Success` Sample Response :
```
"status": "success",
"message": {
  "action": "delete device",
  "data": "device with uuid: 912512512512348523657 deleted"
}
```

`400 Bad Request` Sample Response :
```
"status": "error",
"message": "device with uuid: 912512512512348523657 not found"
```

#### Get All Device (Development only)
Endpoint : `https://api.widyawicara.com/device` <br />
Method : `GET`

Authentication (`Bearer Token`)  : `token provided from login`

`200 Success` Sample Response :
```
"status": "success",
"message": {
  "action": "get all device",
  "data": [
    {
      "id": 1,
      "device_key": "9102269610348523657",
      "device_ip": "192.168.100.189",
      "firmware_version": "12",
      "device_name": "Widya Speaker Ku",
      "device_type": "WOW",
      "pairedTo": {
          "name": "Tiffa Sutopo"
      }
    },
    {
      "id": 9,
      "device_key": "14438001231231248164",
      "device_ip": "192.168.10.195",
      "firmware_version": "12",
      "device_name": "Widya Punya Argo",
      "device_type": "PRIMA",
      "pairedTo": {
          "name": "Tiffa Sutopo"
      }
    }
  ]
}
```

### Pairing
#### Add Pairing
Endpoint : `https://api.widyawicara.com/pairing` <br />
Method : `POST`

Authentication (`Bearer Token`)  : `token provided from login`

Body (`application/x-www-form-urlencoded`) optional :  
```
device_key: "14438001231231248164"
device_name: "Widya Punya Argo"
device_type: "PRIMA"
```

`200 Success` Sample Response :
```
"status": "success",
"message": {
  "action": "success pairing device",
  "data": {
    "device_key": "14438001231231248164",
    "device_name": "Widya Punya Argo",
    "device_type": "PRIMA",
    "paired_to": "Tiffa Sutopo"
  }
}
```

`400 Bad Request` Sample Response (ketika device_key tidak di isi) :
```
"status": "error",
"message": "additional data is required!"
```
#### Get Pairing
Endpoint : `https://api.widyawicara.com/pairing` <br />
Method : `GET`

Authentication (`Bearer Token`)  : `token provided from login`

`200 Success` Sample Response :
```
"status": "success",
"message": {
  "action": "get paired device",
  "data": {
    "id": 1,
    "name": "Tiffa Sutopo",
    "device": [
      {
        "id": 9,
        "device_key": "14438001231231248164",
        "device_ip": "192.168.10.195",
        "firmware_version": "12",
        "device_name": "Widya Punya Argo",
        "device_type": "PRIMA"
      },
      {
        "id": 1,
        "device_key": "9102269610348523657",
        "device_ip": "192.168.100.189",
        "firmware_version": "12",
        "device_name": "Widya Speaker Ku",
        "device_type": "WOW"
      }
    ]
  }
}
```
#### Update Device Name
Endpoint : `https://api.widyawicara.com/pairing/14438001231231248164` <br />
Method : `PUT`

Authentication (`Bearer Token`)  : `token provided from login`

Body (`application/x-www-form-urlencoded`) optional :  
```
device_name: "Widya Punya Argo"
```

`200 Success` Sample Response :
```
"status": "success",
"message": {
  "action": "update device name",
  "data": {
    "device_key": "14438001231231248164",
    "device_name": "Widya Punya Argo",
    "paired_to": "Tiffa Sutopo"
  }
}
```

`400 Bad Request` Sample Response (ketika device_name tidak di isi) :
```
"status": "error",
"message": "device_name required"
```
#### Delete Pairing
Endpoint : `https://api.widyawicara.com/pairing/8051872540056641751` <br />
Method : `DELETE`

Authentication (`Bearer Token`)  : `token provided from login`

`200 Success` Sample Response :
```
"status": "success",
"message": {
  "action": "delete device pairing",
  "data": {
    "device_key": "8051872540056641751",
    "device_name": "PRIMA Punya Tiffa",
    "device_type": "PRIMA"
  }
}
```

`400 Bad Request` Sample Response :
```
"status": "error",
"message": "device with uuid: \"8051872540056641751asd\" not found or not yet paired"
```

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

Widya Wicara Backend Services. <br />
Postman Doc: https://documenter.getpostman.com/view/5768908/SVfWLRX5?version=latest <br />
<small>Version: 0.3.0</small>  <br />
<small>doc by: Bagas Alfiandhi N</small> <br />