import ExcelJS from 'exceljs';
import KPIsModel from "../../models/kpi_model"
import Users from "../../models/employee_model"
import {
    fechaRegional, getMonthText, getQuincena,
    getWeekNumber, getDayOfWeekText, fechaString,
    horaString
} from '../../fechas'
import fs from "fs"
import config from "../../config"

const xlsxKPIsEmpleado = async (filtros) => {
    // console.log("filtros", filtros)
    if (!filtros?.ut_id && !filtros?.lote) throw new Error("No se brindo un UT_ID y no es lote. Error logico.")

    const workbook = new ExcelJS.Workbook();
    let fechaHoy = fechaRegional(config.TIMEZONE_OFFSET);
    // workbook.creator =  email;
    workbook.lastModifiedBy = '';
    workbook.created = fechaHoy;
    workbook.modified = null;
    //fecha de emision en rep
    //
    const sheet = workbook.addWorksheet('KPIs', {
        properties: { tabColor: { argb: 'F176BD8' } },
        pageSetup: { paperSize: 9, orientation: 'landscape' }
    });

    sheet.views = [
        { zoomScale: 85 }
    ];
    let titleFont = {
        name: 'Calibri',
        family: 2,
        size: 22,
        bold: true,
    };
    let subtitleFont = {
        name: 'Calibri',
        family: 2,
        size: 11,
        bold: true,
    }

    // sheet.insertRow(1, );
    //dependera...  
    let currentRow = 1;
    let page = 1;
    let usuarios;
    const DESDE = filtros.fechaIni;
    const HASTA = filtros.fechaFin;
    const dias = (new Date(HASTA) - new Date(DESDE)) / 1000 / 3600 / 24

    let groupFiltros = {}
    groupFiltros["oficina"] = (filtros.oficina) ? new RegExp(filtros.oficina, 'i') : /.*/i;
    groupFiltros["area"] = (filtros.area) ? new RegExp(filtros.area, 'i') : /.*/i;
    groupFiltros["departamento"] = (filtros.departamento) ? new RegExp(filtros.departamento, 'i') : /.*/i;
    groupFiltros["grupo"] = (filtros.grupo) ? new RegExp(filtros.grupo, 'i') : /.*/i;
    groupFiltros["puesto"] = (filtros.puesto) ? new RegExp(filtros.puesto, 'i') : /.*/i;
    groupFiltros["nombre"] = (filtros.nombre) ? new RegExp(filtros.nombre, 'i') : /.*/i;

    if (filtros?.lote) {
        console.log("FILTROS LOTE?", {
            oficina: groupFiltros["oficina"],
            area: groupFiltros["area"],
            departamento: groupFiltros["departamento"],
            grupo: groupFiltros["grupo"],
            puesto: groupFiltros["puesto"],
            nombre: groupFiltros["nombre"],
        })
        usuarios = await Users.find({
            oficina: groupFiltros["oficina"],
            area: groupFiltros["area"],
            departamento: groupFiltros["departamento"],
            grupo: groupFiltros["grupo"],
            puesto: groupFiltros["puesto"],
            nombre: groupFiltros["nombre"],
        })
    }
    else {
        // let filtros = { ut_id: req.params.ut_id, semana: req.body.semana }; 
        console.log("SEARCH", {
            ut_id: filtros.ut_id
        })
        usuarios = await Users.find({
            ut_id: filtros.ut_id
        })
    }
    console.log("internal users", usuarios.length, usuarios[0].nombre);

    if (!usuarios.length) throw new Error("No se encontro ningun usuario.")
    for (let usuario of usuarios) {
        // fecha: { $lte: fechaRegional(config.TIMEZONE_OFFSET) },
        // fecha: { $gte: DESDE },
        // fecha: { $lte: HASTA },
        console.log(JSON.stringify({
            $and: [
                { ut_id: usuario.ut_id },
                {
                    ut_id: {
                        "$nin": ['1', '2', '3', '4', '5', '6', '7', '8', '9']
                    }
                },
                { fecha: { $lte: fechaRegional(config.TIMEZONE_OFFSET) } },
                { fecha: { $gte: DESDE } },
                { fecha: { $lte: HASTA } }]
        }))
        let kpis = await KPIsModel.find({
            $and: [
                { ut_id: usuario.ut_id },
                {
                    ut_id: {
                        "$nin": ['1', '2', '3', '4', '5', '6', '7', '8', '9']
                    }
                },
                { fecha: { $lte: fechaRegional(config.TIMEZONE_OFFSET) } },
                { fecha: { $gte: DESDE } },
                { fecha: { $lte: HASTA } }]
        }).sort({ "fecha": 1 })
        console.log("KPIS", kpis)
        // if (!kpis.length){("No se encontro ningun kpi.")}

        let values = [fechaHoy, "Reporte de Análisis", , , , , , , , , , , `Pg. ${page++}`];
        sheet.insertRow(currentRow++, values)
        sheet.mergeCells(currentRow - 1, 2, currentRow - 1, 12);



        let rowVals = sheet.getRow(currentRow - 1)
        for (let i = 1; i <= values.length; i++) {
            if ([1, values.length].includes(i))
                rowVals.getCell(i).style.font = subtitleFont;
            else
                rowVals.getCell(i).style.font = titleFont;
        }
        // sheet.getRow(currentRow - 1).style.font = titleFont;
        sheet.getRow(currentRow - 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

        // let miniKpis = await KPIsModel.aggregate([
        //     {
        //         '$match': {
        //             'ut_id': usuario.ut_id,
        //             '$expr': {
        //                 '$and': [
        //                     {
        //                         '$gte': [
        //                             '$fecha', DESDE
        //                         ]
        //                     }, {
        //                         '$lte': [
        //                             '$fecha', HASTA
        //                         ]
        //                     }
        //                 ]
        //             }
        //         }
        //     }, {
        //         '$sort': {
        //             'fecha': 1
        //         }
        //     }
        // ])
        // console.log(kpisQuery)
        // if (miniKpis) {
        //     // console.log(miniKpis)
        //     if (!miniKpis[0]) {
        //         console.log("no hay kpis")
        //         return;
        //     };//retorna undefined
        values = [usuario.id_empleado, usuario.nombre, , , , "Departamento:", usuario.departamento,
            "Puesto:", usuario.puesto,
            "Desde", new Date(DESDE).toISOString().split("T")[0], "Hasta", new Date(HASTA).toISOString().split("T")[0]];
        sheet.insertRow(currentRow++, values)
        sheet.mergeCells(currentRow - 1, 2, currentRow - 1, 5);
        sheet.getRow(currentRow - 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

        // }

        values = ["Dia", "Fecha", "Entrada", "Inicio Comida", "Fin Comida", "Salida", "Duración de la Jornada",
            "No.de Registros", "Checó Salida", "Retardo",
            "Salida Anticipada", "Tiempo despues de Jornada", "Total Comida",
            "Total Jornada"];
        sheet.insertRow(currentRow++, values)
        sheet.getRow(currentRow - 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };


        sheet.properties.defaultRowHeight = 30;

        let widths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
        sheet.getRow(currentRow - 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        // sheet.getRow(currentRow - 1).style.font = subtitleFont;
        rowVals = sheet.getRow(currentRow - 1)
        for (let i = 1; i <= widths.length; i++) {
            rowVals.getCell(i).style.font = subtitleFont;
        }
        for (let i = 1; i <= widths.length; i++) {
            // sheet.getColumn(i).style.font = titleFont;
            sheet.getColumn(i).width = widths[i - 1];
            // sheet.getRow(currentRow - 1).getCell(i).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        }

        //querying and data stuff.
        let incaQuery = [
            {
                '$match': {
                    '$and': [{
                        'fecha_inicio': {
                            '$gte': fechaRegional(config.TIMEZONE_OFFSET)//(quincena == 1) ? new Date(new Date(date).setUTCDate(1)) : new Date(new Date(date).setUTCDate(15))
                        }
                    }, {
                        'fecha_fin': {
                            '$lte': new Date(fechaRegional(config.TIMEZONE_OFFSET) + 7 * 24 * 3600 * 1000)//(quincena == 1) ? new Date(new Date(date).setUTCDate(14)) : new Date(new Date(date).setUTCDate((new Date(date).getMonth() == 1) ? 28 : 29))
                        }
                    },
                    {
                        'ut_id': {
                            '$nin': [
                                '1', '2', '3', '4', '5', '6', '7', '8', '9'
                            ]
                        }
                    }
                    ]
                }
            },
            {
                '$lookup': {
                    'from': 'users',
                    'localField': 'ut_id',
                    'foreignField': 'ut_id',
                    'as': 'user'
                }
            },
            {
                '$match': {
                    "user.isActive": true,
                    "user.ut_id": usuario.ut_id

                    // 'fecha': {
                    //     '$lte': (quincena == 1) ? new Date(new Date(date).setUTCDate(1)) : new Date(new Date(date).setUTCDate(15))
                    // },

                }
            }
        ];
        // console.log(incaQuery) 
        let incapacidades = await Incapacidad.aggregate(incaQuery);


        // let kpisQuery = [
        //     {
        //         '$match': {
        //             '$and': [{
        //                 '$or': [{
        //                     '$and': [{
        //                         '$expr': {
        //                             '$gte': ["$fecha", { $toDate: new Date("5/03/2021") }]
        //                         }
        //                     }, {
        //                         '$expr': {
        //                             '$lte': ["$fecha", { $toDate: new Date("5/17/2021") }]
        //                         }
        //                     }]
        //                 }]
        //             },
        //             {
        //                 'ut_id': {
        //                     '$nin': [
        //                         '1', '2', '3', '4', '5', '6', '7', '8', '9'
        //                     ]
        //                 }
        //             }
        //             ]
        //         }
        //     },
        //     {
        //         '$lookup': {
        //             'from': 'users',
        //             'localField': 'ut_id',
        //             'foreignField': 'ut_id',
        //             'as': 'user'
        //         }
        //     },
        //     {
        //         '$match': {
        //             "user.isActive": true,
        //             "user.ut_id": usuario.ut_id,
        //             "fecha": { $lte: fechaRegional(config.TIMEZONE_OFFSET) }
        //         }
        //     },
        //     {
        //         "$sort": {
        //             "fecha": 1
        //         }
        //     }];
        // let kpis = await KPIs.aggregate(kpisQuery)
        // console.log(kpisQuery)
        console.log("desde", DESDE, "hasta", HASTA)
        for (let dia = 0; dia < dias; dia++) {
            let fecha = new Date(new Date(DESDE).getTime() + dia * 1000 * 3600 * 24);
            console.log("FECHA", fecha, dia, dias)
            if (!fecha) console.log("ERROR de fecha en kpis", fecha);
            let kpi = kpis.filter(val => new Date(val.fecha).toISOString().split("T")[0] == fecha.toISOString().split("T")[0])[0]
            console.log("KPI", kpi)
            if (kpi) {
                console.log('hay kpis', kpis.length)//, kpisQuery)
                // console.log("kpis", kpis)
                // for (let kpi of kpis) { 
                let
                    horaTurnoEntrada = (kpi?.hora_turno && kpi?.hora_turno.hora_entrada) ? kpi.hora_turno.hora_entrada : (kpi.dia_semana != 6) ? usuario.hora_entrada : usuario.hora_entrada_sabado,
                    horaTurnoSalida = (kpi?.hora_turno && kpi?.hora_turno.hora_salida) ? kpi.hora_turno.hora_salida : (kpi.dia_semana != 6) ? usuario.hora_salida : usuario.hora_salida_sabado,
                    minTurnoEntrada = (kpi?.hora_turno && kpi?.hora_turno.minutos_entrada) ? kpi.hora_turno.minutos_entrada : (kpi.dia_semana != 6) ? usuario.minutos_entrada : usuario.minutos_entrada_sabado,
                    minTurnoSalida = (kpi?.hora_turno && kpi?.hora_turno.minutos_salida) ? kpi.hora_turno.minutos_salida : (kpi.dia_semana != 6) ? usuario.minutos_salida : usuario.minutos_salida_sabado;

                // console.log(horaTurnoEntrada, horaTurnoSalida, minTurnoEntrada, minTurnoSalida);
                if (kpi.hora_salida && kpi.hora_entrada) {
                    let entrada = kpi.hora_entrada.fechaUTC,
                        salida = kpi.hora_salida.fechaUTC,
                        almuerzoEntrada = (kpi.hora_almuerzo_entrada && kpi.hora_almuerzo_salida) ? kpi.hora_almuerzo_entrada.fechaUTC : new Date(Date.UTC(entrada.getUTCFullYear(), entrada.getUTCMonth(), entrada.getUTCDate(), 12, 0, 0, 0)),
                        almuerzoSalida = (kpi.hora_almuerzo_salida && kpi.hora_almuerzo_entrada) ? kpi.hora_almuerzo_salida.fechaUTC : new Date(Date.UTC(entrada.getUTCFullYear(), entrada.getUTCMonth(), entrada.getUTCDate(), 13, 0, 0, 0));
                    // console.log(entrada, salida, horaTurnoEntrada, horaTurnoSalida,
                    //     minTurnoEntrada, minTurnoSalida, almuerzoEntrada, almuerzoSalida, (kpi.hora_entrada.hora - horaTurnoEntrada) +
                    // (kpi.hora_entrada.minutos - minTurnoEntrada - 15) / 60
                    // );
                    let retardo = new Date(Date.UTC(entrada.getUTCFullYear(), entrada.getUTCMonth(), entrada.getUTCDate(),
                        0, Math.max(0, (kpi.hora_entrada.hora - horaTurnoEntrada) * 60 +
                            (kpi.hora_entrada.minutos - minTurnoEntrada - 15)), 0, 0)),

                        salidaAnticipada = new Date(Date.UTC(entrada.getUTCFullYear(), entrada.getUTCMonth(), entrada.getUTCDate(),
                            (horaTurnoSalida - salida.getUTCHours()) < 0 ? 0 : (horaTurnoSalida - salida.getUTCHours()),
                            Math.max(minTurnoSalida - salida.getUTCMinutes(), 0))),

                        totalComida = new Date(almuerzoSalida - almuerzoEntrada),

                        totalJornada = new Date((salida - entrada) - totalComida),

                        horarioAsignado = new Date(
                            Date.UTC(entrada.getUTCFullYear(), entrada.getUTCMonth(), entrada.getUTCDate(),
                                horaTurnoSalida, minTurnoSalida, 0, 0) - Date.UTC(entrada.getUTCFullYear(), entrada.getUTCMonth(), entrada.getUTCDate(),
                                    horaTurnoEntrada, minTurnoEntrada, 0, 0)),

                        tiempoExtra = new Date(Math.max(0, totalJornada - horarioAsignado)),

                        nRegistros = (kpi.marco_entrada || 0)
                            + (kpi.marco_salida || 0)
                            + (kpi.status_almuerzo || 0);
                    //     (kpi.marco_entrada == true) ? 1 : 0 +
                    //         (kpi.marco_salida == true) ? 1 : 0 +
                    //     (kpi.status_almuerzo)


                    // console.log(salidaAnticipada,
                    //     (horaTurnoSalida - salida.getUTCHours()) < 0 ? 0 : (horaTurnoSalida - salida.getUTCHours()),
                    //     Math.max(minTurnoSalida - salida.getUTCMinutes(), 0),
                    //     salida,
                    //     salida.getUTCHours(),
                    //     horaTurnoSalida);
                    // console.log("horari", horarioAsignado)
                    // console.log("kpi", kpi)
                    // console.log("noReg", noRegistros, "ret", retardo, "totalJ", totalJornada, "totalcom", totalComida,
                    //     "extra", tiempoExtra, "horario", horarioAsignado, "anticip", salidaAnticipada,
                    //     (kpi.hora_entrada.hora - horaTurnoEntrada) * 60,
                    //     (kpi.hora_entrada.minutos - minTurnoEntrada - 15))

                    sheet.insertRow(currentRow++, [getDayOfWeekText(kpi.dia_semana),
                    fechaString(kpi.fecha),
                    (entrada) ? horaString(entrada) : "",
                    (almuerzoEntrada) ? horaString(almuerzoEntrada) : "",
                    (almuerzoSalida) ? horaString(almuerzoSalida) : "",
                    (salida) ? horaString(salida) : "",
                    horaString(horarioAsignado),//"12?",//horario
                        nRegistros,//no. registros
                    // noRegistros,//no. registros
                    (kpi.marco_salida) ? "Si" : "No",
                    horaString(retardo),//retardo
                    // horaString(salidaAnticipada),//salidaanticipada
                    (kpi.salida_autorizada) ? "Si" : "No",
                    horaString(tiempoExtra),//tiempoExtra
                    horaString(totalComida),//totalComida
                    horaString(totalJornada)//totalJornada
                    ])
                    sheet.getRow(currentRow - 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                }
                else if (kpi.fecha //&& kpi.fecha <= fechaRegional(config.TIMEZONE_OFFSET) esto evita fechas que no han pasado.
                ) {//tiene kpi vacio a la fecha.
                    sheet.insertRow(currentRow++, [getDayOfWeekText(kpi.dia_semana),
                    fechaString(kpi.fecha),
                        "",
                        "",
                        "",
                        "",
                    horaString(new Date(
                        Date.UTC(0, 0, 0,
                            horaTurnoSalida, minTurnoSalida, 0, 0) - Date.UTC(0, 0, 0,
                                horaTurnoEntrada, minTurnoEntrada, 0, 0))),//horario
                        "00:00:00",//no. registros
                        "N/A",//checo salida
                        "00:00:00",//retardo
                        "N/A",//salida_autorizada
                        "00:00:00",//tiempoExtra
                        "00:00:00",//totalComida
                        "00:00:00"//totalJornada
                    ]);
                    sheet.getRow(currentRow - 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

                }
                // } end lop

            }
            else {//no tiene kpi
                let
                    horaTurnoEntrada = (fecha.getDay() != 6) ? usuario.hora_entrada : usuario.hora_entrada_sabado,
                    horaTurnoSalida = (fecha.getDay() != 6) ? usuario.hora_salida : usuario.hora_salida_sabado,
                    minTurnoEntrada = (fecha.getDay() != 6) ? usuario.minutos_entrada : usuario.minutos_entrada_sabado,
                    minTurnoSalida = (fecha.getDay() != 6) ? usuario.minutos_salida : usuario.minutos_salida_sabado;
                // else if (kpi.fecha && kpi.fecha <= fechaRegional(config.TIMEZONE_OFFSET)) {
                sheet.insertRow(currentRow++, [getDayOfWeekText(fecha.getDay()),
                fechaString(fecha),
                    "",
                    "",
                    "",
                    "",
                horaString(new Date(
                    Date.UTC(0, 0, 0,
                        horaTurnoSalida, minTurnoSalida, 0, 0) - Date.UTC(0, 0, 0,
                            horaTurnoEntrada, minTurnoEntrada, 0, 0))),//horario
                    0,//no. registros
                    "N/A",//checo salida
                    0,//retardo
                    "N/A",//salida_autorizada
                    0,//tiempoExtra
                    0,//totalComida
                    0//totalJornada
                ]);
                sheet.getRow(currentRow - 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

            }
        }

    }
    // await workbook.xlsx.writeFile(filePath)
    // // write to a file
    // const workbook = createAndFillWorkbook();

    // console.log("Borrar archivo")
    // if (fs.existsSync(filePath)) {
    //     fs.unlinkSync(filePath)
    //     console.log("file deleted ", filePath)
    // }

    // console.log("Creando Archivo", filePath)
    return await workbook.xlsx.writeBuffer();
    // return await workbook.xlsx.writeFile(filePath)
}

export { xlsxKPIsEmpleado };
