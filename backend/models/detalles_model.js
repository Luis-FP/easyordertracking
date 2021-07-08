import mongoose from 'mongoose';


const detallesSchema = new mongoose.Schema({
    num_sitio: { type: String, required: false },
    id_site: { type: String, required: false },
    cliente: { type: String, required: false },
    nombre_sitio: { type: String, required: false },
    latitud: { type: String, required: false },
    longitud: { type: String, required: false },
    departamento: { type: String, required: false },
    tx: { type: String, required: false },
    altura_nominal: { type: String, required: false },
    tipo_estructura: { type: String, required: false },
    velocidad_viento: { type: String, required: false },
    bucket: { type: String, required: false },
    tipo_sitio: { type: String, required: false },
    
});

const detallesModel = mongoose.model("Detalles", detallesSchema);
export default detallesModel;