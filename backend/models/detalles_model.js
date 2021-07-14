import mongoose from 'mongoose';


const detallesingsSchema = new mongoose.Schema({
    sitio_codigo: { type: String, required: false, unique: true, dropDups: true },
    sitio_nombre: { type: String, required: false },
    proyecto: { type: String, required: false },
    provincia: { type: String, required: false },
    pais: { type: String, required: false },
    departamento: { type: String, required: false },
    municipio: { type: String, required: false },
    altura_validada: { type: String, required: false },
    altura_pararrayos: { type: String, required: false },
    resistencia_viento: { type: String, required: false },
    tipo_estructura: { type: String, required: false },
    tx: { type: String, required: false },
    latitud_validada_grados: { type: String, required: false },
    longitud_validada_grados: { type: String, required: false },
    numero_finca: { type: String, required: false },
    numero_documento_finca: { type: String, required: false },
    direccion_sitio: { type: String, required: false },
    arrendatario: { type: String, required: false },
    identificacion_arrendatario: { type: String, required: false },
    area_arrendada: { type: String, required: false },
    area_a_utilizar: { type: String, required: false },
    tipologia_sitio: { type: String, required: false },
    orientacion_torre: { type: String, required: false } , 
    derecho_paso_sitio: { type: String, required: false },  
    electricidad_sitio: { type: String, required: false }  
});

const detallesingsModel = mongoose.model("Detallesings", detallesingsSchema);
export default detallesingsModel;