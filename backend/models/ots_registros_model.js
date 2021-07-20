import mongoose from 'mongoose';


const ots_registrosSchema = new mongoose.Schema({
    ot_number: { type: String, required: false },
    estado: { type: String, required: true },
    fecha_registro: { type: Date, required: false },
    comentarios_responsable_ot: { type: String, required: false },
    detalle_requerimiento: { type: String, required: false },    
});

const ots_registrosModel = mongoose.model("OTSRegistros", ots_registrosSchema);
export default ots_registrosModel;



