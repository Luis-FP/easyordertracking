import express from "express";
import User from '../models/employee_model.js';
import { pendienteNotificacionEmail } from "../pages/pendienteEnviadoPage.js";

import { isAuth,crearTransporteEmail, EnvioEmail, isSuper } from '../util';
const router = express.Router();

router.post("/reclamo",  isAuth, async (req, res) => {
  try{
      const criterio =  
      {
      'vista': req.body.to.grupo,
      };

      const emailLider = await User.findOne({...criterio});

      let conf = {
      to: emailLider.email,
      subject: "Reclamo creado para su Grupo:",
      html: "",
      };

      conf.html = reclamoNotificacionEmail(req.body.to.titulo);
      // console.log(conf.html);
      EnvioEmail(conf);
      console.log(
      `Comprobacion de email enviada para : {"${req.body.to.titulo}", "${emailLider.email}"}`
      );
      res.status(200).send({ error: false, message: "email enviado correctamente" })
  } catch(error){
    res.status(500).send({ error: true, message: "completado la subida de los kpis" })
  }
});

  router.post("/reclamorevisado",  isAuth,isSuper, async (req, res) => {
    try{
        console.log("req.body",req.body)
        const criterio =  
        {
        'ut_id': req.body.to.ut_id_emisor,
        };

        const emailEmisor = await User.findOne({...criterio});
        console.log("emailEmisor",emailEmisor)
        let conf = {
        to: emailEmisor.email,
        subject: "Sur reclamo ha sido revisado por el lider del área",
        html: "",
        };

        conf.html = reclamoRevisadoNotificacionEmail(req.body.to.titulo);
        // console.log(conf.html);
        EnvioEmail(conf);
        console.log(
        `Comprobacion de email enviada para : {"${req.body.to.titulo}", "${emailEmisor.email}"}`
        );
        res.status(200).send({ error: false, message: "email enviado correctamente" })
  } catch(error){
    res.status(500).send({ error: true, message: "completado la subida de los kpis" })
  }
  });

  router.post("/pendiente",  isAuth, isSuper, async (req, res) => {
    console.log('req.body', req.body);
    try{
        const criterio =  
        {
        'ut_id': req.body.idUserDetail,
        };
  
        const emailUsuario = await User.findOne({...criterio});
  
        let conf = {
        to: emailUsuario.email,
        subject: "Ha recibido un nuevo Pendiente:",
        html: "",
        };
  
        conf.html = pendienteNotificacionEmail(req.body.pendienteNuevo);
        // console.log(conf.html);
        EnvioEmail(conf);
        console.log(
        `Comprobacion de email enviada para : {"${req.body.pendienteNuevo}", "${emailUsuario.email}"}`
        );
        res.status(200).send({ error: false, message: "email enviado correctamente" })
    } catch(error){
      res.status(500).send({ error: true, message: "completado la subida de los kpis" })
    }
  });

  // router.post("/junta",  isAuth, isSuper, async (req, res) => {
   
  // });
  
export default router;
