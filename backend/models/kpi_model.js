import mongoose from 'mongoose';
import { fechaRegional, fechaRegionalInput } from '../fechas';

const horaTurnoSchema = new mongoose.Schema({
    hora_entrada: { type: Number, default: 8.0001 },
    minutos_entrada: { type: Number, default: 0.0 },
    hora_salida: { type: Number, default: 18.0001 },
    minutos_salida: { type: Number, default: 0.0 },
    hora_entrada_sabado: { type: Number, default: 9.0001 },
    minutos_entrada_sabado: { type: Number, default: 0.0 },
    hora_salida_sabado: { type: Number, default: 13.0001 },
    minutos_salida_sabado: { type: Number, default: 0.0 },
});

//  const hora =  fechaRegional()

const hora = fechaRegional(process.env.TIMEZONE_OFFSET);//fechaRegionalInput(`${fechaRegional().toISOString().substr(0,10)}T18:00:00.000+00:00`,0)//process.env.TIMEZONE_OFFSET)//esto pone hora 00.00
//  const hora1 = hora.setHours(18);
//  const hora2 = hora.setMinutes(0);
//  const hora3 = hora.setSeconds(0);
hora.setUTCHours(18, 0, 0, 0);
// console.log('hora', hora)
const horaEntradaSchema = new mongoose.Schema({
    fechaUTC: { type: Date, required: false, default: hora },
    hora_decimal: { type: Number, required: true, default: 8.0 },
    hora: { type: Number, required: true, default: 8.0 },
    minutos: { type: Number, required: true, default: 0.0 },
    latitude: { type: String, required: false },
    longitude: { type: String, required: false },
    
});

// console.log('horaEntradaSchema', horaEntradaSchema)

const horaSalidaSchema = new mongoose.Schema({
    fechaUTC: { type: Date, required: false, default: hora },
    hora_decimal: { type: Number, required: true, default: 18.0 },
    hora: { type: Number, required: true, default: 18.0 },
    minutos: { type: Number, required: true, default: 0.0 },
    latitude: { type: String, required: false },
    longitude: { type: String, required: false },
});

const horaSchema = new mongoose.Schema({
    fechaUTC: { type: Date, required: false },
    hora_decimal: { type: Number, required: false },
    hora: { type: Number, required: false },
    minutos: { type: Number, required: false },
    latitude: { type: String, required: false },
    longitude: { type: String, required: false },
});

const kpisSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ut_id: { type: String, required: true },
    uniqueId: { type: String, required: true, unique: true, dropDups: true },
    fecha: { type: Date, required: false },
    semana: { type: Number, required: false },
    dia_semana: { type: Number, required: false },
    status_almuerzo: { type: Number, required: false, default: 0 },
    status_permiso: { type: Number, required: false, default: 0 },
    status_incapacidad: { type: Number, required: false, default: 0 },
    marco_entrada: { type: Boolean, required: false, default: false },
    marco_salida: { type: Boolean, required: false, default: false },
    cambio_jornada: { type: Boolean, required: false, default: false },
    hora_entrada_mostrada_hoy: { type: Boolean, required: false, default: false },
    hora_almuerzo_entrada: horaSchema,
    hora_almuerzo_salida: horaSchema,
    hora_permiso_entrada: horaSchema,
    hora_permiso_salida: horaSchema,
    hora_incapacidad_entrada: horaSchema,
    hora_incapacidad_salida: horaSchema,
    hora_turno: horaTurnoSchema,
    hora_entrada: horaEntradaSchema,
    hora_salida: horaSalidaSchema,
    puntualidad: { type: Number, required: false },
    salida_autorizada: { type: Boolean, required: false, default: false },
    fuera_jornada: { type: Number, required: false },
    asistencia_juntas: { type: String, required: false },
    animoAM: { type: Number, required: false },
    animoPM: { type: Number, required: false },
});

const kpisModel = mongoose.model("KPIs", kpisSchema);
export default kpisModel;