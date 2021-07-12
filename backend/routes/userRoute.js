import express from "express";
import querystring from "querystring";
import https from "https";
import User from "../models/employee_model.js";
import Detallesings from "../models/detalles_model.js";
import KPIs from "../models/kpi_model.js";
import OTs from "../models/ots_model.js";
import Bitacoras from "../models/bitacora_model.js";
import { createRecoveryEmailPage } from "../pages/recoveryEmailPage";
import { createEmailValidation } from "../pages/validationPage";
import { otNuevaEmail} from "../pages/otNuevaEnvioEmail";
import { 
  getWeekNumber,
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
  isRH,
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
            apellido: signinUser.apellido,
            empresa: signinUser.empresa,
            oficina: signinUser.oficina,
            email: signinUser.email,
            token: getToken(signinUser),
            terms_cond_acepted: signinUser.terms_cond_acepted ? signinUser.terms_cond_acepted : false,

            grupo: signinUser.grupo, 
            vista: signinUser.vista,
            isSuper: signinUser.isSuper,
            isHiper: signinUser.isHiper

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


router.post("/createotnueva", isAuth, async (req, res) => {
  try {

      console.log("req usuario", req.user);
      let otInfo = req.body;
      console.log("req datos crear", otInfo);
      
      
      if (otInfo == null || otInfo == "")
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
            fecha_requerida: otInfo.fecha_requerida
          })
       
    
      console.log(otNueva);
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


router.post("/actualizarot", isAuth, async (req, res) => {
  // try {

      console.log("req usuario", req.user);
      let otInfo = req.body;
      console.log("req datos actualizar", otInfo);
      try{
        let otactualizada = await OTs.findOne({ot_number: req.body.ot_number})
        let sitioactualizado = await Detallesings.find({sitio_codigo: req.body.sitio_codigo})
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
          if(sitioactualizado.altura_pararrayosChange) sitioactualizado.altura_pararrayos =  otInfo.altura_pararrayos;
          if(sitioactualizado.altura_validadaChange) sitioactualizado.altura_validada =  otInfo.altura_validada;
          if(sitioactualizado.area_a_utilizarChange) sitioactualizado.area_a_utilizar =  otInfo.area_a_utilizar;
          if(sitioactualizado.area_arrendadaChange) sitioactualizado.area_arrendada =  otInfo.area_arrendada;
          if(sitioactualizado.arrendatarioChange) sitioactualizado.arrendatario =  otInfo.arrendatario;
          if(sitioactualizado.identificacion_arrendatarioChange) sitioactualizado.identificacion_arrendatario =  otInfo.identificacion_arrendatario;  
          if(sitioactualizado.departamentoChange) sitioactualizado.departamento =  otInfo.departamento;
          if(sitioactualizado.provinciaChange) sitioactualizado.provincia =  otInfo.provincia;
          if(sitioactualizado.direccion_sitioChange) sitioactualizado.direccion_sitio =  otInfo.direccion_sitio;
          if(sitioactualizado.latitud_validada_gradosChange) sitioactualizado.latitud_validada_grados =  otInfo.latitud_validada_grados;
          if(sitioactualizado.longitud_validada_gradosChange) sitioactualizado.longitud_validada_grados =  otInfo.longitud_validada_grados;
          if(sitioactualizado.numero_fincaChange) sitioactualizado.numero_finca =  otInfo.numero_finca;
          if(sitioactualizado.orientacion_torreChange) sitioactualizado.orientacion_torre =  otInfo.orientacion_torre;
          if(sitioactualizado.resistencia_vientoChange) sitioactualizado.resistencia_viento =  otInfo.resistencia_viento;
          if(sitioactualizado.tipo_estructuraChange) sitioactualizado.tipo_estructura =  otInfo.tipo_estructura;
          if(sitioactualizado.tipologia_sitioChange) sitioactualizado.tipologia_sitio =  otInfo.tipologia_sitio;
          if(sitioactualizado.txChange) sitioactualizado.tx =  otInfo.tx;
          if(sitioactualizado.derecho_paso_sitioChange) sitioactualizado.derecho_paso_sitio =  otInfo.derecho_paso_sitio;
          if(sitioactualizado.electricidad_sitioChange) sitioactualizado.electricidad_sitio =  otInfo.electricidad_sitio;

          const otAct = await otactualizada.save();
          const sitioAct = await sitioactualizado.save();
      
  
       res.send({
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

    // if([vistaUsuario].includes(vistaSolicitada)){
      // console.log(vistaUsuario,"incluye la vista solicitada",vistaSolicitada )
      const filtro = {

        proyecto: 'tigo_PA'
      }
      const ots = await OTs.find(); //{ cliente: req.body.cliente.toLowerCase() }
      // console.log("bitacora", bitacora)
      res.status(200)
      .send({ message: "lista de OTs", data: ots})
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
  console.log( req.body.cliente,  req.body.codigo, req.body)

const detalleFiltro =  [
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
router.post("/register", isAuth, isRH, async (req, res) => {
  console.log("req.body", req.body);
  // antes de guardar
  // comprobar email Unico y  codigo empleado unico
  const emailUnicoTrim = req.body.email.trim().toLowerCase();
  const codigoEmpleadoUnicoTrim = req.body.id_empleado.trim();
  const emailUnico = await User.find({ email: emailUnicoTrim });
  const codigoEmpleadoUnico = await User.find({
    id_empleado: codigoEmpleadoUnicoTrim,
  });
  console.log(
    "emailUnico",
    emailUnico,
    "codigoEmpleadoUnico",
    codigoEmpleadoUnico
  );
  console.log(
    "emailUnico.length>0",
    emailUnico.length > 0,
    "codigoEmpleadoUnico.length>0",
    codigoEmpleadoUnico.length > 0
  );
  if (emailUnico.length > 0 || codigoEmpleadoUnico.length > 0) {
    let mensaje = "";
    if (emailUnico.length > 0) {
      //error numero email repetido o numero empleado
      mensaje = "este email ya existe";
    }
    if (codigoEmpleadoUnico.length > 0) {
      //error numero email repetido o numero empleado
      if (mensaje !== "") {
        mensaje += " y ";
      } else {
        mensaje += ".";
      }
      mensaje += "este código de empleado ya existe.";
    }
    res.status(200).send({ errorInfo: true, message: mensaje });
  } else {
    // buscar proximo ut_id
    const userCount = await User.aggregate([
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
        },
      },
    ]);
    // crear password temporal

    const password = req.body.nombre.split(" ")[0] + "1234";
    console.log("userCount y password", userCount, password);
    try {
      const user = new User({
        ut_id: userCount[0].count + 1,
        razon_social: req.body.razon_social,
        grupo: req.body.grupo,
        vista: req.body.vista,
        isSuper: req.body.isSuper,
        isRH: req.body.isRH,
        id_empleado: req.body.id_empleado,
        nombre: req.body.nombre,
        email: req.body.email.toLowerCase(),
        password: createHash(
          "sha256",
          process.env.SECRET,
          password + salt,
          "hex"
        ), //password+salt
        // password: password,
        oficina: req.body.oficina,
        puesto: req.body.puesto,
        area: req.body.area,
        departamento: req.body.departamento,
        id_lider: req.body.id_lider,
        nombre_lider: req.body.nombre_lider,
        puesto_lider: req.body.puesto_lider,
        area_lider: req.body.area_lider,
        departamento_lider: req.body.departamento_lider,
      });

      console.log("user", user);

      const newUser = await user.save();
      res.status(200).send({ message: "Usuario Creado exitosamente." });
    } catch (error) {
      res.status(501).send({ message: "Error creando Usuario." });
    }
  }
});

router.get("/infoactualizar", isAuth, isRH, async (req, res) => {

  try {
    const usuarios = await User.find().distinct("nombre");
    const lideres = await User.find({ isSuper: true }, { nombre: 1, id_empleado: 1, ut_id: 1, vista: 1 });
    const areas = await User.find().distinct("area");
    const departamentos = await User.find().distinct("departamento");
    const rs = await User.find().distinct("razon_social");


    var uniquePuestos = [
      {
        '$group': {
          '_id': null, 
          'values': {
            '$addToSet': {
              'id':'$_id',
              'codigo_puesto': '$codigo_puesto', 
              'puesto': '$puesto',
              'oficina': '$oficina',
              'departamento': '$departamento',
              'area': '$area'
            }
          }
        }
      }
    ]

    // console.log('puestos ', puestos)
    const grupos = await User.find().distinct("grupo");

    const InfoAut = {
      usuarios: usuarios,
      areas: areas,
      departamentos: departamentos,
      grupos: grupos,
      lideres: lideres,
      rs: rs,
    };
    // console.log('InfoAut ', InfoAut)
    res.status(200).send(InfoAut);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/buscarnombre", isAuth, isRH, async (req, res) => {
  console.log("req", req.query);
  try {
    const usuario = await User.findOne({ nombre: req.query.nombre }, {
      razon_social: 1,
      ut_id: 1,
      id_empleado: 1,
      nombre: 1,
      email: 1,
      oficina: 1,
      codigo_puesto: 1,
      puesto: 1,
      area: 1,
      departamento: 1,
      grupo: 1,
      vista: 1,
      id_lider: 1,
      nombre_lider: 1,
      isSuper: 1,
      isRH: 1,
      isActive: 1,
      dias_laborables: 1,
      tiempo_comida:1,
      hora_entrada: 1,
      minutos_entrada: 1,
      hora_salida: 1,
      minutos_salida: 1,
      hora_entrada_sabado: 1,
      minutos_entrada_sabado: 1,
      hora_salida_sabado: 1,
      minutos_salida_sabado: 1,

    });

    const grup = [
      {
        $group: {
          _id: "$grupo",
          integrantes: { $push: "$nombre" },
        },
        //   $project: {
        //     razon_social: 1,
        //     ut_id: 1,
        //     id_empleado: 1,
        //     nombre: 1,
        //     email: 1,
        //     oficina: 1,
        //     puesto: 1,
        //     area: 1,
        //     departamento: 1,
        //     grupo: 1,
        //     vista: 1,
        //     id_lider:1,
        //     nombre_lider: 1
        //   }
      },
    ];

    const miembros = await User.aggregate(grup);
    const lideres = await User.find({ isSuper: true }, { nombre: 1, id_empleado: 1, ut_id: 1, vista: 1 });
    const InfoAut = {
      usuario: usuario,
      miembros: miembros,
      lideres: lideres
    };
    // console.log('InfoAut ', InfoAut)
    res.status(200).send(InfoAut);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.get("/buscarKPIUsuario", isAuth, isRH, async (req, res) => {
  console.log("req", req.query);
  const d = fechaRegional(process.env.TIMEZONE_OFFSET);
  const userId = req.query.ut_id;
  const fechaFormato = fechaRegionalUnicaInput( req.query.fecha, process.env.TIMEZONE_OFFSET);
  let registroDia = await KPIs.findOne({
    uniqueId: userId + fechaFormato,
  });
  console.log("req", req.query);
  if(registroDia){
    res.status(200).send({ data: registroDia });
  } else{
    res.status(500).send({ message: "KPI no existe." });
  }
    
});

router.post("/actualizarKPI", isAuth, isRH, async (req, res) => {
  const d = fechaRegional(process.env.TIMEZONE_OFFSET);
  console.log("inforkpi", req.body);
  const userId = req.body.ut_id;
  const fechaFormato = fechaRegionalUnicaInput( req.body.fecha, process.env.TIMEZONE_OFFSET);
  try {
      let registroDia = await KPIs.findOne({
        uniqueId: userId + fechaFormato,
      });
      console.log("inforkregistroDiapi", registroDia);
      const offset = new Date(req.body.comidaOut).getTimezoneOffset()/60*-1 ;
    if(req.body.entradaChange){
      registroDia.hora_entrada.fechaUTC= fechaRegionalInput(req.body.entrada, offset);
      registroDia.hora_entrada.hora_decimal = new Date(req.body.entrada).getHours() + new Date(req.body.entrada).getMinutes()/60
      registroDia.hora_entrada.hora = new Date(req.body.entrada).getHours();
      registroDia.hora_entrada.minutos = new Date(req.body.entrada).getMinutes()
    }
    if(req.body.comidaInChange){
      registroDia.hora_almuerzo_entrada.fechaUTC= fechaRegionalInput(req.body.comidaIn, offset);
      registroDia.hora_almuerzo_entrada.hora_decimal = new Date(req.body.comidaIn).getHours() + new Date(req.body.comidaIn).getMinutes()/60
      registroDia.hora_almuerzo_entrada.hora = new Date(req.body.comidaIn).getHours();
      registroDia.hora_almuerzo_entrada.minutos = new Date(req.body.comidaIn).getMinutes()
    }
    if(req.body.comidaOutChange){
      console.log("salida Alm",req.body.comidaOut , fechaRegionalInput(req.body.comidaOut, offset), new Date(req.body.comidaOut).getTimezoneOffset()  )
      registroDia.hora_almuerzo_salida.fechaUTC= fechaRegionalInput(req.body.comidaOut, offset);
      registroDia.hora_almuerzo_salida.hora_decimal = new Date(req.body.comidaOut).getHours() + new Date(req.body.comidaOut).getMinutes()/60
      registroDia.hora_almuerzo_salida.hora = new Date(req.body.comidaOut).getHours();
      registroDia.hora_almuerzo_salida.minutos = new Date(req.body.comidaOut).getMinutes()
    }
    console.log("registroDia Modificado", registroDia);

    //falta grabar 
    const kpiUpdated = await registroDia.save()
    res.status(200).send({
      error: false, message: "Exito crear actualizando el kpi."
    });
  } catch(error){
    res.status(200).send({ error: true, message: "Datos invalidos" });
  }

});

router.post("/guardarActualizacion", isAuth, isRH, async (req, res) => {
  const lider = await User.findOne({nombre:req.body.nombre_lider})
  const usuario = await User.findOne({ ut_id: req.body.ut_id })
  console.log("req.body", req.body)
  usuario.nombre = req.body.nombre;
  // usuario.id_empleado= req.body.nombre;
  usuario.puesto = req.body.puesto;
  usuario.codigo_puesto = req.body.codigo_puesto;
  usuario.email = req.body.email;
  usuario.razon_social = req.body.razon_social;
  usuario.oficina = req.body.oficina;
  usuario.area = req.body.area;
  usuario.departamento = req.body.departamento;
  usuario.nombre_lider = req.body.nombre_lider;
  // datos del lider 
  usuario.id_lider = lider.id_empleado; 
  usuario.puesto_lider= lider.puesto;
  usuario.area_lider= lider.area;
  usuario.departamento_lider = lider.departamento
  usuario.grupo = lider.vista;
  // sus datos como lider
  usuario.vista = req.body.vista;
  usuario.isSuper = Boolean(req.body.isSuper);
  usuario.isRH = Boolean(req.body.isRH);
  usuario.isActive = Boolean(req.body.isActive);
  usuario.hora_entrada = Number(req.body.horaEntrada);
  usuario.minutos_entrada = Number(req.body.minEntrada);
  usuario.hora_salida = Number(req.body.horaSalida);
  usuario.minutos_salida = Number(req.body.minSalida);
  usuario.hora_entrada_sabado = Number(req.body.horaEntradaSabado);
  usuario.minutos_entrada_sabado = Number(req.body.minEntradaSabado);
  usuario.hora_salida_sabado = Number(req.body.horaSalidaSabado);
  usuario.minutos_salida_sabado = Number(req.body.minSalidaSabado);
  usuario.dias_laborables = Number(req.body.dias_laborables);
  usuario.tiempo_comida = Number(req.body.tiempo_comida);

  try {
    const actualizUsuarioGuardada = await usuario.save();
    res.status(200).send({ data: actualizUsuarioGuardada });
  } catch {
    res.status(400).send({ message: "Error actualizando Usuario." });
  }

});

router.post("/almuerzo", isAuth, async (req, res) => {
  console.log("almuerzo post")
  const userId = req.user.ut_id;
  const fechaUTC = fechaRegional(process.env.TIMEZONE_OFFSET);
  // const fechaFormato = fechaUnica(fechaUTC);
  const fechaFormato = fechaRegionalUnica(process.env.TIMEZONE_OFFSET);
  const fecha = fechaRegional(process.env.TIMEZONE_OFFSET);

  // chequeo si ya existe un registro
  const kpi = await KPIs.findOne({
    uniqueId: userId + fechaFormato,
  });
  // console.log('kpi', kpi);
  
  if (kpi) {
    if(req.body.almuerzo_cambio == false){  // solo se necesita Chequeo del KPI
      res.status(200).send({ data: kpi });
    } else if(req.body.almuerzo_cambio == true ){ // hay cambio de almuerzo

    if (kpi.status_almuerzo + 1 < 3 ) {//&& kpi.status_almuerzo !== req.body.almuerzo) {
      if (kpi.status_almuerzo + 1 === 2) {
        console.log("salida alm")
        kpi.hora_almuerzo_salida = {
          fechaUTC: fechaUTC,
          hora_decimal: Number(
            fechaUTC.getUTCHours() + fechaUTC.getUTCMinutes() / 60.0
          ),
          hora: fechaUTC.getUTCHours(),
          minutos: fechaUTC.getUTCMinutes(),

        };
      } else if (kpi.status_almuerzo + 1 === 1) {
        console.log("entrada alm")

        kpi.hora_almuerzo_entrada = {
          fechaUTC: fechaUTC,
          hora_decimal: Number(
            fechaUTC.getUTCHours() + fechaUTC.getUTCMinutes() / 60.0
          ),
          hora: fechaUTC.getUTCHours(),
          minutos: fechaUTC.getUTCMinutes(),

        };
      }
    }
      try {
        kpi.status_almuerzo++;
        const almuerzoMarcada = await kpi.save();
        // console.log('almuerzoMarcada}', almuerzoMarcada);
        if (almuerzoMarcada) {
          res.status(200).send({ data: almuerzoMarcada }); // se envian los cambios de almuerzo al backend
        } 
        } catch {
        res.status(400).send({ message: "Error marcando almuerzo." });
        }
    }
  
} else {
  res.status(400).send({ message: "Error no ha marcado hoy." });
}
});

router.post("/permiso", isAuth, async (req, res) => {
  const userId = req.user.ut_id;
  const fechaUTC = fechaRegional(process.env.TIMEZONE_OFFSET);
  // const fechaFormato = fechaUnica(fechaUTC);
  const fechaFormato = fechaRegionalUnica(process.env.TIMEZONE_OFFSET);
  const fecha = fechaRegional(process.env.TIMEZONE_OFFSET);

  // chequeo si ya existe un registro
  const kpi = await KPIs.findOne({
    uniqueId: userId + fechaFormato,
  });
  console.log('req body', req.body);

  if (kpi) {
    if(req.body.permiso_cambio == false){  // solo se necesita Chequeo del KPI
      res.status(200).send({ data: kpi });
    } else if(req.body.permiso_cambio == true ){ // hay cambio de permiso
    if (kpi.status_permiso + 1 < 3 ) {
      if (kpi.status_permiso + 1 === 2) {
 
        kpi.hora_permiso_salida = {
          fechaUTC: fechaUTC,
          hora_decimal: Number(
            fechaUTC.getUTCHours() + fechaUTC.getUTCMinutes() / 60.0
          ),
          hora: fechaUTC.getUTCHours(),
          minutos: fechaUTC.getUTCMinutes(),

        };
      } else if (kpi.status_permiso + 1 === 1) {

        kpi.hora_permiso_entrada = {
          fechaUTC: fechaUTC,
          hora_decimal: Number(
            fechaUTC.getUTCHours() + fechaUTC.getUTCMinutes() / 60.0
          ),
          hora: fechaUTC.getUTCHours(),
          minutos: fechaUTC.getUTCMinutes(),
         
         
        };
      }
    }
    try {
      kpi.status_permiso++;
      const permisoMarcada = await kpi.save();
      // console.log('kpiD', kpi)
      if(permisoMarcada){
      res.status(200).send({ data: permisoMarcada });
    } 
    }catch {
      res.status(400).send({ message: "Error marcando permiso." });
    }
  }
 } else {
    res.status(400).send({ message: "no ha entrado hoy." });
  }
});


router.get("/statuscheck", isAuth, async (req, res) => {
  console.log("req", req);
  const userId = req.user.ut_id;
  const fechaUTC = fechaRegional(process.env.TIMEZONE_OFFSET);
  // const fechaFormato = fechaUnica(fechaUTC);
  const fechaFormato = fechaRegionalUnica(process.env.TIMEZONE_OFFSET);
  const fecha = fechaRegional(process.env.TIMEZONE_OFFSET);

  // chequeo si ya existe un registro
  const kpi = await KPIs.findOne({
    uniqueId: userId + fechaFormato,
  });
  console.log('kpi get', kpi);
  if (kpi) {
      res.status(200).send({ data: kpi });

  } else {
    res.status(200).send({ message: "no ha entrado hoy." });
  }
});

router.post("/salida", isAuth, async (req, res) => {
  console.log("salida")
  const fechaUTC = fechaRegional(process.env.TIMEZONE_OFFSET);
  // const fechaFormato = fechaUnica(fechaUTC);
  const fechaFormato = fechaRegionalUnica(process.env.TIMEZONE_OFFSET);
  // const fecha = fechaRegional(process.env.TIMEZONE_OFFSET);
  const userId = req.user.ut_id;
  // console.log('fecha SALIENDO', fecha);
  const kpi = await KPIs.findOne({
    uniqueId: userId + fechaFormato,
  });
  // console.log('kpi fecha', kpi, kpi.marco_salida, 'req.body', req.body );
  if (kpi) {
    if (!kpi.marco_salida) {
      try {
        console.log("No marcado salida. Saliendo...", req.body.info.salidaAutorizada.salidaAutorizada)
        kpi.hora_salida.fechaUTC = fechaUTC;
        kpi.hora_salida.hora_decimal = Number(
          fechaUTC.getUTCHours() + fechaUTC.getUTCMinutes() / 60.0
        );
        kpi.hora_salida.hora = fechaUTC.getUTCHours();
        kpi.hora_salida.minutos = fechaUTC.getUTCMinutes();
        console.log(`horas de salida son : ${kpi.hora_salida.fechaUTC.toISOString()} ${kpi.hora_salida.hora_decimal} ${kpi.hora_salida.hora} ${kpi.hora_salida.minutos}`)
        // kpi.hora_salida.latitude=req.info.crd?  req.info.crd.latitude : null;
        // kpi.hora_salida.longitude= req.info.crd? req.info.crd.longitude : null;

        kpi.marco_salida = true;
        kpi.salida_autorizada = (req.body.info.salidaAutorizada.salidaAutorizada=="true" || req.body.info.salidaAutorizada.salidaAutorizada== true) ? true: false;
        kpi.animoPM = Number(req.body.info.feelingPM);

        const salidaMarcada = await kpi.save();
        console.log('kpiD', kpi)
        res.status(200).send({ error: false, data: salidaMarcada });
      } catch (error) {
        res
          .status(500)
          .send({ error: true, message: "no se puede grabar el registro" });
      }
    }
    else {
      console.log("ya marco el kpi")
      return res
        .status(200)
        .send({ error: false, message: "Ya marco salida." });
    }
  } else {
    console.log("kpi no existe")
    // console.log('status(200) No hay registro de KPI con ese ID')
    return res
      .status(200)
      .send({ error: true, message: "No hay registro de KPI con ese ID." });
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
      sitios[i].longitud_validada_grados == "" || //saltarse el usuario que este vacio
      sitios[i].numero_finca == "" || //saltarse el usuario que este vacio
      sitios[i].numero_documento_finca == "" || //saltarse el usuario que este vacio
      sitios[i].direccion_sitio == "" || //saltarse el usuario que este vacio
      sitios[i].arrendatario == "" || //saltarse el usuario que este vacio
      sitios[i].area_arrendada == "" || //saltarse el usuario que este vacio
      sitios[i].area_a_utilizar == "" || //saltarse el usuario que este vacio
      sitios[i].tipologia_sitio == "" || //saltarse el usuario que este vacio
      sitios[i].orientacion_torre == "" 

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
            id_empleado: usuario.id_empleado,
            razon_social: usuario.razon_social,
            oficina: usuario.oficina,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            token: getToken(usuario),

            puesto: usuario.puesto,
            area: usuario.area,
            departamento: usuario.departamento,
            grupo: usuario.grupo,
            vista: usuario.vista,
            isSuper: usuario.isSuper,
            isRH: usuario.isRH,

            id_lider: usuario.ut_id,
            email_lider: usuario.email_lider,
            nombre_lider: usuario.nombre_lider,
            puesto_lider: usuario.puesto_lider,
            area_lider: usuario.area_lider,
            departamento_lider: usuario.departamento_lider,
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
        id_empleado: usuario.id_empleado,
        razon_social: usuario.razon_social,
        oficina: usuario.oficina,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        token: getToken(usuario),

        puesto: usuario.puesto,
        area: usuario.area,
        departamento: usuario.departamento,
        grupo: usuario.grupo,
        vista: usuario.vista,
        isSuper: usuario.isSuper,
        isRH: usuario.isRH,

        id_lider: usuario.ut_id,
        email_lider: usuario.email_lider,
        nombre_lider: usuario.nombre_lider,
        puesto_lider: usuario.puesto_lider,
        area_lider: usuario.area_lider,
        departamento_lider: usuario.departamento_lider,
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

// agregar campo de horario a todos los usuarios
router.get("/agregardiasemana", async (req, res) => {
  const kpi = await KPIs.find({ semana: 49 });
  const cambio = [];
  for (let i = 0; i < kpi.length; i++) {
    try {
      if (kpi[i].dia_semana === undefined || kpi[i].dia_semana === null) {
        // console.log("kpis", i);
        kpi[i].dia_semana = new Date(kpi[i].fecha).getDay();
        console.log("kpis", kpi[i]);
        cambio[i] = await kpi[i].save();
      }
    } catch (error) {
      console.log("error", error);
    }
  }
  console.log("kpi cambiados", cambio);
  res.send("ok");
});
export default router;
