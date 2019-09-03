import { Response } from "express";

type Errors = {
    code: string,
    message: string,
    detail: string,
};

/**
 * Kirim error object dengan beberapa penyesuaian agar dapat dengan mudah dibaca oleh front-end.
 * Function errorState ini digunakan untuk mempermudah mengirim error ketika sebuah response mengalami error
 * @param res response dengan type Response (Express)
 * @param e error dari catch
 */
export const errorState = (res: Response, e: Errors): object => {
    // set status code "400 Bad Request"
    res.status(400);
    // hilangkan string Key, tanda "()" dan ubah "=" menjadi spasi, kemudian hilangkan spasi di depan dan belakang
    const prop = e.detail.replace("Key", "").replace(/[&()]/g, '').replace("=", " ").trim();
    // set huruf pertama text menjadi Uppercase
    const property = prop.charAt(0).toUpperCase() + prop.slice(1);

    return res.send({
        "error": {
            "message": `SQLSTATE[${e.code}] ` + e.message.match(/[^"]*/i)![0].trim(),
            "property": property
        }
    });
};