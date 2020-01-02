import * as dotenv from 'dotenv';
dotenv.config();

/** ambil variabel BASE_IGNITE dari .env */
const { BASE_IGNITE } = process.env;

export const igniteBase = BASE_IGNITE;
