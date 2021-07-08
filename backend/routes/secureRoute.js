import express from "express";
import User from "../models/employee_model";
import Server from "../models/serverModel";
// import Server from "../models/serverModel";
import { encryptPublic, createPassphrase, getKeys } from "../util";
const router = express.Router();


router.post("/createKeys", async (req, res) => {
  console.log('entro al route')
  let passphrase = createPassphrase(50);
  let keys = getKeys(passphrase);
  let server = Server.find({});
  if (server) {
    res.send({ exito: true });
  }
  else {
    await Server.insertOne({ pubKey: keys.public, privKey: keys.private, passphrase: passphrase });
    res.send({ exito: false })
  }
  ;
});

router.post("/login", async (req, res) => {
  console.log('entro al secure route')
  console.log(req.body)
  const user = await User.findOne({ email: new RegExp(req.body.email, 'i') });
  if (user) {
    res.send({
      error: false, message: "Eagle landed.", keyInfo: {
        key: user.pubKey,
        passphrase: user.passphrase,
        terms_cond_acepted: user.terms_cond_acepted
      }
    });
  } else {
    res.send({ error: true, message: "Por favor validar los datos ingresados." });
  }
});

//usuario nada mas tiene hash
router.post("/chpass", async (req, res) => {
  console.log('entro al secure route hash')
  console.log(req.body);
  const user = await User.findOne({ verificationHash: req.body.hash });

  if (user) {
    res.send({
      error: false, message: "Eagle landed.", keyInfo: {
        key: user.pubKey,
        passphrase: user.passphrase,
      }
    });
  } else {
    res.send({ error: true, message: "User Not Found" });
  }
});
//usuario tiene ut_id
router.post("/chpass2", async (req, res) => {
  console.log('entro al secure route utid')
  console.log(req.body)
  const user = await User.findOne({ ut_id: req.body.ut_id });

  if (user) {
    res.send({
      error: false, message: "Eagle landed.", keyInfo: {
        key: user.pubKey,
        passphrase: user.passphrase,
      }
    });
  } else {
    res.send({ error: true, message: "User Not Found" });
  }
});

export default router;