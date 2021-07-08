import dotenv from 'dotenv';

//Agregar el setting de la zona horaria
process.env.TZ = 'America/Mexico_City'
let d = new Date();
let q = (d.getTimezoneOffset() / 60)

process.env.TIMEZONE_OFFSET = q * (-1);
////////////////////////////////////////

dotenv.config();

export default {
    PORT: process.env.PORT || 5000,
    TIMEZONE_OFFSET: process.env.TIMEZONE_OFFSET,
    MONGODB_URL: process.env.MONGODB_URL,

    JWT_SECRET: process.env.JWT_SECRET || 'secretosumarial',
    SECRET: process.env.SECRET,

    TIPO_EMAIL: process.env.TIPO_EMAIL,
    DE: process.env.DE,
    PW_EMAIL: process.env.PW_EMAIL,

    HTTPS: process.env.HTTPS,
    DOMINIO: process.env.DOMINIO,
    HOST: process.env.HOST,
    PUERTO_EMAIL: process.env.PUERTO_EMAIL,
    USUARIO_EMAIL: process.env.USUARIO_EMAIL,
    PW_NAD: process.env.PW_NAD,
    CAPTCHA_KEY: process.env.CAPTCHA_KEY,
    // || 'mongodb://localhost/homeof-app'
}