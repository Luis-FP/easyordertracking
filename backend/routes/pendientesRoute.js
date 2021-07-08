import express from "express";
import Pendientes from '../models/pendientes_model.js';
import { getToken, isAuth, isSuper } from '../util';
import mongoose from 'mongoose';
import { fechaRegional, fechaRegionalInput } from "../fechas.js";

const router = express.Router();

router.get("/mine", isAuth, async (req, res) => {
  const seisMesesMenos = Date.now() - (2592000000 * 6);
  const fechaSeisMeses = fechaRegionalInput(seisMesesMenos , process.env.TIMEZONE_OFFSET);
  const compromiso = 
  {
   'compromisoUTC': {$gte: fechaSeisMeses},
  };
    const pendientes = await Pendientes.find({ ut_id: req.user.ut_id , ...compromiso}).sort({compromiso:1});
    const fechaUTC = new Date(req.body.fechaJuntaNueva);
    // const fecha = fechaUTC.toLocaleString('es-MX',{dateStyle: 'short', timeStyle:'full' ,hour12:false})
   
    const  myKpis =  [
      {
        '$match': {
          'user': {
            '$in': [
              mongoose.Types.ObjectId(req.user._id )
            ]
          }
        }
      },
        {
        '$addFields': {
          'dif': {
            $divide: [ {'$subtract': [ fechaUTC , '$compromiso']} , (60 * 1000) ]
          }
        }
      },
      {
        $project: {
            item: 1,
            tarde: {  // Set to 1 if value < 10
                $cond: [ { $lt: ["$dif", 0 ] }, 1, 0]
            },
            ontime: {  // Set to 1 if value > 10
                $cond: [ { $gt: [ "$dif", 0 ] }, 1, 0]
            }
        }
    },
    {
      $group: {
          _id: "$user",
          pendientetarde: { $sum: "$tarde" },
          pendienteontime: { $sum: "$ontime" }
      }
  } 
      ];
      // db.sales.aggregate( [ { $project: { item: 1, dateDifference: { $subtract: [ "$date", 5 * 60 * 1000 ] } } } ] )
      const kpis = await Pendientes.aggregate(myKpis);
// console.log('pendientes', pendientes)
const data= {
  pendientes: pendientes,
  kpis:kpis
} 
    if(pendientes ){
        res.status(200).send({data});
    } else {
        res.status(200).send({message: "no existen pendientes"});
    }
    
  });


  router.post("/crear", isAuth, async (req, res) => { 
    const fechaUTC = req.body.compromiso;
    const fecha = fechaUTC;
    const newPendiente = new Pendientes({
        ut_id: req.user.ut_id, 
        fecha: new Date(), // fecha de creado
        compromisoUTC: new Date(req.body.compromiso), // queda guardado en UTC
        compromiso:fecha, // fecha de junta en huso horario
        pendiente: req.body.pendienteNuevo,
        entregable: req.body.entregable,
        status: "Pendiente",
      });
    const NewPendiente = await newPendiente.save();
    if(NewPendiente ){
        res.status(201).send({data:NewPendiente});
    } else {
        res.status(501).send({message: "Error creando el pendiente"});
    }
  });

  router.post("/crearmanager", isAuth, isSuper, async (req, res) => {
    // console.log("req.body.compromiso", req.body.compromiso)
    const fechaUTC = fechaRegionalInput(req.body.compromiso,process.env.TIMEZONE_OFFSET);
    const fecha = fechaUTC;
    const newPendiente = new Pendientes({
 
        ut_id: req.body.idUserDetail,
        fecha: new Date(), // fecha de creado
        compromisoUTC: fechaUTC, // queda guardado en UTC
        compromiso: fechaUTC,  // fecha de junta en huso horario
        pendiente: req.body.pendienteNuevo,
        entregable: req.body.entregable,
        status: "Pendiente",
      });
    const NewPendiente = await newPendiente.save();
    if(NewPendiente ){
        res.status(201).send({data:NewPendiente});
    } else {
        res.status(501).send({message: "Error creando el pendiente"});
    }
  });

    router.post("/actualizar", isAuth, async (req, res) => {

      const fechaUTC = fechaRegional(process.env.TIMEZONE_OFFSET);
      // console.log("fechaUTC", fechaUTC)
      const fecha = fechaUTC;
      const pendiente = await Pendientes.findById({ _id: req.body.pendiente._id}).sort({compromiso:1});
      // console.log('pendiente', pendiente)
        if (pendiente) {
          pendiente.status  = req.body.status || pendiente.status;
          // pendiente.compromiso  = pendiente.compromiso;
          // pendiente.compromisoUTC  = pendiente.compromiso;
          if(pendiente.status === 'Terminado'){
          pendiente.fecha_terminado = fechaRegional(process.env.TIMEZONE_OFFSET);
          }
          const NewStatusPendiente = await pendiente.save();
          res.status(200).send({data:NewStatusPendiente});
      } else {
          res.status(201).send({message: "Error actualizando el pendiente"});
      }

  });

  
  router.post("/modificar", isAuth, async (req, res) => {

    console.log("info",req.body);
    const pendiente = await Pendientes.findById({ _id: req.body.id});
    // console.log('pendiente', pendiente)
      if (pendiente) {

        pendiente.pendiente  = req.body.newPendiente;
        pendiente.entregable = req.body.newEntregable;
        pendiente.compromisoUTC  = fechaRegionalInput(req.body.newCompromiso,process.env.TIMEZONE_OFFSET);
        pendiente.compromiso  =  fechaRegionalInput(req.body.newCompromiso,process.env.TIMEZONE_OFFSET);
        const pendienteModificado = await pendiente.save();
        res.status(200).send({data:pendienteModificado});
    } else {
        res.status(201).send({message: "Error actualizando el pendiente"});
    }

});

  router.post("/delete", isAuth, isSuper, async (req, res) => {
    // console.log('hola junta', req.body)
    
        try{
            const pendienteInfo = await Pendientes.findById(req.body.pendiente);  
            const deletedPendiente = await pendienteInfo.remove();
            res.status(200).send({data:deletedPendiente, message: "pendiente eliminado"});
        } catch(error) {
            console.log('error', error)
            res.status(500).send({message: "fallo eliminando pendiente"});
        }
      });

export default router;
