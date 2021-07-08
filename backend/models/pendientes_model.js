import mongoose from 'mongoose';


const pendientesSchema = new mongoose.Schema({
    // user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    ut_id: { type: String, required: false },
    fecha:  { type: Date},
    compromisoUTC:  { type: Date}, ///utc
    compromiso: { type: Date}, ///utc
    fecha_terminado:  { type: Date},
    pendiente: { type: String, required: false },
    entregable: { type: String, required: false },
    status: { type: String, required: false },
});

const pendientesModel = mongoose.model("Pendientes", pendientesSchema);
export default pendientesModel;