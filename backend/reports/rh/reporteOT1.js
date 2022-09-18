import ExcelJS from 'exceljs';

import OTs from "../../models/ots_model"
import {
    fechaRegional, getMonthText, getQuincena,
    getWeekNumber, getDayOfWeekText, fechaString,
    horaString,
    fechaReporte
} from '../../fechas'
import fs from "fs"
import config from "../../config"
import { procesos } from '../../util';

const xlsxReporteOTs1 = async () => {
    // console.log("filtros", filtros)
    // if (!filtros?.ut_id && !filtros?.lote) throw new Error("No se brindo un UT_ID y no es lote. Error logico.")

    const workbook = new ExcelJS.Workbook();
    let fechaHoy = fechaRegional(config.TIMEZONE_OFFSET);
    // workbook.creator =  email;
    workbook.lastModifiedBy = '';
    workbook.created = fechaHoy;
    workbook.modified = null;
    //fecha de emision en rep
    //
    const sheet = workbook.addWorksheet('OTs', {
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

    // const DESDE = filtros.fechaIni;
    // const HASTA = filtros.fechaFin;
    // const dias = (new Date(HASTA) - new Date(DESDE)) / 1000 / 3600 / 24

    // let groupFiltros = {}
    // groupFiltros["oficina"] = (filtros.oficina) ? new RegExp(filtros.oficina, 'i') : /.*/i;
    // groupFiltros["area"] = (filtros.area) ? new RegExp(filtros.area, 'i') : /.*/i;
    // groupFiltros["departamento"] = (filtros.departamento) ? new RegExp(filtros.departamento, 'i') : /.*/i;
    // groupFiltros["grupo"] = (filtros.grupo) ? new RegExp(filtros.grupo, 'i') : /.*/i;
    // groupFiltros["puesto"] = (filtros.puesto) ? new RegExp(filtros.puesto, 'i') : /.*/i;
    // groupFiltros["nombre"] = (filtros.nombre) ? new RegExp(filtros.nombre, 'i') : /.*/i;

    // if (filtros?.lote) {
    //     console.log("FILTROS LOTE?", {
    //         oficina: groupFiltros["oficina"],
    //         area: groupFiltros["area"],
    //         departamento: groupFiltros["departamento"],
    //         grupo: groupFiltros["grupo"],
    //         puesto: groupFiltros["puesto"],
    //         nombre: groupFiltros["nombre"],
    //     })
    //     usuarios = await Users.find({
    //         oficina: groupFiltros["oficina"],
    //         area: groupFiltros["area"],
    //         departamento: groupFiltros["departamento"],
    //         grupo: groupFiltros["grupo"],
    //         puesto: groupFiltros["puesto"],
    //         nombre: groupFiltros["nombre"],
    //     })
    // }
    // else {
    //     // let filtros = { ut_id: req.params.ut_id, semana: req.body.semana }; 
    //     console.log("SEARCH", {
    //         ut_id: filtros.ut_id
    //     })
    //     usuarios = await Users.find({
    //         ut_id: filtros.ut_id
    //     })
    // }

    const ots = await OTs.find() 

        let values = [fechaHoy, "Reporte de Análisis de OTs Geminatech", , , , , , , , , , , `Pg. ${page++}`];
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

    
        // values = [ot.sitio_codigo, ot.sitio_nombre, , , , "Departamento:", usuario.departamento,
        //     "Puesto:", usuario.puesto,
        //     "Desde", new Date(DESDE).toISOString().split("T")[0], "Hasta", new Date(HASTA).toISOString().split("T")[0]];
        // sheet.insertRow(currentRow++, values)
        // sheet.mergeCells(currentRow - 1, 2, currentRow - 1, 5);
        // sheet.getRow(currentRow - 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

        // }

        values = ["Código", "Nombre Sitio", "Número OT", "Requerimiento", "Fecha Solicitud","Cliente", "País", 
        "Proyecto", "Estado", "Fecha Entregado"];
        sheet.insertRow(currentRow++, values)
        sheet.getRow(currentRow - 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };


        sheet.properties.defaultRowHeight = 30;

        let widths = [20, 20, 20, 20, 20, 20, 20, 20, 20, 20]
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
        console.log("procesos", procesos)
        //querying and data stuff.
        for (let ot of ots) {
            const estado = procesos.filter(e=>e.codigo===ot.estado)[0].titulo
            console.log("estado", estado)

                    sheet.insertRow(currentRow++, [ot.sitio_codigo, ot.sitio_nombre, ot.ot_number, ot.requerimiento,
                        fechaReporte(ot.fecha_apertura), ot.cliente, ot.pais, ot.proyecto, 
                        estado,
                        ot.fecha_entregado? fechaReporte(ot.fecha_entregado): "" ,

                    ])
                    sheet.getRow(currentRow - 1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
               
        }

    // console.log("Creando Archivo", filePath)
    return await workbook.xlsx.writeBuffer();
    // return await workbook.xlsx.writeFile(filePath)
}

export { xlsxReporteOTs1 };
