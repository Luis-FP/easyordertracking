import mongoose from 'mongoose';


const bitacorasSchema = new mongoose.Schema({
    cliente: { type: String, required: true },
    codigo: { type: String, required: false },
    nombre_sitio: { type: String, required: false },
    provincia: { type: String, required: false },
    tipo_sitio: { type: String, required: false },
    altura_validada: { type: String, required: false },
    resistencia: { type: String, required: false },
    tipo_transmision: { type: String, required: false },
    latitud_validada: { type: String, required: false },
    longitud_validada: { type: String, required: false },
    estatus: { type: String, required: false },
    fases_terminadas: { type: String, required: false },
    fases_activas: { type: String, required: false },
    fecha_inicio:  { type: Date},
    fecha_busqueda:  { type: Date},
    fecha_validacion_tecnica:  { type: Date},
    fecha_negociacion:  { type: Date},
    fecha_validacion_legal:  { type: Date},
    fecha_inicio_permiso_asep:  { type: Date},
    fecha_fin_permiso_asep:  { type: Date},
    fecha_inicio_ambiente:  { type: Date},
    fecha_fin_ambiente:  { type: Date},
    fecha_inicio_aac:  { type: Date},
    fecha_fin_aac:  { type: Date},
    vob_anteproyecto_bomberos:  { type: Date},
    permiso_construccion:  { type: Date},
});

const bitacorasModel = mongoose.model("Bitacoras", bitacorasSchema);
export default bitacorasModel;