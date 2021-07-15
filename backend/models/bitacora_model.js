import mongoose from 'mongoose';


const bitacorasSchema = new mongoose.Schema({
    bitacora_id: { type: String, required: true, unique: true, dropDups: true },
    usuario: { type: String, required: true },
    ut_id: { type: String, required: false },
    actividad: { type: String, required: false },
    tipo_actividad: { type: String, required: false },
    sitio_relacionado: { type: String, required: false },
    proyecto_relacionado: { type: String, required: false },
    fecha: { type: Date},
});

const bitacorasModel = mongoose.model("Bitacoras", bitacorasSchema);
export default bitacorasModel;