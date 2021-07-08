import { xlsxKPIsEmpleado } from "../reports/rh/kpisEmpleado.js";
import { createReporte } from "../pages/reportePage";
import User from "../models/employee_model"
import { isAuth, isRH, EnvioEmail } from "../util"
import { fechaString, fechaRegional } from "../fechas"
import express from "express"
import fs from "fs"
import path from "path"
const router = express.Router();
 

router.post("/rh/incidencias", isAuth, isRH, async (req, res) => {
    console.log("reporte solicitado")
    console.log(req.body.email);
    console.log(req.body);
    let filtros = req.body.filtros, fileName, buff, nombre, error,
        email = req.body.email//'alejandroparparcen@yahoo.com'
    try {
        const usuario = await User.findOne({ email: new RegExp(email, 'i') })
        if (usuario) {
            nombre = usuario.nombre;
            nombre = usuario.nombre.toUpperCase().split(" ");
            // password = "NAD1234";
            if (nombre.length >= 3) {
                //si si tiene apellido agarrar el primer caracter, si no entonces nada mas sera ell nombre:
                //eg. Alejandro , password = alejandro
                //eg2. Alejandro Parparcen , password = aparparcen
                nombre = nombre[2] ? nombre[0].charAt(0) + nombre[2] : nombre[0];
            } else {
                nombre = nombre[1] ? nombre[0].charAt(0) + nombre[1] : nombre[0];
            }

console.log("filtros", filtros);
            fileName = `${nombre}_incidencias.xlsx`
            buff = await xlsxIncidencias(usuario.email,
                (req.body.fechaIni) ? new Date(req.body.fechaIni) : new Date(),
                (req.body.fechaFin) ? new Date(req.body.fechaFin) : new Date(),
                filtros);
        }
    }
    catch (e) {
        console.log("exception reportes route KPI generacion", e)
        error = true;
    }

    if (!error)
        res.send({ error: false, fileName: fileName, message: "Archivo Generado con Exito.", buff: buff });
    else
        res.send({ error: true, message: "Problema al generar archivo." });

})


router.post("/rh/kpis", isAuth, isRH, async (req, res) => {
    let error = false;
    let fileName, buff, desde, hasta, nombre;
    console.log("reporte solicitado", req.body.email, req.body);//seria bueno buscar quien creo el archivo. 
    try {
        desde = req.body?.fechaIni.split("T")[0]
        hasta = req.body?.fechaFin.split("T")[0]

        if (req.body.lote) {
            nombre = "LOTE"
        }
        else if (req.body.ut_id) {
            const usuario = await User.findOne({ ut_id: req.body.ut_id })
            if (usuario) {
                nombre = usuario.nombre;
                nombre = usuario.nombre.toUpperCase().split(" ");
                // password = "NAD1234";
                if (nombre.length >= 3) {
                    //si si tiene apellido agarrar el primer caracter, si no entonces nada mas sera ell nombre:
                    //eg. Alejandro , password = alejandro
                    //eg2. Alejandro Parparcen , password = aparparcen
                    nombre = nombre[2] ? nombre[0].charAt(0) + nombre[2] : nombre[0];
                } else {
                    nombre = nombre[1] ? nombre[0].charAt(0) + nombre[1] : nombre[0];
                }
            }
        }

        fileName = `KPIs_${nombre}_${desde}_a_${hasta}.xlsx`
        buff = await xlsxKPIsEmpleado(req.body);
    }
    catch (e) {
        console.log("exception reportes route KPI generacion", e)
        error = true;
    }

    if (!error)
        res.send({ error: false, fileName: fileName, message: "Archivo Generado con Exito.", buff: buff });
    else
        res.send({ error: true, message: "Problema al generar archivo." });
});

export default router;
