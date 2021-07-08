import mongoose from 'mongoose';


const otsSchema = new mongoose.Schema({
    ot_number: { type: String, required: true, unique: true, dropDups: true },
    pais: { type: String, required: false },
    cliente: { type: String, required: false },
    sitio_codigo: { type: String, required: false },
    sitio_nombre: { type: String, required: false },
    proyecto: { type: String, required: false },
    responsable: { type: String, required: false },
    email_responsable:  { type: String, required: true },
    requerimiento: { type: String, required: false },
    detalle_requerimiento: { type: String, required: false },
    prioridad: { type: String, required: false },
    estado: { type: String, required: false },
    fecha_requerida: { type: Date, required: false },

    
});

const otsModel = mongoose.model("OTs", otsSchema);
export default otsModel;



