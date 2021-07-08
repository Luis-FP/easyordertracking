import express from "express";
import KPIs from '../models/kpi_model.js';
import Pendientes from '../models/pendientes_model.js';
import User from '../models/employee_model.js';

import { getToken, isAuth, isSuper } from '../util';
import { fechaRegional, getWeekNumber, getWeekNumber2, queMesAno, fechaRegionalInput, numTrimestre, fechaRegionalUnica } from '../fechas';
import mongoose, { mongo } from 'mongoose';


const router = express.Router();



router.get("/mine", isAuth, async (req, res) => {
  const d = fechaRegional(process.env.TIMEZONE_OFFSET);
  const userId = req.user.ut_id;
  const fechaFormato = fechaRegionalUnica(process.env.TIMEZONE_OFFSET);
  let registroDia = await KPIs.findOne({
    uniqueId: userId + fechaFormato,
  });


  const myKpis = [
    {
      '$match': {
        'user': mongoose.Types.ObjectId(req.user._id)
      }
    },
    {
      '$lookup': {
        'from': 'kpis',
        'localField': '_id',
        'foreignField': 'user',
        'as': 'kpis'
      }
    }, {
      '$match':
      {
        'semana': Number(getWeekNumber(d))
      }
    },
    {
      '$group':
      {
        _id: "$user",
        puntualidad: {
          $avg:
            { $subtract: ["$hora_entrada.hora_decimal", "$hora_turno.hora_entrada"] }

        },




        burnout: { $sum: { $subtract: [{ $subtract: ["$hora_salida.hora_decimal", "$hora_entrada.hora_decimal"] }, 9] } },
        animo_prom: { $avg: "$animoAM" }
      }
    }
  ];

  const myKpisResult = await KPIs.aggregate(myKpis);
  const ano = (new Date()).getFullYear();
  const mes = (new Date()).getMonth() + 1;
  // console.log('resultados', myKpisResult);
  const seisMesesMenos = Date.now() - (2592000000 * 6);
  const fechaSeisMeses = fechaRegionalInput(seisMesesMenos, process.env.TIMEZONE_OFFSET);
  const numTrimActual = numTrimestre(d);
  let QInicio = fechaRegional(process.env.TIMEZONE_OFFSET);
  let QFin = fechaRegional(process.env.TIMEZONE_OFFSET);
  if (numTrimActual === 1) {
    QInicio.setDate(1);
    QInicio.setMonth(1 - 1);
    QFin.setDate(31);
    QFin.setMonth(3 - 1);
  } else if (numTrimActual === 2) {
    QInicio.setDate(1);
    QInicio.setMonth(4 - 1);
    QFin.setDate(30)
    QFin.setMonth(6 - 1);
  } else if (numTrimActual === 3) {
    QInicio.setDate(1)
    QInicio.setMonth(7 - 1);
    QFin.setDate(30)
    QFin.setMonth(9 - 1);
  } else if (numTrimActual === 4) {
    QInicio.setDate(1)
    QInicio.setMonth(10 - 1);
    QFin.setMonth(12 - 1);
    QFin.setDate(31)
  }

  const compromiso =
  {
    'compromisoUTC': { $gte: fechaSeisMeses },
  };
  const pendientes = await Pendientes.find({ ut_id: req.user.ut_id, ...compromiso }).sort({ compromiso: 1 });
  

  const semana =
  {
    'semana': Number(getWeekNumber(d))
  };
  const usuario =
  {
    'ut_id': userId
  };

  const plainKPIs = await KPIs.find({ ...usuario, ...semana });



  // console.log('reunionesxx ', reuniones)
  const resultados = {
    pendientes: pendientes,
    mykpis: myKpisResult,
    reclamos: listaQuejas,
    plainKPIs: plainKPIs,

  }
  // console.log("resultados", resultados)
  if (pendientes) {
    res.status(200).send({ data: resultados });
  } else {
    res.status(200).send({ message: "no existen pendientes" });
  }

});

router.post("/horavista", isAuth, async (req, res) => {
  const userId = req.user.ut_id;
  const fechaFormato = fechaRegionalUnica(process.env.TIMEZONE_OFFSET);
  // console.log('user ', req.user, "fechaFormato", fechaFormato)
  const registroDia = await KPIs.findOne({
    uniqueId: userId + fechaFormato,
  });

  if (registroDia) {
    registroDia.hora_entrada_mostrada_hoy = true;
    registroDia.save();
    res.status(200).send({ data: registroDia.hora_entrada_mostrada_hoy });
  } else {
    res.status(500).send({ message: "no existen registro hoy" });
  }

});



router.get("/listagrupo", isAuth, isSuper, async (req, res) => {
  const fechaUTC = fechaRegional(process.env.TIMEZONE_OFFSET);
  const user = await User.findById(req.user._id);
  const groupManager = { grupo: user.vista }
  const users = await User.find({ ...groupManager });

  const integrantes = users.map((user) => user.ut_id);
  const integrantesNombres = users.map((user) => user.nombre);
  // console.log('integrantes', integrantes);
  // const week = Number(getWeekNumber(new Date()));
  const week = Number(getWeekNumber2(new Date()));
  const mes = (new Date()).getMonth() + 1;
  const numTrimActual = numTrimestre(fechaUTC);
  let QInicio = fechaRegional(process.env.TIMEZONE_OFFSET);
  let QFin = fechaRegional(process.env.TIMEZONE_OFFSET);
  if (numTrimActual === 1) {
    QInicio.setDate(1);
    QInicio.setMonth(1 - 1);
    QFin.setDate(31);
    QFin.setMonth(3 - 1);
  } else if (numTrimActual === 2) {
    QInicio.setDate(1);
    QInicio.setMonth(4 - 1);
    QFin.setDate(30)
    QFin.setMonth(6 - 1);
  } else if (numTrimActual === 3) {
    QInicio.setDate(1)
    QInicio.setMonth(7 - 1);
    QFin.setDate(30)
    QFin.setMonth(9 - 1);
  } else if (numTrimActual === 4) {
    QInicio.setDate(1)
    QInicio.setMonth(10 - 1);
    QFin.setMonth(12 - 1);
    QFin.setDate(31);
  }



  const groupKpis2 = [

    {
      '$match':
      {
        'ut_id': { $in: integrantes },
        'isActive': true
      }
    }, {
      '$lookup': {
        'from': 'kpis',
        'localField': 'ut_id',
        'foreignField': 'ut_id',
        'as': 'kpis'
      }
    },
    {
      '$lookup': {
        'from': 'inca_vacas',
        'localField': 'ut_id',
        'foreignField': 'ut_id',
        'as': 'ausencias'
      }
    },
    {
      '$lookup': {
        'from': 'azuetos',
          pipeline: [
            { $match: {} },
        ],
        'as': 'azuetos'
      }
    },
    {
      '$lookup': {
        'from': 'juntas',
        'localField': 'ut_id',
        'foreignField': 'grupo.id',
        'as': 'reuniones'
      }
    },
    {
      '$project': {
        'razon_social': 1,
        'ut_id': 1,
        'id_empleado': 1,
        'nombre': 1,
        'apellido': 1,
        'email': 1,
        // 'password': 1,
        'oficina': 1,
        'puesto': 1,
        'area': 1,
        'departamento': 1,
        'grupo': 1,
        'vista': 1,
        'isSuper': 1,
        // 'isActive':1,
        'dias_laborables':1,
        'isRH': 1,
        'id_lider': 1,
        'nombre_lider': 1,
        'puesto_lider': 1,
        'area_lider': 1,
        'departamento_lider': 1,
        'ausencias': 1,
        'azuetos': 1,
        'kpis': {
          '$filter': {
            'input': '$kpis',
            'as': 'kpis',
            'cond': {
              '$eq': [
                '$$kpis.semana', week
              ]
            }
          }
        },
        'puntualidad': {
          '$avg': {
            '$map': {
              'input': {
                '$filter': {
                  'input': '$kpis',
                  'as': 'kpis',
                  'cond': {
                    '$eq': [
                      '$$kpis.semana', week
                    ]
                  }
                }
              },
              'as': 'kpi',
              'in': {
                '$subtract': [
                  '$$kpi.hora_entrada.hora_decimal', '$$kpi.hora_turno.hora_entrada'
                ]
              }
            }
          }
        },
        'jornada': {
          '$avg': {
            '$map': {
              'input': {
                '$filter': {
                  'input': '$kpis',
                  'as': 'kpis',
                  'cond': {
                    '$eq': [
                      '$$kpis.semana', week
                    ]
                  }
                }
              },
              'as': 'kpi',
              'in': {
                '$divide': [
                  {
                    '$subtract': [
                      '$$kpi.hora_salida.fechaUTC', '$$kpi.hora_entrada.fechaUTC'
                    ]
                  }, 3600000
                ]
              }
            }
          }
        },
        'reuniones': {
          '$map': {
            'input': {
              '$filter': {
                'input': '$reuniones',
                'as': 'reus',
                'cond': {
                  '$eq': [
                    '$$reus.semana_junta', week
                  ]
                }
              }
            },
            'as': 'reu',
            'in': {
              'grupo': {
                '$filter': {
                  'input': '$$reu.grupo',
                  'as': 'grupo',
                  'cond': {
                    '$eq': [
                      '$$grupo.id', '$ut_id'
                    ]
                  }
                }
              },
              'reunion': '$$reu'
            }
          }
        },
        'burnout': {
          '$sum': {
            '$map': {
              'input': {
                '$filter': {
                  'input': '$kpis',
                  'as': 'kpis',
                  'cond': {
                    '$eq': [
                      '$$kpis.semana', week
                    ]
                  }
                }
              },
              'as': 'kpi',
              'in': {
                '$max': [
                  {
                    '$subtract': [
                      {
                        '$subtract': [
                          '$$kpi.hora_salida.hora_decimal', '$$kpi.hora_entrada.hora_decimal'
                        ]
                      }, 9
                    ]
                  }, 0
                ]
              }
            }
          }
        },
        'animo_prom': {
          '$avg': {
            '$map': {
              'input': '$kpis',
              'as': 'kpi',
              'in': {
                '$avg': [
                  {
                    '$ifNull': [
                      '$$kpi.animoAM', '$$kpi.animoPM'
                    ]
                  }, {
                    '$ifNull': [
                      '$$kpi.animoPM', '$$kpi.animoAM'
                    ]
                  }
                ]
              }
            }
          }
        }
      }
    },
    {
      '$sort': {
        'ut_id': 1
      }
    }];



  const numQuejas = [
    {
      '$match':
        groupManager,
      // $and:[{$gte:["$fecha", QInicio]},{ $lte:["$fecha", QFin]}],
    },
    {
      $group: {
        _id: '$grupo',
        aceptadas: {
          $sum: {
            $cond: {
              if: {
                $and: [{ $gte: ["$fecha", QInicio] }, { $lte: ["$fecha", QFin] }, { $eq: ['$aceptada', true] }],
                // $eq: ['$aceptada', true]
              },
              then: 1,
              else: 0
            }
          }
        },
        nuevas_quejas: {
          $sum: {
            $cond: {
              if: {
                $and: [{ $gte: ["$fecha", QInicio] }, { $lte: ["$fecha", QFin] }, { $eq: ['$revisada_por_super', false] }],
                // $eq: ['$revisada_por_super', false]
              },
              then: 1
              , else: 0
            }
          }
        }
      }
    }, {
      '$sort': {
        'ut_id': 1
      }
    }
  ];

  const juntasMesQuery = [
    {
      '$match':
      {
        'grupo_integrantes': req.user.vista,
        'mes': mes - 1
      }
    }
  ];

  // rutina pendientes de los supervisadas de cada miembro___________________________________________________
  // buscar info cada Integrante
  // console.log('Object.keys(integrantes)', Object.keys(integrantes).length);
  let grupoSupervisadoLider = [];
  let pendientesLiderazgo = [];
  let subIntegrantes = [];
  let subIntegrantesNombres = [];
  let miembrosEquipo = [];
  let pendientesUsuario = [];
  for (let i = 0; i < Object.keys(integrantes).length; i++) {
    // buscar vista de cada Integrante
    grupoSupervisadoLider[i] = await User.find({ grupo: users[i].vista }, { ut_id: 1, nombre: 1, isSuper: 1 });
    subIntegrantes[i] = grupoSupervisadoLider[i].map((user) => user.ut_id);
    subIntegrantesNombres[i] = grupoSupervisadoLider[i].map((user) => user.nombre);
    let pendSubGrup = {
      ut_id: { $in: subIntegrantes[i] },
    }
    // buscar pendientes de cada integrante
    pendientesLiderazgo[i] = await Pendientes.find({ ...pendSubGrup })
    


    // rutina de calculo de pendientes de los lideres a sus colaboradores ___________________________
    miembrosEquipo[i] = [];
    pendientesUsuario[i] = [];
    let activos = [];
    let caducados = [];

    let pen = 0;
    let act = 0;
    let cad = 0;
    let estatusPen = 0;
    // console.log('grupoSupervisadoLider[i]', grupoSupervisadoLider[i]);
    // console.log('pendientesLiderazgo', pendientesLiderazgo[i]);
    for (let x = 0; x < grupoSupervisadoLider[i].length; x++) { // recorro todos los integrantes del equipo
      for (let y = 0; y < pendientesLiderazgo[i].length; y++) {
        // console.log("integrantes[x]", subIntegrantes[i][x], "pendientesLiderazgo[y].ut_id", pendientesLiderazgo[i][y].ut_id)
        if (subIntegrantes[i][x] === pendientesLiderazgo[i][y].ut_id && pendientesLiderazgo[i][y].compromisoUTC.getTime() - new Date().getTime() > 0) { // pendiente activo
          act++;
        } else if (subIntegrantes[i][x] === pendientesLiderazgo[i][y].ut_id && pendientesLiderazgo[i][y].compromisoUTC.getTime() - new Date().getTime() < 0) {// caducados
          cad++;
        }
        if (subIntegrantes[i][x] === pendientesLiderazgo[i][y].ut_id) {
          pen++;
        }
      }
      if (act >= 2) {
        estatusPen++;
      } else {

      }
      pendientesUsuario[i][x] =
        // pendientes:pen,
        // activos:act,
        // caducados:cad,
        // estatusPen: estatusPen
        estatusPen
        ;
      pen = 0;
      act = 0;
      cad = 0;
      estatusPen = 0;
    }
    // checar si tiene pendientes rojos
    // console.log('pendientesUsuario[i]', pendientesUsuario)
    miembrosEquipo[i] = {
      miembro: integrantesNombres[i],
      miembroId: integrantes[i],
      subMiembros: subIntegrantesNombres[i],
      evalPendiente: (subIntegrantesNombres[i].length > 0) ? ((pendientesUsuario[i].reduce(function (accumulator, currentValue, currentIndex, array) {
        return accumulator + currentValue
      })
      ) / (pendientesUsuario[i].length)) : (1)
    };

    // --------------------------------------------------------------------------

  }
  
  try {
    const reuniones = await Juntas.aggregate(juntasMesQuery)
    const kpisGrAgr = await User.aggregate(groupKpis2)
    const listaQuejas = await Quejas.aggregate(numQuejas)
    const azuetos = await Azuetos.find();
    const team = {
      kpisGrAgr: kpisGrAgr,
      quejas: listaQuejas,
      reuniones: reuniones,
      azuetos: azuetos,
      // evalLideres: evalPendLideres
      evalLideres: miembrosEquipo

    }
    // console.log('team ', team);
    res.status(200).send({ data: team });
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: error });
  }

});


router.post("/kpisuser", isAuth, isSuper, async (req, res) => {

  const seisMesesMenos = Date.now() - (2592000000 * 6);
  const fechaSeisMeses = fechaRegionalInput(seisMesesMenos, process.env.TIMEZONE_OFFSET);
  // console.log('fechaSeisMeses', fechaSeisMeses)
  // console.log('req.user', req.user)
  const groupKpis = [
    {
      '$match': {
        'semana': req.body.semana,
        'ut_id': {
          '$in': [
            // mongoose.Types.ObjectId(req.body.id)
            req.body.id
          ]
        }
      }
    },
    // {
    //   $addFields: { // eliminar lo estoy colocando al crear el KPI
    //     turno_hora_entrada:  req.user.hora_entrada,
    //     turno_minutos_entrada:  '$minutos_entrada',
    //     turno_hora_salida:  '$hora_entrada',
    //     turno_minutos_salida:  '$minutos_entrada',
    //     turno_hora_entrada_sabado:  '$hora_entrada_sabado',
    //     turno_minutos_entrada_sabado:  '$minutos_entrada_sabado',
    //     turno_hora_salida_sabado:  '$hora_salida_sabado',
    //     turno_minutos_salida_sabado:  '$minutos_salida_sabado',
    //   }
    // },
    {
      '$lookup': {
        'from': 'pendientes',
        'localField': 'ut_id',
        'foreignField': 'ut_id',
        'as': 'pendientes'
      }
    },
    {
      '$lookup': {
        'from': 'juntas',
        'localField': 'grupo',
        'foreignField': 'vista',
        'as': 'reuniones'
      }
    },
    {
      '$lookup': {
        'from': 'inca_vacas',
        'localField': 'ut_id',
        'foreignField': 'ut_id',
        'as': 'ausencias'
      }
    },
    // {
    //   '$lookup': {
    //     'from': 'azuetos',
    //     'localField': 'fecha',
    //     'foreignField': 'fecha',
    //     'as': 'azueto'
    //   }
    // },
    {
      '$project': {
        '_id': 1,
        'dia_semana': 1,
        'fecha': 1,
        'semana': 1,
        'animoAM': 1,
        'animoPM': 1,
        'marco_entrada': 1,
        'marco_salida': 1,
        'hora_entrada': 1,
        'hora_salida': 1,
        'hora_turno': 1,
        'status_almuerzo': 1,
        'status_permiso': 1,
        'status_incapacidad': 1,
        'hora_almuerzo_entrada': 1,
        'hora_almuerzo_salida': 1,
        'hora_permiso_entrada': 1,
        'hora_permiso_salida': 1,
        'hora_turno': 1,
        'dias_laborables': 1,
        'tiempo_comida': 1,
        'turno_hora_entrada': 1,
        'turno_minutos_entrada': 1,
        'turno_hora_salida': 1,
        'turno_minutos_salida': 1,
        'turno_hora_entrada_sabado': 1,
        'turno_minutos_entrada_sabado': 1,
        'turno_hora_salida_sabado': 1,
        'turno_minutos_salida_sabado': 1,

        'user': 1,
        'ausencias': 1,
        // ausencias: {
        //   $filter: {
        //     input: "$ausencias",
        //     as: "au",
        //     cond: {
        //       $and: [
        //         { $gte: [fechaRegional(process.env.TIMEZONE_OFFSET), "$$au.fecha_inicio"] }
        //         ,
        //         { $lte: [fechaRegional(process.env.TIMEZONE_OFFSET), "$$au.fecha_fin"] }]
        //     },

        //   }
        // },
        'reuniones': {
          '$filter': {
            'input': '$reuniones',
            'as': 'reu',
            'cond': {
              '$eq': [
                '$$reu.semana_junta', req.body.semana,
              ]
            }
          }
        }
      }
    }


  ];
  const persona = await User.find({ ut_id: req.body.id }); //{ut_id:1, nombre:1, grupo:1, vista:1,}
  const azuetos = await Azuetos.find();
  const compromiso =
  {
    'compromisoUTC': { $gte: fechaSeisMeses },
  };
  const pendientes = await Pendientes.find({ ut_id: req.body.id, ...compromiso }).sort({ compromiso: 1 });

  // console.log("persona[0].codigo_puesto", persona[0].codigo_puesto)
  const resp = [
    {
      '$match': {
        codigo_puesto: persona[0].codigo_puesto,
        // 'oficina': {
        //   '$in': [
        //     persona[0].oficina
        //   ]
        // }
      }
    },
  ]

  const responsabilidades = await Responsabilidades.aggregate(resp);

  const grupoSupervisado =
  {
    grupo: persona[0].vista ? persona[0].vista : "",
  };

  const supervisados = await User.find({ ...grupoSupervisado }, { ut_id: 1, nombre: 1 });
  const integrantes = supervisados.map((user) => user.ut_id);
  const integrantesNombres = supervisados.map((user) => user.nombre);
  const pendGrup = {
    ut_id: { $in: integrantes },
  }



  // rutina de calculo de pendientes de los lideres a sus colaboradores ___________________________

  const pendientesLiderazgo = await Pendientes.find({ ...pendGrup })
  // console.log('PendientesLiderazgo', pendientesLiderazgo)
  let miembrosEquipo = [];
  let pendientesUsuario = 0;
  let activos = 0;
  let caducados = 0;
  for (let x = 0; x < integrantes.length; x++) { // recorro todos los integrantes del equipo
    for (let y = 0; y < pendientesLiderazgo.length; y++) {
      // console.log("integrantes[x]", integrantes[x], "pendientesLiderazgo[y].ut_id",pendientesLiderazgo[y].ut_id )
      if (integrantes[x] === pendientesLiderazgo[y].ut_id && pendientesLiderazgo[y].compromisoUTC.getTime() - new Date().getTime() > 0) { // pendiente activo
        activos++;
      } else if (integrantes[x] === pendientesLiderazgo[y].ut_id && pendientesLiderazgo[y].compromisoUTC.getTime() - new Date().getTime() < 0) {// caducados
        caducados++;
      }
      if (integrantes[x] === pendientesLiderazgo[y].ut_id) {
        pendientesUsuario++;
      }

    }

    miembrosEquipo[integrantes[x]] = {
      miembro: integrantesNombres[x],
      pendientes: pendientesUsuario,
      activos: activos,
      caducados: caducados,
    };
    pendientesUsuario = 0;
    activos = 0;
    caducados = 0;
  }
  // console.log('integrantes',integrantes,'miembrosEquipo', miembrosEquipo );

  let anoBusqueda = { ano: req.body.ano };
  if (req.body.semana >= 52 || req.body.semana === 1) {
    anoBusqueda = { ano: { $in: [req.body.ano, req.body.ano + 1] } }
  }
  const ausencias = await Ausencias.find({ ut_id: req.body.id, ...anoBusqueda });
  const evaluaciones = await EvaluacionEmpleado.find({ ut_id: req.body.id }).sort({ mes: 1 });
  const kpisGrAgr = await KPIs.aggregate(groupKpis).sort({ 'diaSemana': 1 });
  const team = {
    kpisGrAgr: kpisGrAgr,
    pendientes: pendientes,
    evaluaciones: evaluaciones,
    user: persona,
    ausencias: ausencias,
    azuetos: azuetos,
    responsabilidades: responsabilidades,
    pendientesLiderazgo: miembrosEquipo
  }
  // console.log('team', team.kpisGrAgr);
  res.status(200).send({ data: team });
});


router.post("/kpisuserjornadahora", isAuth, isSuper, async (req, res) => {
  console.log('idUser', req.body.idUser, ', cambioJornada', req.body.cambioJornada)
  console.log('cambioJornada.length', req.body.cambioJornada.length)
  // const kpis =[];
  // const user = await User.find({ ut_id: req.body.cambioJornada[1].id })
  const erroresExistentes = [];
  let ano, mes, dia, weekNumber, fechaKPI, horaJornadaNuevo;

  for (let i = 0; i < req.body.cambioJornada.length; i++) {
    console.log("ok1")

    // console.log("cambioJornada[i]", i, req.body.cambioJornada[i])

    if (req.body.cambioJornada[i].id !== "noID") { // existe el kpi

      try {
        const dia = await KPIs.findById(req.body.cambioJornada[i].id); // usar guardar many
        if (i === 5) {
          dia.hora_turno.hora_entrada_sabado = req.body.cambioJornada[i].entradaHH;
          dia.hora_turno.minutos_entrada_sabado = req.body.cambioJornada[i].entradaMM;
          dia.hora_turno.hora_salida_sabado = req.body.cambioJornada[i].salidaHH;
          dia.hora_turno.minutos_salida_sabado = req.body.cambioJornada[i].salidaMM;
          //igual deberia actualizar hora_entrada, salida etc, por si se usa en al guna otra  parte
          dia.hora_turno.hora_entrada = req.body.cambioJornada[i].entradaHH;
          dia.hora_turno.minutos_entrada = req.body.cambioJornada[i].entradaMM;
          dia.hora_turno.hora_salida = req.body.cambioJornada[i].salidaHH;
          dia.hora_turno.minutos_salida = req.body.cambioJornada[i].salidaMM;
        } else {
          dia.hora_turno.hora_entrada = req.body.cambioJornada[i].entradaHH;
          dia.hora_turno.minutos_entrada = req.body.cambioJornada[i].entradaMM;
          dia.hora_turno.hora_salida = req.body.cambioJornada[i].salidaHH;
          dia.hora_turno.minutos_salida = req.body.cambioJornada[i].salidaMM;
        }
        dia.cambio_jornada = true // el jefe realizo este KPI
        // console.log("dia", dia);
        const horaJornadaUpdate = await dia.save();
        console.log("horaJornadaNuevo", horaJornadaUpdate);
      } catch (error) {
        console.log(error);
        erroresExistentes[i] = error;
        // res.status(500).send({error:error, messaje: "error guardando hora" });
      }
    } else {
      try {
        [ano, mes, dia] = req.body.cambioJornada[i].fechaUnica.split("-");
        console.log("ano, mes, dia", ano, mes, dia)
        fechaKPI = new Date(ano, mes - 1, dia)//no puede ser utc
        weekNumber = getWeekNumber(fechaKPI);//porque esto no es UTC
        // console.log('weekNumber', weekNumber);
        // console.log('fechaKPI ', fechaKPI);
        const kpis = new KPIs({
          uniqueId: req.body.cambioJornada[i].ut_id + `${ano}-${mes}-${dia}`,
          user: req.user._id,
          // fecha: fechaUTC,
          ut_id: req.body.cambioJornada[i].ut_id,
          fecha: fechaKPI,
          semana: weekNumber,
          dia_semana: fechaKPI.getDay(),
          hora_turno: {         // creo turno segun contrato
            hora_entrada: req.body.cambioJornada[i].entradaHH || null,
            minutos_entrada: req.body.cambioJornada[i].entradaMM || null,
            hora_salida: req.body.cambioJornada[i].salidaHH || null,
            minutos_salida: req.body.cambioJornada[i].salidaMM || null,

            hora_entrada_sabado: req.body.cambioJornada[i].entradaHH || null,
            minutos_entrada_sabado: req.body.cambioJornada[i].entradaMM || null,
            hora_salida_sabado: req.body.cambioJornada[i].salidaHH || null,
            minutos_salida_sabado: req.body.cambioJornada[i].salidaMM || null,
          }
        });
        horaJornadaNuevo = await kpis.save();
        // console.log('horaJornadaNuevo ', horaJornadaNuevo)
      } catch (error2) {
        console.log(error2);
        erroresExistentes[i] = error2;
      }
    }

  }
  if (erroresExistentes.length === 0) {
    res.status(200).send({
      error: false, message: (erroresExistentes.length !== 0) ? errores : "Exito crear los kpi nuevos."
    });

  } else {
    res.status(200).send({ error: true, errores: erroresExistentes, message: "Invalid User Data. " });
  }

});



export default router;
