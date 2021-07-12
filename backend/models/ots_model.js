import mongoose from 'mongoose';


const otsSchema = new mongoose.Schema({
    ot_number: { type: String, required: true, unique: true, dropDups: true },
    pais: { type: String, required: true },
    cliente: { type: String, required: true },
    sitio_codigo: { type: String, required: true },
    sitio_nombre: { type: String, required: true },
    proyecto: { type: String, required: true },
    responsable_cliente: { type: String, required: true },
    email_responsable_cliente:  { type: String, required: true },
    requerimiento: { type: String, required: true },
    detalle_requerimiento: { type: String, required: false },
    prioridad: { type: String, required: false },
    estado: { type: String, required: true },
    fecha_requerida: { type: Date, required: false },
    responsable_ot: { type: String, required: false },
    email_responsable_ot:  { type: String, required: false },
    comentarios_responsable_ot: { type: String, required: false },

    
});

const otsModel = mongoose.model("OTs", otsSchema);
export default otsModel;



