
import User from "../models/employee_model.js";

import {
  EnvioEmail,
} from "../util";

import { eficienciaNotificacionEmail } from "../pages/eficienciaEnviadoPage.js";
import { liderazgoNotificacionEmail } from "../pages/liderazgoEnviadoPage.js";
const notificacionEficiencia = async ()  =>  {

const lideres = await User.find({
    isSuper: true, 
    isActive: true
    },{email:1});

  let timeout = 500;

  let i = 0;
  console.log(lideres.length)
  while (i < lideres.length) {

    let conf = {
        to: lideres[i].email,
        subject: "Tiene una evaluacion de Eficiencia pendiente",
        html: "",
        };
    conf.html = eficienciaNotificacionEmail();

    setTimeout(() => {
        EnvioEmail(conf);
        // console.log("enviando email", conf)
    }, timeout);
    timeout += 500;
    i++;
  }
};

const notificacionLiderazgo = async ()  =>  {

  const colaboradores = await User.find({
      isActive: true
      },{email:1});
  

    let timeout = 500;
  
    let i = 0;
    console.log(colaboradores.length)
    while (i < colaboradores.length) {
  
      let conf = {
          to: colaboradores[i].email,
          subject: "Tiene una evaluacion de Liderazgo pendiente",
          html: "",
          };
      conf.html = liderazgoNotificacionEmail();
  
      setTimeout(() => {
          EnvioEmail(conf);
          // console.log("enviando email", conf)
      }, timeout);
      timeout += 500;
      i++;
    }
  };

export default {notificacionEficiencia, notificacionLiderazgo};
