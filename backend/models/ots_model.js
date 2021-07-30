import mongoose from 'mongoose';


const otsSchema = new mongoose.Schema({
    ot_number: { type: String, required: true, unique: true, dropDups: true },
    pais: { type: String, required: false },
    cliente: { type: String, required: false },
    sitio_codigo: { type: String, required: false },
    sitio_nombre: { type: String, required: false },
    proyecto: { type: String, required: false },
    responsable_cliente: { type: String, required: false },
    email_responsable_cliente:  { type: String, required: false },
    requerimiento: { type: String, required: false },
    detalle_requerimiento: { type: String, required: false },
    prioridad: { type: String, required: false },
    estado: { type: String, required: true },
    fecha_requerida: { type: Date, required: false },
    fecha_sla: { type: Date, required: false },
    fecha_apertura:  { type: Date, required: false },
    fecha_entregado:  { type: Date, required: false },
    responsable_ot: { type: String, required: false },
    email_responsable_ot:  { type: String, required: false },
    comentarios_responsable_ot: { type: String, required: false },
    archivos: { type: Array, required: false},
    ingenieria: { type: Array, required: false},

    
});

const otsModel = mongoose.model("OTs", otsSchema);
export default otsModel;



