import express from "express";
import querystring from "querystring";
import https from "https";
import User from "../models/employee_model.js";
import Detallesings from "../models/detalles_model.js";

import OTs from "../models/ots_model.js";
import OTSRegistros from "../models/ots_registros_model.js";
import Bitacoras from "../models/bitacora_model.js";
import { createRecoveryEmailPage } from "../pages/recoveryEmailPage";
import { createEmailValidation } from "../pages/validationPage";
import { otNuevaEmail} from "../pages/otNuevaEnvioEmail";
import { otActualizadaEmail} from "../pages/otActualizadaEnvioEmail";

import { 
  getWeekNumber,
  queMes,
  fechaUnica,
  fechaRegional,
  fechaRegionalUnica,
  fechaRegionalUnicaInput,
  fechaRegionalInput,
} from "../fechas";
import {
  EnvioEmail,
  getToken,
  isAuth,
  isHiper,
  isSuper,
  isUser,
  isInge,
  createPassphrase,
  createHash,
  crearTransporteEmail,
  getKeys,
  decryptPrivate
} from "../util";
import { mongo, Mongoose } from "mongoose";
import config from "../config";




const router = express.Router();

router.post("/login", async (req, res) => {

  console.log("test", req.body);
  //----------------------- LOGIN HANDLE -------------------------
  const loginHandle = async () => {

    const signinUser = await User.findOne({
      email: new RegExp(req.body.email, 'i'), //no deberian haber dos emails iguales/en blanco etc..
      // password: req.body.info.password,
    });
    console.log("signinUse activexx", signinUser.isActive);

    let values = await JSON.parse(decryptPrivate(req.body.values, {
      passphrase: signinUser.passphrase,
      key: signinUser.privKey
    }));


    console.log(
      // "secret",
      // config.SECRET,
      "pass",
      values.password,
      "salt",
      signinUser.salt
    );
    console.log(
      values.password,
      "new inputed password: ",
      createHash(
        "sha256",
        config.SECRET,
        values.password + signinUser.salt,
        "hex"
      )
    );

    // if (signinUser) {
    if (signinUser && signinUser.isActive == true) {
      let values = await JSON.parse(decryptPrivate(req.body.values, {
        passphrase: signinUser.passphrase,
        key: signinUser.privKey
      }));


      console.log(
        // "secret",
        // config.SECRET,
        "pass",
        values.password,
        "salt",
        signinUser.salt
      );
      console.log(
        values.password,
        "new inputed password: ",
        createHash(
          "sha256",
          config.SECRET,
          values.password + signinUser.salt,
          "hex"
        )
      );

      //password+salt)
      if (
        signinUser.password !==
        createHash(
          "sha256",
          config.SECRET,
          values.password + signinUser.salt,
          "hex"
        )
      )
        res.send({ error: true, message: "Email or Password Invalidos" });
      else {
        // const idLider = await User.findOne({ id_empleado: signinUser.id_lider });// el lider deberia ser otra colelccion, no deberia estar en usuarios.
        // if (idLider) {
          //probablmente esto no debe ser obligatorio para no tener problemas. y qu eluego se pueda asignar.
          // console.log("signin", signinUser);
          // signinUser.idLider = idLider.ut_id;
          signinUser.verificationHash = "";
          await signinUser.save();
          // console.log('signin', signinUser, "idLider ", idLider)
          console.log('usuario logged in')
          return res.send({
            ut_id: signinUser.ut_id,
            nombre: signinUser.nombre,
            empresa: signinUser.empresa,
            oficina: signinUser.oficina,
            email: signinUser.email,
            token: getToken(signinUser),
            terms_cond_acepted: signinUser.terms_cond_acepted ? signinUser.terms_cond_acepted : false,

            grupo: signinUser.grupo, 
            vista: signinUser.vista,
            isUser: signinUser.isUser,
            isSuper: signinUser.isSuper,
            isHiper: signinUser.isHiper,
            isInge: signinUser.isInge

          });
        
      }
    } else if (signinUser && signinUser.isActive == false) {
      return res.status(200).send({ error: true, message: "Usuario Desactivado." });
    }
    else {
      return res.status(200).send({ error: true, message: "Por favor validar los datos ingresados." });
    }
  }
  // ---------------------- END LOGIN HANDLE -----------------------

  // if (req.body.info.email == "") break;//TO DO enviar error y colocar esto
  //------------------------CAPTCHA HANDLE ------------------------------  
  let postData = querystring.stringify({
    secret: config.CAPTCHA_KEY,
    response: req.body.token,
  });
  // console.log("postData");
  // console.log(postData);
  let options = {
    hostname: "www.google.com",
    port: 443,
    path: "/recaptcha/api/siteverify",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": postData.length,
    },
  };
  const reqs = https
    .request(options, (resp) => {
      console.log("statusCode:", resp.statusCode);
      //console.log("headers:", resp.headers);
      //console.log("data send stuff");
      let data = "";
      resp.on("data", (chunk) => {
        // console.log("chunk");
        // console.log(chunk.toString("utf8"));
        data += chunk.toString("utf8");
      });

      resp.on("end", async () => {
        data = JSON.parse(data);
        console.log("Body: ", data);
        if (data) {
          if (data.success) {
            if (data.score > 0) {
              console.log("true");
              // res.status(200).send({ captcha: true });
              await loginHandle();
            } else {
              console.log("false");
              // res.status(500).send({ captcha: false }); 
              res.send({ error: true, message: "Entradas posiblemente maliciosas." });

            }
          } else {
            console.log("false - no data");
            // res.status(500).send({ captcha: false }); 
            res.send({ error: true, message: "Error de Captcha. Por favor crear un ticket de soporte." });

          }
        }
      });
    })
    .on("error", (err) => {
      console.error(err);
    });
  reqs.write(postData);
  reqs.end();
  //-----------------------END CAPTCHA HANDLE---------------------------


});



router.post("/proyecto", isAuth, async (req, res) => {
  try {
    let datosUsuario = await User.findOne({ ut_id: req.user.ut_id });
    var vistaUsuario= datosUsuario.vista
    const vistaSolicitada = req.body.cliente;
    console.log(vistaUsuario,vistaSolicitada, vistaUsuario = vistaSolicitada, )

    if([vistaUsuario].includes(vistaSolicitada)){
      console.log(vistaUsuario,"incluye la vista solicitada",vistaSolicitada )
      const filtro = {
        cliente:vistaSolicitada.toLowerCase()
      }
      const bitacora = await Bitacoras.find(filtro); //{ cliente: req.body.cliente.toLowerCase() }
      // console.log("bitacora", bitacora)
      res.status(200)
      .send({ message: "TT leido guardado", data: bitacora})
    } else {
    // let detalle = await Detalles.find({ cliente: req.body.cliente.toLowerCase() });

    console.log("no son iguales" )
    }

  } catch (errorGuardando) {
    console.log(errorGuardando);
    res
      .status(500)
      .send({ error: errorGuardando, message: "Error Guardando Aceptacion de TC." });
  }
});


router.get("/listasitios", isAuth, async (req, res) => {
  try {
    let datosUsuario = await User.findOne({ ut_id: req.user.ut_id });
    const vistaUsuario= datosUsuario.vista
    console.log(vistaUsuario )

      const filtro = [
          {
          '$match':
                {
                  'proyecto': { $in: vistaUsuario}
                }
          },
      ];
      const listaSitios = await Detallesings.aggregate(filtro); //{ cliente: req.body.cliente.toLowerCase() }
      console.log("listaSitios", listaSitios)
      res.status(200)
      .send({ message: "lista de sitioss", data: listaSitios})
  } catch (errorBuscando) {
    console.log(errorBuscando);
    res
      .status(500)
      .send({ error: errorBuscando, message: "Error  busqueda de sitios." });
  }
});


router.post("/createotnueva", isAuth, (isUser || isInge || isHiper || isSuper), async (req, res) => {
  try {

      console.log("req usuario", req.user);
      let otInfo = req.body.otInfo;
      let archivos = req.body.archivos;
      console.log("req datos crear", otInfo);
      
      
      if (otInfo === null || otInfo == "")
        res.send({ error: true, message: "No envio ninguna OT para crear." });
        //busca el ultimo numero de OT

        const userMax = await OTs.aggregate([
          {
            $group: {
              _id: null,
              max: {
                $max: {
                  $toInt: "$ot_number",
                },
              },
            },
          },
        ]);
        console.log("userMax", userMax[0]);
        let otMaxima = 0;
        let errores =[];
        if(userMax[0]===undefined || userMax[0]===null  ){
        otMaxima=1
        }else{
        otMaxima = userMax[0].max + 1
        }
        if (
          // otInfo.cliente == "" || //no proseguir si falta Informacion
          otInfo.detalle_requerimiento == "" ||
          // otInfo.email_responsable_cliente == "" ||
          otInfo.fecha_requerida ==  "" ||
          otInfo.prioridad ==  "" ||
          otInfo.proyecto ==  "" ||
          otInfo.requerimiento ==  "" ||
          // otInfo.responsable_cliente ==  "" ||
          otInfo.sitio_codigo ==  "" ||
          otInfo.sitio_nombre ==  "" 
    
        ) {
          errores.push(
            `${otInfo.sitio_codigo} ${otInfo.requerimiento}`
          );
          console.log("errores", `${otInfo.sitio_codigo} ${otInfo.requerimiento}`);
          // continue;
        }

        const otNueva = new OTs({
            ot_number:  otMaxima ,
            pais: otInfo.pais,
            cliente: req.user.empresa,
            sitio_codigo: otInfo.sitio_codigo,
            sitio_nombre: otInfo.sitio_nombre,
            proyecto: otInfo.proyecto,
            responsable_cliente: req.user.nombre,
            email_responsable_cliente: req.user.email,
            requerimiento: otInfo.requerimiento,
            detalle_requerimiento: otInfo.detalle_requerimiento,
            prioridad: otInfo.prioridad,
            estado: 'ini',
            fecha_requerida: otInfo.fecha_requerida,
            fecha_sla: otInfo.fecha_sla,
            fecha_apertura: new Date(),
            archivos: archivos
          })
          const otRegistro = new OTSRegistros({
            ot_number:  otMaxima ,
            estado: 'ini',
            fecha_registro: new Date(),
            comentarios_responsable_ot: "",
            detalle_requerimiento:  otInfo.detalle_requerimiento,
          });
          // ,
            // email informando
            let emailTransport = crearTransporteEmail();         
              let conf = {
                to: req.user.email,
                bcc:  ['luis.parparcen@gmail.com','coordinge@atmotechnologies.com'],
                subject: "OT Nueva Creada",
                html: "",
                };
            conf.html = otNuevaEmail(otNueva);
            EnvioEmail(conf, emailTransport);
    
      console.log(otNueva);
      await otRegistro.save();
       await otNueva.save();
       res.send({
        error: false,
        ot_number: errores.length != 0 ? '' : otMaxima, // mando el numero de la OT
        message: errores.length != 0 ? errores : "Exito al subir los datos.",
      });

  } catch (errorGuardando) {
    console.log(errorGuardando);
    res
      .status(401)
      .send({ error: errorGuardando, message: "Error creando OT." });
  }
});


router.post("/actualizarot", isAuth, (isUser || isInge || isHiper || isSuper), async (req, res) => {
  // try {

      console.log("req usuario", req.user);
      let otInfo = req.body;
      console.log("req datos actualizar", otInfo);
      try{
        let otactualizada = await OTs.findOne({ot_number: req.body.ot_number})
        let sitioactualizado = await Detallesings.findOne({sitio_codigo: req.body.sitio_codigo})
        console.log('otActualizada', otactualizada)
        // console.log("sitioactualizado", sitioactualizado)
     // cambios de OT
          if(otInfo.email_responsable_clienteChange) otactualizada['email_responsable_cliente'] = {email_responsable_cliente:  otInfo.email_responsable_cliente}
          if(otInfo.responsable_clienteChange) otactualizada = {responsable_cliente:  otInfo.responsable_cliente}
          if(otInfo.estadoChange) otactualizada['estado'] =  otInfo.estado;
          if(otInfo.fecha_requeridaChange) otactualizada.fecha_requerida =  otInfo.fecha_requerida;
          if(otInfo.prioridadChange) otactualizada.prioridad =  otInfo.prioridad;
          if(otInfo.requerimientoChange) otactualizada.requerimiento =  otInfo.requerimiento;  
          if(otInfo.detalle_requerimientoChange) otactualizada.detalle_requerimiento =  otInfo.detalle_requerimiento;  
          if(otInfo.responsable_otChange) otactualizada.responsable_ot =  otInfo.responsable_ot;
          if(otInfo.email_responsable_otChange) otactualizada.email_responsable_ot =  otInfo.email_responsable_ot;
          if(otInfo.comentarios_responsable_otChange) otactualizada.comentarios_responsable_ot =  otInfo.comentarios_responsable_ot;

          console.log('otActualizada2', otactualizada)

        // cambios de Sitio
          if(otInfo.altura_pararrayosChange) sitioactualizado.altura_pararrayos =  otInfo.altura_pararrayos;
          if(otInfo.altura_validadaChange) sitioactualizado.altura_validada =  otInfo.altura_validada;
          if(otInfo.area_a_utilizarChange) sitioactualizado.area_a_utilizar =  otInfo.area_a_utilizar;
          if(otInfo.area_arrendadaChange) sitioactualizado.area_arrendada =  otInfo.area_arrendada;
          if(otInfo.arrendatarioChange) sitioactualizado.arrendatario =  otInfo.arrendatario;
          if(otInfo.identificacion_arrendatarioChange) sitioactualizado.identificacion_arrendatario =  otInfo.identificacion_arrendatario;  
          if(otInfo.departamentoChange) sitioactualizado.departamento =  otInfo.departamento;
          if(otInfo.municipioChange) sitioactualizado.municipio =  otInfo.municipio;
          if(otInfo.provinciaChange) sitioactualizado.provincia =  otInfo.provincia;
        
          if(otInfo.direccion_sitioChange) sitioactualizado.direccion_sitio =  otInfo.direccion_sitio;
          if(otInfo.latitud_validada_gradosChange) sitioactualizado.latitud_validada_grados =  otInfo.latitud_validada_grados;
          
          if(otInfo.longitud_validada_gradosChange) sitioactualizado.longitud_validada_grados =  otInfo.longitud_validada_grados;
          console.log("ok")
          if(otInfo.numero_fincaChange) sitioactualizado.numero_finca =  otInfo.numero_finca;
          if(otInfo.orientacion_torreChange) sitioactualizado.orientacion_torre =  otInfo.orientacion_torre;
          if(otInfo.resistencia_vientoChange) sitioactualizado.resistencia_viento =  otInfo.resistencia_viento;
          if(otInfo.tipo_estructuraChange) sitioactualizado.tipo_estructura =  otInfo.tipo_estructura;
          if(otInfo.tipologia_sitioChange) sitioactualizado.tipologia_sitio =  otInfo.tipologia_sitio;
          if(otInfo.txChange) sitioactualizado.tx =  otInfo.tx;
          if(otInfo.derecho_paso_sitioChange) sitioactualizado.derecho_paso_sitio =  otInfo.derecho_paso_sitio;
          if(otInfo.electricidad_sitioChange) sitioactualizado.electricidad_sitio =  otInfo.electricidad_sitio;


          const otRegistro = new OTSRegistros({
            ot_number:   req.body.ot_number ,
            estado: otInfo.estado,
            fecha_registro: new Date(),
            comentarios_responsable_ot: otInfo.comentarios_responsable_ot? otInfo.comentarios_responsable_ot:"" ,
            detalle_requerimiento:  otInfo.detalle_requerimiento? otInfo.detalle_requerimiento : "",
          });
          await otRegistro.save();
          console.log("ok", sitioactualizado)
          const otAct = await otactualizada.save();
          const sitioAct = await sitioactualizado.save();
      
          // email informando
          let emailTransport = crearTransporteEmail();

          // coordinge@atmotechnologies.com
            let conf = {
              to:  req.user.email ,
              bcc:  ['luis.parparcen@gmail.com','coordinge@atmotechnologies.com',  otInfo.email_responsable_ot],
              subject: "OT Actualizada",
              html: "",
              };
          conf.html = otActualizadaEmail(otactualizada);
    

              EnvioEmail(conf, emailTransport);

  
       res
       .status(200)
       .send({
        error: false,
        message: "Exito al actualizando los datos.",
      });

  } catch (errorActualizando) {
    console.log(errorActualizando);
    res
      .status(401)
      .send({ error: errorActualizando, message: "Error actualizando OT." });
  }
});


router.get("/otsuser", isAuth, async (req, res) => {
  try {
    let datosUsuario = await User.findOne({ ut_id: req.user.ut_id });
    var vistaUsuario= datosUsuario.vista
    console.log(vistaUsuario )

    let filtro  = [
      {
      '$skip': 0
      },
  ];;

  let filtro2  = [
    {
    '$skip': 0
    },
];;

    if(req.user.isHiper){
      // vista total
    }else if(req.user.isSuper){
      filtro = [
        {
        '$match':
              {
                'proyecto': { $in: vistaUsuario},
              }
        },
    ];
    } else if(req.user.isInge){
      filtro = [
        {
        '$match':
              {
                'proyecto': { $in: vistaUsuario},
                'responsable_ot': req.user.nombre // ingenieros solo ven sus asignaciones
              }
        },
    ];
  }else if(req.user.isUser){
    filtro = [
      {
      '$match':
            {
              'proyecto': { $in: vistaUsuario},
              'responsable_cliente': req.user.nombre // usuarios solo ven sus ordenes
            }
      },
    ];
  };

    const ots = await OTs.aggregate(filtro); //{ cliente: req.body.cliente.toLowerCase() }






    // const ots_registos = await OTSRegistros.aggregate(filtro2); 
    
  // datos para metricas

  let diaActual = new Date();
  let dia, mes
  let arregloMes= []
  let arregloData = []
  for (let x = 4; x>-1; x--){
    dia = new Date(diaActual).getTime() - 2629750000 * x;
    mes = queMes(new Date(dia).getMonth())
    arregloMes.push(mes);
    if(ots){
      arregloData.push(ots.filter(ot => new Date(ot.fecha_apertura).getMonth() === new Date(dia).getMonth() ).length); 
    }else{
      arregloData.push(0);
    }
    
  }
 const grafico=[
    {
      labels: arregloMes,
      datasets: [
        {
          label: 'OTs por Mes',
          backgroundColor: 'rgba(75,192,192,1)',
          borderColor: '#64b5f6',
          borderWidth: 2,
          data: arregloData//[0,0,0,0,3]
        }
      ]
    }
  ];
      console.log("ots", ots)
      res.status(200)
      .send({ message: "lista de OTs", data: ots, grafico: grafico})
    // } else {
    // // let detalle = await Detalles.find({ cliente: req.body.cliente.toLowerCase() });

    // console.log("no son iguales" )
    // }

  } catch (errorGuardando) {
    console.log(errorGuardando);
    res
      .status(500)
      .send({ error: errorGuardando, message: "Error  busqueda de OTs." });
  }
});


router.post("/detalles", isAuth, async (req, res) => {
  console.log("detalles>",  req.user)
  let datosUsuario = await User.findOne({ ut_id: req.user.ut_id });
  var vistaUsuario= datosUsuario.vista
// filtro de autorizaciones
  let filtro  = 
    {
    '$skip': 0
    };

  if(req.user.isHiper){
    // vista total
  }else if(req.user.isSuper){
    filtro = 
      {
      '$match':
            {
              'proyecto': { $in: vistaUsuario},
            }
      };
  
  } else if(req.user.isInge){
    filtro = 
      {
      '$match':
            {
              'proyecto': { $in: vistaUsuario},
              'responsable_ot': datosUsuario.nombre
            }
      };
  
}else if(req.user.isUser){
  filtro = 
    {
    '$match':
          {
            'proyecto': { $in: vistaUsuario},
            'responsable_cliente': req.user.nombre
          }
    };
};
const detalleFiltro =  [
    filtro,
      {
        '$match':
              {
                ot_number: req.body.ot_number
              }
      },
      {
        '$lookup': {
          'from': 'detallesings',
          'localField': 'sitio_codigo',
          'foreignField': 'sitio_codigo',
          'as': 'detallesSitio'
        }
      }]

  try {
    let detalles = await OTs.aggregate(detalleFiltro);
    res.status(200)
      .send({ message: "Datos detallados de la OT y El Sitio", data: detalles })
  } catch (errorGuardando) {
    console.log(errorGuardando);
    res
      .status(500)
      .send({ error: errorGuardando, message: "Error buscando detalle." });
  }
});

router.post("/marcarleido", isAuth, async (req, res) => {
  try {
    let usuario = await User.findOne({ ut_id: req.user.ut_id });

    usuario.terms_cond_acepted = true;

    const marcarLeido = await usuario.save();
    res.status(200)
      .send({ message: "TT leido guardado", data: marcarLeido })
  } catch (errorGuardando) {
    console.log(errorGuardando);
    res
      .status(500)
      .send({ error: errorGuardando, message: "Error Guardando Aceptacion de TC." });
  }
});


// crear usuarion individual
router.post("/register", isAuth, isHiper , async (req, res) => {
  console.log("req.body", req.body);
  // antes de guardar
  // comprobar email Unico y  codigo empleado unico
  const emailUnicoTrim = req.body.datosRegistroUsuario.email.trim().toLowerCase();
  const emailUnico = await User.find({ email: emailUnicoTrim });
  let nombres, password, passphrase, salt, vh, keys;
  console.log(
    "emailUnico",
    emailUnico,

  );
  console.log(
    "emailUnico.length>0",
    emailUnico.length > 0,

  );
  if (emailUnico.length > 0) {
    let mensaje = "";
    if (emailUnico.length > 0) {
      //error numero email repetido o numero empleado
      mensaje = "este email ya existe";
    }

    res.status(200).send({ errorInfo: true, message: mensaje });
  } else {
    // buscar proximo ut_id
  const userMax = await User.aggregate([
    {
      $group: {
        _id: null,
        max: {
          $max: {
            $toInt: "$ut_id",
          },
        },
      },
    },
  ]);
  console.log("userMax", userMax[0]);
let otMaxima = 0;
if(userMax[0]===undefined || userMax[0]===null  ){
  otMaxima=0
}else{
  otMaxima = userMax[0].max
}

    // crear password temporal

    const password = req.body.datosRegistroUsuario.nombre.split(" ")[0] + "1234";
    console.log("otMaxima y password", otMaxima, password);
    passphrase = createPassphrase(20, "hex");
    salt = createPassphrase(20, "hex");
    keys = getKeys(passphrase); //puede tomar un rato.
    vh = createHash(
      "sha256",
      createPassphrase(55, "hex"),
      req.body.datosRegistroUsuario.email.toLowerCase(),
      "hex"
    );
    try {
      const user = new User({
        ut_id: otMaxima + 1,
        isUser: req.body.isUser,
        isSuper: req.body.datosRegistroUsuario.isSuper,
        isHiper: req.body.datosRegistroUsuario.isHiper,
        isInge: req.body.datosRegistroUsuario.isInge,
        nombre:req.body.datosRegistroUsuario.nombre,

        oficina: req.body.datosRegistroUsuario.oficina,
        empresa: req.body.datosRegistroUsuario.cliente,
        vista: req.body.proyVistas,
       
        email: req.body.datosRegistroUsuario.email.toLowerCase(),

        isActive:true,
        password: createHash(
          "sha256",
          process.env.SECRET,
          password + salt,
          "hex"
        ), //password+salt
        // password: password,
        verificationHash: vh,
        salt: salt,
        passphrase: passphrase,
        pubKey: keys.public,
        privKey: keys.private,
        lastRecover: fechaRegional(config.TIMEZONE_OFFSET),
        creationDate: fechaRegional(config.TIMEZONE_OFFSET),
      });

      console.log("user", user);

      const newUser = await user.save();
      res.status(200).send({ message: "Usuario Creado exitosamente." });
    } catch (error) {
      res.status(401).send({ message: "Error creando Usuario." });
    }
  }
});


router.get("/inforegister", isAuth, isHiper, async (req, res) => {
  try {
    let datosUsuario = await User.find();
    
      console.log("datosUsuario", datosUsuario)
      res.status(200)
      .send({ message: "lista de Usuarios", data: datosUsuario})
   

  } catch (errorinfo) {
    console.log(errorinfo);
    res
      .status(500)
      .send({ error: errorinfo, message: "Error  busqueda de Usuarios." });
  }
});



// router.get("/statuscheck", isAuth, async (req, res) => {
//   console.log("req", req);
//   const userId = req.user.ut_id;
//   const fechaUTC = fechaRegional(process.env.TIMEZONE_OFFSET);
//   // const fechaFormato = fechaUnica(fechaUTC);
//   const fechaFormato = fechaRegionalUnica(process.env.TIMEZONE_OFFSET);
//   const fecha = fechaRegional(process.env.TIMEZONE_OFFSET);

//   // chequeo si ya existe un registro
//   const kpi = await KPIs.findOne({
//     uniqueId: userId + fechaFormato,
//   });
//   console.log('kpi get', kpi);
//   if (kpi) {
//       res.status(200).send({ data: kpi });

//   } else {
//     res.status(200).send({ message: "no ha entrado hoy." });
//   }
// });

router.post("/salida", isAuth, async (req, res) => {
  console.log("salida")
  
      try {
        
        res.status(200).send({ error: false , data:req.body});
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "no se puede grabar el registro" });
      }
    
   
});

//test. esto se cambia cuando quieres borrar todo y probar la insercion de los usuarios
// router.post("/create2", async (req, res) => {
//   User.deleteMany(
//     {
//       ut_id: {
//         $nin: ["1", "2", "3", "4", "5", "6", "7", "8", "9",/* "10",
//           "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
//           "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
//           "31", "32", "33", "34", "35", "36", "37", "38", "39", "40",
//           "41", "42", "43", "44", "45", "46", "47", "48", "49", "50",
//       "51", "52", "53", "54", "55"*/]
//       }
//     },
//     (error) => {
//       console.log("error", error);
//       res.send({ error: true, message: "datos borrados." });
//     }
//   );
// });
// //test. esto se cambia cuando quieres cambiarle los passwords a todos los usuarios.
// router.post("/createtemp", async (req, res) => {
//   User.find({}, async (err, usuarios) => {
//     if (!err) {
//       console.log("hay usuarios", usuarios.length);
//       let i = 0,
//         nombres,
//         newPass = "",
//         hash = "",
//         passphrase,
//         salt;
//       while (i < usuarios.length) {
//         nombres = usuarios[i].nombre.split(" ");
//         // console.log("nombres", nombres, "usuarios", usuarios[i].nombre)
//         if (nombres.length >= 3) {
//           //Alejandro Parparcen Grillet = agrillet
//           newPass = (nombres[0].charAt(0) + nombres[2]).toLowerCase();
//         } else {
//           //si si tiene apellido agarrar el primer caracter, si no entonces nada mas sera ell nombre:
//           //eg. Alejandro , password = alejandro
//           //eg2. Alejandro Parparcen , password = aparparcen
//           newPass = (nombres[1]
//             ? nombres[0].charAt(0) + nombres[1]
//             : nombres[0]
//           ).toLowerCase();
//         }
//         if (usuarios[i].salt == "" || usuarios[i].salt == undefined) {
//           passphrase = createPassphrase(30, "hex");
//           salt = createPassphrase(30, "hex");
//         } else {
//           salt = usuarios[i].salt;
//           passphrase = usuarios[i].passphrase;
//         }
//         hash = createHash("sha256", config.SECRET, newPass + salt, "hex");

//         console.log(
//           `ut_id:${usuarios[i].ut_id} nombre:${usuarios[i].nombre} pass:${usuarios[i].password} newPass:${newPass} hash:${hash}`
//         );

//         //este if es solo para que funcione con mi usuario
//         if (usuarios[i].nombre == "Alejandro Prueba") {
//           if (usuarios[i].salt == "" || usuarios[i].salt == undefined) {
//             console.log("no tenia salt ni passph.");
//             usuarios[i].passphrase = passphrase;
//             usuarios[i].salt = salt;
//           }
//           console.log("cambiando password.");
//           usuarios[i].password = hash;

//           console.log("salvando usuario.");
//           //nada mas colocar cuando se va a colocar en produccion o hacer realmente.
//           // await usuarios[i].save();
//         }

//         i++;
//       }
//       //revisar aqui cualquier cambio final.
//       // console.log(usuarios)

//       res.send({ error: false, message: "datos actualizados con exito" });
//     } else {
//       res.send({ error: true, message: "error en el backend." });
//     }
//   });
// });

// //funcion para hacer las fechas rapidas --
// router.post("/createtemp", async (req, res) => {
//   const loskpis = await KPIs.findOne({
//     _id: mongo.ObjectId("5fb17fc39004343878647fce"),
//   });
//   // console.log(loskpis);
//   if (loskpis) {
//     let kpis = [];
//     for (let i = 1; i <= 7; i++) {
//       let newKpi = { ...loskpis._doc };
//       // console.log("new kpi",newKpi, "new kpi")
//       // console.log("fecha 1", newKpi.fecha)
//       newKpi.fecha = new Date(newKpi.fecha - i * 24 * 60 * 60 * 1000);
//       newKpi.uniqueId = newKpi.ut_id + fechaUnica(newKpi.fecha);
//       // console.log("fecha 2", newKpi.fecha)
//       newKpi.hora_entrada.fechaUTC = new Date(
//         newKpi.hora_entrada.fechaUTC - i * 24 * 60 * 60 * 1000
//       );
//       newKpi.hora_salida.fechaUTC = new Date(
//         newKpi.hora_salida.fechaUTC - i * 24 * 60 * 60 * 1000
//       );
//       newKpi.hora_almuerzo_entrada.fechaUTC = new Date(
//         newKpi.hora_almuerzo_entrada.fechaUTC - i * 24 * 60 * 60 * 1000
//       );
//       newKpi.hora_almuerzo_salida.fechaUTC = new Date(
//         newKpi.hora_almuerzo_salida.fechaUTC - i * 24 * 60 * 60 * 1000
//       );

//       delete newKpi._id;
//       kpis.push(newKpi);
//     }
//     // console.log("el pkpi", kpis, "endkpi");
//     KPIs.insertMany(kpis, (error) => {
//       console.log("errors:", error);

//       if (error != null)
//         res.send({ error: false, message: "completado la subida de los kpis" });
//       else res.send({ error: true, message: error });
//     });
//   }
// });

//funcion para actualizarle a todos los usuarios campos que falten, en este caso usare llaves.
// router.post("/create", async (req, res) => {

//   let usuarios = req.body.usuarios;

//   for (let inUser of usuarios) {
//     const users = await User.findOne({ email: inUser.email }); 

//     if (users) {
//       // console.log('users', users)
//       users.codigo_puesto = inUser.codigo_puesto;
//       users.tiempo_comida = inUser.tiempo_comida;
//       users.hora_entrada_sabado = inUser.hora_entrada_sabado;
//       users.minutos_entrada_sabado = inUser.minutos_entrada_sabado;
//       users.hora_salida_sabado = inUser.hora_salida_sabado;
//       users.minutos_salida_sabado = inUser.minutos_salida_sabado;
//       users.dias_laborables = inUser.dias_laborables;

//       await users.save();

//       // console.log("users cambiado", users)
//       // console.log("users first", users[i].email)
//       // if (!users[i].pubKey) {
//       //   let passphrase = users[i].passphrase;
//       //   let keys = getKeys(passphrase);
//       //   users[i].pubKey = keys.public;
//       //   users[i].privKey = keys.private;
//       // }
//       //campos normales a actualizar.
//       // let date = fechaRegional(config.TIMEZONE_OFFSET);
//       // users[i].creationDate = date;//esto es falso pero al menos tiene el campo.
//       // users[i].isActive = true;
//       // users[i].dias_laborables = 5;//solo sirve para esta migracion.
//       // users[i].modificationDate = date;
//       // users[i].lastRecover = date;
//       // users[i].email = users[i].email.toLowerCase();

//     }
//   }
//   if (!usuarios) {
//     res.send({ error: true, message: "Error." })
//   }
//   else {
//     res.send({ error: false, message: "Personas actualizadas con exito." })
//   }

// });

//funcion para actualizarle a todos los usuarios campos que falten, en este caso usare llaves.
// router.post("/create", async (req, res) => {
//   const vacas = await Vacas.deleteMany({ ut_id: { $nin: ["1", "2", "3", "4", "5", "6", "7", "8", "9"] } });
//   const junt = await Juntas.deleteMany({ "grupo.0.ut_id": { $nin: ["1", "2", "3", "4", "5", "6", "7", "8", "9"] } });
//   const evalEmpl = await Eval.deleteMany({ ut_id: { $nin: ["1", "2", "3", "4", "5", "6", "7", "8", "9"] } });
//   const evalLid = await EvalLider.deleteMany({ ut_id: { $nin: ["1", "2", "3", "4", "5", "6", "7", "8", "9"] } });
//   const pend = await Pendientes.deleteMany({ ut_id: { $nin: ["1", "2", "3", "4", "5", "6", "7", "8", "9"] } });
//   const quej = await Quejas.deleteMany({});
//   const kpis = await KPIs.deleteMany({ ut_id: { $nin: ["1", "2", "3", "4", "5", "6", "7", "8", "9"] } });
//   console.log("vacas", vacas.deleteCount);
//   console.log("junt", junt.deleteCount);
//   console.log("evalEmpl", evalEmpl.deleteCount);
//   console.log("evalLid", evalLid.deleteCount);
//   console.log("pend", pend.deleteCount);
//   console.log("quej", quej.deleteCount);
//   console.log("kpis", kpis.deleteCount);
//   //vacaciones, juntas, evaluaciones, pendientes, quejas, kpis
//   if (kpis && vacas && junt && evalEmpl && evalLid && pend && quej) {
//     res.send({ error: false, message: "Personas actualizadas con exito." })
//   }
//   else {
//     res.send({ error: true, message: "Error." })
//   }
// });

// router.post("/test", async (req, res) => {
//   // let vh;
//   const users = await User.find({});
//   if (users) {
//     let i = 0;
//     while (i < users.length) {
//       vh = createHash(
//         "sha256",
//         createPassphrase(55, "hex"),
//         users[i].email.toLowerCase(),
//         "hex"
//       );
//       users[i].verificationHash = vh;
//       // await users[i].save();
//       console.log(users[i].email);
//       i++;
//     }
//   }

// });
//funcion para actualizar a los usuarios debajo de un lider;
// router.post("/create111", async (req, res) => {
//   let [id_lider, nombre_lider, puesto_lider, area_lider, departamento_lider]
//     = [..."1650	Diane Susunaga Ibarra	Jefe De Facturacion 	Administracion Y Finanzas	Facturacion".split("	")];
//   let personas = "91 92 93 97".split(" ");
//   console.log("id", id_lider, "nombre", nombre_lider, "pues", puesto_lider,"ar", area_lider,"dep", departamento_lider)
//   const users = await User.find({ ut_id: { $in: personas } });
//   if (users) {
//     let i = 0;
//     while (i < users.length) {
//       users[i].id_lider = id_lider;
//       users[i].nombre_lider = nombre_lider;
//       users[i].puesto_lider = puesto_lider;
//       users[i].area_lider = area_lider;
//       users[i].departamento_lider = departamento_lider;
//       // await users[i].save();
//       // await users[i].save();
//       console.log(users[i].nombre, users[i].verificationHash, users[i].isActive);
//       i++;
//     }
//     res.send({ error: false, message: "usuarios actualizados" })
//   } 
// });

//FUNCION PARA ENVIAR CORREOS A TODOS LOS USUARIOS:
// router.post("/test", async (req, res) => {
//   const users = await User.find({});

//   if (users) {
//     console.log('users', users.length)
//     let i = 0;
//     let configUsersEmail = [];
//     let timeout = 1200;
//     //esta aqui afuera porque no queremos nuevo transporte a cada rato
//     let emailTransport = crearTransporteEmail();
//     while (i < users.length) {

//       //enviar email   
//       // console.log(users[i].nombre, users[i].email);
//       configUsersEmail.push({
//         to: "alejandroparparcen@yahoo.com",// users[i].email.toLowerCase(),// colocar el email de la persona.
//         bcc: "alejandroparparcen@yahoo.com",
//         subject: "Bienvenido a GENN NAD App",
//         html: createEmailValidation(
//           `${config.HTTPS ? "https://" : "http://"}${config.DOMINIO
//           }/cambiarClave`,
//           `${users[i].verificationHash}`
//         ), //No uso conf.secret para no usarlo mucho y tener variacion.
//         priority: "high",
//         real: users[i].email.toLowerCase()
//       });
//       setTimeout(
//         ((index) => {
//           // console.log("config1", configUsersEmail);
//           return () => {
//             EnvioEmail(configUsersEmail[index], emailTransport);
//             // console.log("email para: ", configUsersEmail[index].to, users[index].nombre, configUsersEmail[index].real)
//           };
//         })(i),
//         timeout
//       );
//       timeout += 1200;
//       break;
//       i++;
//     }
//     res.send({ error: false, message: "Correos enviados." })
//   }
//   else {
//     res.send({ error: true, message: "Error." })
//   }
// });

//funcion real de crear usuarios
router.post("/create", async (req, res) => {
  console.log("req datos crear", req.body.usuarios.length, req.body.usuarios);
  console.log("req usuario", req.user);
  let usuarios = req.body.usuarios;
  if (usuarios == null || usuarios == "")
    req.send({ error: true, message: "No envio ninguna OT para crear." });


  //busca el ultimo numero de OT
  const userMax = await OTs.aggregate([
    {
      $group: {
        _id: null,
        max: {
          $max: {
            $toInt: "$ot_number",
          },
        },
      },
    },
  ]);
  console.log("userMax", userMax[0]);
let otMaxima = 0;
if(userMax[0]===undefined || userMax[0]===null  ){
  otMaxima=0
}else{
  otMaxima = userMax[0].max
}

  //validacion de datos
  const otsNuevas = [];
  let errores = [];

  for (let i = 0; i < usuarios.length; i++) {
    if (
      usuarios[i].pais == "" || //saltarse el usuario que este vacio
      usuarios[i].cliente == "" ||
      usuarios[i].sitio_codigo == "" ||
      usuarios[i].sitio_nombre ==  "" ||
      usuarios[i].proyecto ==  "" ||
      usuarios[i].requerimiento ==  "" ||
      usuarios[i].prioridad ==  "" 

    ) {
      errores.push(
        `${usuarios[i].sitio_codigo} ${usuarios[i].requerimiento}`
      );
      console.log("errores", `${usuarios[i].sitio_codigo} ${usuarios[i].requerimiento}`);
      continue;
    }



    otsNuevas.push(
      new OTs({
        ot_number:  otMaxima + i + 1 ,
        pais: usuarios[i].pais,
        cliente: usuarios[i].cliente,
        sitio_codigo: usuarios[i].sitio_codigo,
        sitio_nombre: usuarios[i].sitio_nombre,
        proyecto: usuarios[i].proyecto,
        responsable_cliente: 'Luis Felipe',
        email_responsable_cliente: 'luis_parparcen@yahoo.com',
        requerimiento: usuarios[i].requerimiento,
        detalle_requerimiento: usuarios[i].detalle_requerimiento,
        prioridad: usuarios[i].prioridad,
        estado: 'ini',
        fecha_requerida: new Date(usuarios[i].fecha_requerida)
      })
    );
  }

  console.log(otsNuevas);
  //  agregar esto luego otra vez
  OTs.insertMany(otsNuevas, (error, docs) => {
    console.log("error", String(error).substring(0, 300));
    console.log("errores finales:", errores);
    // console.log("docs??", docs);

    if (error == null) {
      //mandar emails
      //mandar que todo funciono, y o la informacion que no funciono.
      console.log("personas: errores ", errores);
      res.send({
        error: false,
        message: errores.length != 0 ? errores : "Exito al subir los datos.",
      });


      console.log("despues de user insertmany");
      let timeout = 500; 
      //esta aqui afuera porque no queremos nuevo transporte a cada rato
      let emailTransport = crearTransporteEmail();
      let i = 0;
      // console.log(users.length)
 // enviar email al responsable del recibir OTs
    
        let conf = {
          to: 'luis.parparcen@gmail.com',
          subject: "Solicitud de OT",
          html: "",
          };
      conf.html = otNuevaEmail();

        // if (i <= 600) {
        //enviar email -- por ahora no lo coloco porque despues envia emails a personas que no deberian tener emails
        //conf.para = usuarios[i].email;
        // }
        setTimeout(() => {
          EnvioEmail(conf, emailTransport);
        }, timeout);
        timeout += 500;
        i++;

      

      // //enviar emails
      // let timeout = 1000;
      // //esta aqui afuera porque no queremos nuevo transporte a cada rato
      // let emailTransport = crearTransporteEmail();
      // let i = 0;
      // while (i < docs.length) {
      //   // if (i <= 600) {
      //   //enviar email -- por ahora no lo coloco porque despues envia emails a personas que no deberian tener emails
      //   //conf.para = usuarios[i].email;
      //   // }
      //   setTimeout(
      //     ((index) => {
      //       // console.log("config1", configUsersEmail);
      //       return () => {
      //         // EnvioEmail(configUsersEmail[index], emailTransport);
      //         // console.log(timeout)
      //       };
      //     })(i),
      //     timeout
      //   );
      //   timeout += 1000;
      //   i++;
      // }
    } else {
      if (error.code === 11000) {
        res.status(200).send({
          error: true,
          message: "Datos duplicado: " + String(error).match(/\{.*\}/g),
        });
      } else {
        res.status(200).send({
          error: true,
          message: "Invalid User Data. " + String(error).substring(1, 300),
        });
      }
    }
  });
  
});



router.post("/createSitios", async (req, res) => {
  // console.log("req datos crear", req.body.datosSitios);
  // console.log("req usuario", req.user);
  let sitios = req.body.datosSitios;
  if (sitios == null || sitios == "")
    req.send({ error: true, message: "No envio ningun usuario para crear." });


  //busca el ultimo numero de OT
//   const sitioMax = await DetallesIng.aggregate([
//     {
//       $group: {
//         _id: null,
//         max: {
//           $max: {
//             $toInt: "$sitio_codigo",
//           },
//         },
//       },
//     },
//   ]);
//   console.log("sitioMax", sitioMax[0]);
// let sitioMaxima = 0;
// if(sitioMax[0]===undefined || sitioMax[0]===null  ){
//   sitioMaxima=0
// }else{
//   sitioMaxima = sitioMax[0].max
// }


  //validacion de datos
  let k = 0;
  let sitiosId= [];
  while (k < sitios.length) {
    sitiosId.push(sitios[k].sitio_codigo);
    k++;
  }
  console.log(sitiosId, sitios.length)
  let output = await Detallesings.aggregate([{
    $match: {
      sitio_codigo: { $in: [...sitiosId] }
    }
  },
  {
    $project: {
      _id: 0,
      sitio_codigo: 1,
    }
    // $unwind: {
    //   path:email,
    // }
  }]), sitiosIdNuevos = [];
  k = 0;
  while (k < output.length) {
    sitiosIdNuevos.push(output[k].sitio_codigo);
    k++;
  }

console.log('output', output);

  const sitiosNuevos = [];
  let errores = [];
  for (let i = 0; i < sitiosId.length; i++) {
    console.log('sitiosId[i].sitio_codigo ', sitiosId[i].sitio_codigo )
    if (
      sitios[i].sitio_codigo == "" || //saltarse el usuario que este vacio
      sitios[i].sitio_nombre == "" || //saltarse el usuario que este vacio
      sitios[i].proyecto == "" || //saltarse el usuario que este vacio
      sitios[i].provincia == "" || //saltarse el usuario que este vacio
      sitios[i].pais == "" || //saltarse el usuario que este vacio
      // sitiosId[i].departamento == "" || //saltarse el usuario que este vacio
      sitios[i].altura_validada == "" || //saltarse el usuario que este vacio
      sitios[i].altura_pararrayos == "" || //saltarse el usuario que este vacio
      sitios[i].resistencia_viento == "" || //saltarse el usuario que este vacio
      sitios[i].tipo_estructura == "" || //saltarse el usuario que este vacio
      sitios[i].tx == "" || //saltarse el usuario que este vacio
      sitios[i].latitud_validada_grados == "" || //saltarse el usuario que este vacio
      sitios[i].longitud_validada_grados == ""  //saltarse el usuario que este vacio
      // sitios[i].numero_finca == "" || //saltarse el usuario que este vacio
      // sitios[i].numero_documento_finca == "" || //saltarse el usuario que este vacio
      // sitios[i].direccion_sitio == "" || //saltarse el usuario que este vacio
      // sitios[i].arrendatario == "" || //saltarse el usuario que este vacio
      // sitios[i].area_arrendada == "" || //saltarse el usuario que este vacio
      // sitios[i].area_a_utilizar == "" || //saltarse el usuario que este vacio
      // sitios[i].tipologia_sitio == "" || //saltarse el usuario que este vacio
      // sitios[i].orientacion_torre == "" 

    ) {
      
      errores.push(
        `${sitiosId[i].sitio_codigo} ${sitiosId[i].sitio_nombre}`
      );
      console.log("errores", `${sitiosId[i].sitio_codigo} ${sitiosId[i].sitio_nombre} `);
      continue;
    }

      console.log('else')
    sitiosNuevos.push(
      new Detallesings({
        sitio_codigo: sitios[i].sitio_codigo,
        sitio_nombre: sitios[i].sitio_nombre,
        proyecto: sitios[i].proyecto,
        provincia: sitios[i].provincia,
        departamento: sitios[i].departamento,
        municipio: sitios[i].municipio,
        pais: sitios[i].pais,
        altura_validada: sitios[i].altura_validada,
        altura_pararrayos: sitios[i].altura_pararrayos,
        resistencia_viento:sitios[i].resistencia_viento,
        tipo_estructura: sitios[i].tipo_estructura,
        tx: sitios[i].tx,
        latitud_validada_grados: sitios[i].latitud_validada_grados,
        longitud_validada_grados: sitios[i].longitud_validada_grados,
        numero_finca: sitios[i].numero_finca,
        numero_documento_finca: sitios[i].numero_documento_finca,
        direccion_sitio: sitios[i].direccion_sitio,
        arrendatario: sitios[i].arrendatario,
        area_arrendada: sitios[i].area_arrendada,
        area_a_utilizar: sitios[i].area_a_utilizar,
        tipologia_sitio: sitios[i].tipologia_sitio,
        orientacion_torre: sitios[i].orientacion_torre  

      })
    );
  }
  
  console.log('sitiosNuevos',sitiosNuevos);
  //  agregar esto luego otra vez
  Detallesings.insertMany(sitiosNuevos, (error, docs) => {
    console.log("error", String(error).substring(0, 300));
    console.log("errores finales:", errores);
    // console.log("docs??", docs);

    if (error == null) {
      //mandar emails
      //mandar que todo funciono, y o la informacion que no funciono.
      console.log("sitios: errores ", errores);
      res.send({
        error: false,
        message: errores.length != 0 ? errores : "Exito al subir los datos.",
      });




      console.log("despues de user insertmany");
      let timeout = 500; 
      //esta aqui afuera porque no queremos nuevo transporte a cada rato
      let emailTransport = crearTransporteEmail();
      let i = 0;
      // console.log(users.length)
 // enviar email al responsable del recibir OTs
    
        let conf = {
          to: 'luis.parparcen@gmail.com, luis_parparcen@yahoo.com',
          subject: "Sitios Nuevos subidos al sistema",
          html: "",
          };
      conf.html = otNuevaEmail();

        // if (i <= 600) {
        //enviar email -- por ahora no lo coloco porque despues envia emails a personas que no deberian tener emails
        //conf.para = usuarios[i].email;
        // }
        setTimeout(() => {
          EnvioEmail(conf, emailTransport);
        }, timeout);
        timeout += 500;
        i++;

        // bitacora
        


    } else {
      if (error.code === 11000) {
        res.status(200).send({
          error: true,
          message: "Datos duplicado: " + String(error).match(/\{.*\}/g),
        });
      } else {
        res.status(200).send({
          error: true,
          message: "Datos Invalidos." + String(error).substring(1, 300),
        });
      }
    }
  });
  
});


//test. esto se cambia cuando quieres borrar todo y probar la insercion de los usuarios
router.put("/chpass/:vh", async (req, res) => {

  console.log("cambio de password new user.");

  //-------------------------- HANDLE PASSWORD CHANGE ----------------------------
  const passwordHandle = async () => {
    let vh = req.params.vh;
    console.log("vh", vh);
    if (vh == undefined || vh == "") {
      res.send({ error: true, data: "Datos invalidos" });
    } else {
      const usuario = await User.findOne({ verificationHash: vh });

      if (usuario) {
        //desencryptar datos
        let values = await JSON.parse(decryptPrivate(req.body.values, {
          passphrase: usuario.passphrase,
          key: usuario.privKey
        }));
        console.log("usuario encontrado " + usuario.nombre);
        let password = values.password;
        let password2 = values.password2;

        // Validaciones de password
        //TO-DO
        if (password && password2 && password === password2) {
          console.log(
            "secret",
            config.SECRET,
            "pass",
            values.password,
            "salt",
            usuario.salt
          );

          usuario.password = createHash(
            "sha256",
            config.SECRET,
            password + usuario.salt,
            "hex"
          );
          usuario.verificationHash = "";
          await usuario.save();
          let userInfo = {
            _id: usuario._id,
            ut_id: usuario.ut_id,

            oficina: usuario.oficina,
            nombre: usuario.nombre,
            empresa: usuario.empresa,
            email: usuario.email,
            token: getToken(usuario),

            departamento: usuario.departamento,

            vista: usuario.vista,
            isSuper: usuario.isSuper,
            ishiper: usuario.isHiper,
            isUser: usuario.isUser,
            isInge: usuario.isInge,
           
          };
          console.log("cambio de clave exitoso.");
          res.send({
            error: false,
            data: "Cambio la clave con exito.",
            userInfo: { ...userInfo },
          });
        } else {
          console.log("Hacker?");
          res.send({
            error: true,
            data: "Los passwords no son iguales. Por favor verificar.",
          });
        }
      } else {
        console.log("hash no valido o expirado");
        res.send({ error: true, data: "No hay usuario" });
      }
    }
  }
  //----------------------------END HANDLE PASSWORD CHANGE -----------------------------
  //------------------------CAPTCHA HANDLE ------------------------------  
  let postData = querystring.stringify({
    secret: config.CAPTCHA_KEY,
    response: req.body.token,
  });
  // console.log("postData");
  // console.log(postData);
  let options = {
    hostname: "www.google.com",
    port: 443,
    path: "/recaptcha/api/siteverify",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": postData.length,
    },
  };
  const reqs = https
    .request(options, (resp) => {
      console.log("statusCode:", resp.statusCode);
      //console.log("headers:", resp.headers);
      //console.log("data send stuff");
      let data = "";
      resp.on("data", (chunk) => {
        // console.log("chunk");
        // console.log(chunk.toString("utf8"));
        data += chunk.toString("utf8");
      });

      resp.on("end", async () => {
        data = JSON.parse(data);
        console.log("Body: ", data);
        if (data) {
          if (data.success) {
            if (data.score > 0.25) {
              console.log("true");
              // res.status(200).send({ captcha: true });
              await passwordHandle();
            } else {
              console.log("false");
              // res.status(500).send({ captcha: false }); 
              res.send({ error: true, message: "Entradas posiblemente maliciosas." });

            }
          } else {
            console.log("false - no data");
            // res.status(500).send({ captcha: false }); 
            res.send({ error: true, message: "Error de Captcha. Por favor crear un ticket de soporte." });

          }
        }
      });
    })
    .on("error", (err) => {
      console.error(err);
    });
  reqs.write(postData);
  reqs.end();
  //-----------------------END CAPTCHA HANDLE---------------------------
});

router.put("/chpass", isAuth, async (req, res) => {
  console.log("cambio de password de persona existente.");
  const usuario = await User.findOne({ ut_id: req.user.ut_id });

  if (usuario) {
    //desencryptar datos
    let values = await JSON.parse(decryptPrivate(req.body.values, {
      passphrase: usuario.passphrase,
      key: usuario.privKey
    }));
    let password = values.password;
    let password2 = values.password2;

    // Validaciones de password (con regex) 8 caracteres, y signos especiales.
    //TO-DO
    if (password === password2) {
      usuario.password = createHash(
        "sha256",
        config.SECRET,
        password + usuario.salt,
        "hex"
      );
      await usuario.save();
      let userInfo = {
        _id: usuario._id,
        ut_id: usuario.ut_id,
        oficina: usuario.oficina,
        nombre: usuario.nombre,
        email: usuario.email,
        token: getToken(usuario),
        vista: usuario.vista,
        isSuper: usuario.isSuper,
        isHiper: usuario.isHiper,
        isSuper: usuario.isSuper,
        isInge: usuario.isInge,
      };

      res.send({
        error: false,
        data: "Cambio la clave con exito.",
        userInfo: { ...userInfo },
      });
    } else {
      res.send({
        error: true,
        data: "Los passwords no son iguales. Por favor verificar.",
      });
    }
  } else {
    res.send({ error: true, data: "No hay usuario" });
  }
});

router.put("/recoverEmail", async (req, res) => {

  //--------------------HANDLE RECOVERY -------------------------------
  const recoveryHandle = async () => {
    let email = req.body.email.toLowerCase();
    //es necesario encryptar el correo? no lo creo.
    //traer llave de sistema
    //TO-DO
    //desencryptar datos
    //TO-DO 
    let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
    if (!email || email == "")
      res.send({
        error: true,
        message: "No envio datos.",
        title: "Error de correo",
        type: "error",
      });
    if (!email.match(regex))
      res.send({
        error: true,
        message: "Email invalido.",
        title: "Error de correo",
        type: "error",
      });
    else {
      const usuario = await User.findOne({ email: new RegExp(email, 'i') });

      console.log("email ", email);
      if (usuario) {
        let timeNow = new Date();

        console.log("time2", (timeNow - usuario.lastRecover) / (60 * 1000));
        let tiempoEspera = 2;
        if (
          //no puede pedir por 2 minutos.
          (timeNow - usuario.lastRecover) / (60 * 1000) <=
          tiempoEspera
        ) {
          console.log("no puede pedir mas correos", usuario.lastRecover);
          console.log("no puede pedir mas correos", timeNow);
          let date = new Date(
            tiempoEspera * 60 * 1000 - (timeNow - usuario.lastRecover)
          );
          console.log("no puede pedir mas correos", date);
          let sec = date.getUTCSeconds(),
            min = date.getUTCMinutes(),
            hour = date.getUTCHours();
          console.log(
            `No puede pedir mas correos por ${hour && hour != 0 ? `${hour}h` : ""
            } ${min && min != 0 ? `${min}m` : ""} ${sec && sec != 0 ? `${sec}s` : ""
            }`
          );
          res.status(200).send({
            error: true,
            time: usuario.lastRecover,
            message: `No puede pedir mas correos. Espere ${hour && hour != 0 ? `${hour}h` : ""
              } ${min && min != 0 ? `${min}m` : ""} ${sec && sec != 0 ? `${sec}s` : ""
              }`,
            title: "Aviso de Limitacion",
            type: "warning",
          });
        } else {
          // console.log("time3", (timeNow - usuario.lastRecover) / 60 / 1000);
          // if ((timeNow - usuario.lastRecover) / 60 / 1000 >= 24) {
          //   console.log("Vuelva a pedir correo, codigo lleva mucho tiempo activo.", usuario.lastRecover);
          //   res.send({ error: true, message: "Vuelva a pedir correo, codigo lleva mucho tiempo activo." });
          // }
          console.log("parte correo");
          let randomString = createPassphrase(32);
          let hash = createHash(
            "sha256",
            process.env.SECRET,
            randomString,
            "hex"
          );

          let conf = {
            to: usuario.email,
            bcc: "",
            subject: "Recuperacion de Clave - HomeOfficeApp",
            html: createRecoveryEmailPage(
              `${config.HTTPS == true ? "https://" : "http://"}${config.DOMINIO
              }/cambiarClave`,
              hash
            ),
            priority: "high",
          };

          usuario.lastRecover = timeNow;
          usuario.verificationHash = hash;
          await usuario.save();

          //no es necesario el email transfer. porque solo es 1 mail.
          EnvioEmail(conf);
          console.log(
            `Recuperacion de email enviada a : {"${usuario.nombre}", "${usuario.email}"}`
          );
          res.status(200).send({
            error: false,
            message: "Correo enviado",
            title: "Éxito",
            type: "success",
          });
        }
      } else {
        res.send({
          error: true,
          message: "Correo enviado...",
          title: "Usuario",
          type: "success",
        });
      }
    }
  };
  //------------------------ END RECOVERY HANDLE ------------------------
  //------------------------CAPTCHA HANDLE ------------------------------  
  let postData = querystring.stringify({
    secret: config.CAPTCHA_KEY,
    response: req.body.token,
  });
  // console.log("postData");
  // console.log(postData);
  let options = {
    hostname: "www.google.com",
    port: 443,
    path: "/recaptcha/api/siteverify",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": postData.length,
    },
  };
  const reqs = https
    .request(options, (resp) => {
      console.log("statusCode:", resp.statusCode);
      //console.log("headers:", resp.headers);
      //console.log("data send stuff");
      let data = "";
      resp.on("data", (chunk) => {
        // console.log("chunk");
        // console.log(chunk.toString("utf8"));
        data += chunk.toString("utf8");
      });

      resp.on("end", async () => {
        data = JSON.parse(data);
        console.log("Body: ", data);
        if (data) {
          if (data.success) {
            if (data.score > 0.25) {
              console.log("true");
              // res.status(200).send({ captcha: true });
              await recoveryHandle();
            } else {
              console.log("false");
              // res.status(500).send({ captcha: false }); 
              res.send({ error: true, message: "Entradas posiblemente maliciosas." });

            }
          } else {
            console.log("false - no data");
            // res.status(500).send({ captcha: false }); 
            res.send({ error: true, message: "Error de Captcha. Por favor crear un ticket de soporte." });

          }
        }
      });
    })
    .on("error", (err) => {
      console.error(err);
    });
  reqs.write(postData);
  reqs.end();
  //-----------------------END CAPTCHA HANDLE---------------------------

});


export default router;
