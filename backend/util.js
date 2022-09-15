import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from './config';
import nodemailer from "nodemailer";

const getToken = (user) => {
  return jwt.sign(
    { 
      ut_id: user.ut_id,
      nombre: user.nombre,
      empresa: user.empresa,
      oficina: user.oficina,
      email: user.email,
      terms_cond_acepted: user.terms_cond_acepted,
      isSuper: user.isSuper,
      isHiper: user.isHiper,
      isUser: user.isUser,
      isInge: user.isInge,
      vista: user.vista,
      
      // verified: user.verified,
    },
    config.JWT_SECRET,
    {
      expiresIn: "48h",
    }
  );
};

const isAuth = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    const onlyToken = token.slice(7, token.length);
    jwt.verify(onlyToken, config.JWT_SECRET, (err, decode) => {
      if (err) {
        return res.status(401).send({ message: "Invalid Token" });
      }
      req.user = decode;
      next();
      return;
    });
  } else {
    return res.status(401).send({ message: "Token is not supplied." });
  }
};

const isSuper = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.isSuper) {
    return next();
  }
  return res.status(401).send({ message: "Admin Token is not valid." });
};

const isHiper = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.isHiper) {
    return next();
  }
  return res.status(401).send({ message: "Admin Token is not valid." });
};

const isUser = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.isUser) {
    return next();
  }
  return res.status(401).send({ message: "Admin Token is not valid." });
};

const isInge = (req, res, next) => {
  console.log(req.user);
  if (req.user && req.user.isInge) {
    return next();
  }
  return res.status(401).send({ message: "Admin Token is not valid." });
};

const createHash = (algorithm, secret, data, digest) => {
  return crypto.createHmac(algorithm, secret).update(data).digest(digest);
};

const getKeys = (pass) => {
  const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 4096,
    publicKeyEncoding: {
      type: "spki",
      format: "pem",
    },
    privateKeyEncoding: {
      type: "pkcs8",
      format: "pem",
      cipher: "aes-256-cbc",
      passphrase: pass,
    },
  });


  const output = {
    public: publicKey,
    private: privateKey,
  };
  return output;
};

const encryptPublic = (toEncrypt, publicKey) => {
  var buffer = Buffer.from(toEncrypt);
  var encrypted = crypto.publicEncrypt(publicKey, buffer);
  return encrypted.toString("base64");
};

const encryptPrivate = (toEncrypt, privateKey) => {
  var buffer = Buffer.from(toEncrypt);
  var encrypted = crypto.privateEncrypt(privateKey, buffer);
  return encrypted.toString("base64");
};

const decryptPrivate = (toDecrypt, privateKey) => {
  var buffer = Buffer.from(toDecrypt, "base64");
  var decrypted = crypto.privateDecrypt(privateKey, buffer);
  return decrypted.toString("utf8");
};

const decryptPublic = (toDecrypt, publicKey) => {
  var buffer = Buffer.from(toDecrypt, "base64");
  var decrypted = crypto.publicDecrypt(publicKey, buffer);
  return decrypted.toString("utf8");
};

const createPassphrase = (length, stringType) => {
  return crypto.randomBytes(length).toString(stringType);
}
/**
 * Inicializa la funcion de envio de email para no tener que repetir la iniciacion
 * @returns {Object} Transporte del nodemailer 
 */
function crearTransporteEmail() {
  //email login part
  return nodemailer.createTransport({
    // pool: true, //desde correo de NAD
    host: config.HOST, //desde correo de NAD
    port: config.PUERTO_EMAIL, //desde correo de NAD
    // requireTLS: true, //desde correo de NAD
    secure: true,
    service: 'gmail', // solo para Gmail
    auth: {
      user: config.USUARIO_EMAIL,
      pass: config.PW_NAD,
    },
  });
};

/**
* @param {conf} Configuration this item holds the configuration: to, bcc, subject, html.
* @returns {String} Returns a boolean true if it succeeds sending the email, if not then it sends false.
*/ 
function EnvioEmail(conf, mailTransporter) {
  // console.log("config", conf)

  let { to, bcc, subject, html, priority, attachments } = conf;
  console.log("to", to, "bcc", bcc, "subject", subject)
  if (!mailTransporter) {
    mailTransporter = crearTransporteEmail();
  }
  //config options for the mail itself
  let mailDetails = {
    from: config.USUARIO_EMAIL,
    to: to,
    bcc: bcc,
    subject: subject,
    html: html,
    attachments: attachments,
    priority: priority,
  };
  mailTransporter.sendMail(mailDetails, (err, data) => {
    if (err) {
      console.log("Sucedieron errores " + err);
      return true;
    } else {
      console.log("Email se envio correctamente.");
      return false;
    }
  });
}


export {
  getToken,
  isAuth,
  isSuper,
  isHiper,
  isUser,
  isInge,
  createHash,
  encryptPrivate,
  decryptPrivate,
  encryptPublic,
  decryptPublic,
  getKeys,
  createPassphrase,
  EnvioEmail,
  crearTransporteEmail,
};