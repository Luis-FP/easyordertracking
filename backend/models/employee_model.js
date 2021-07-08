import mongoose from 'mongoose';

const vistaSchema = new mongoose.Schema([{

    proyecto: { type: String, required: false },
    nivel: { type: String, required: false },

}]);



const userSchema = new mongoose.Schema({

    ut_id: { type: String, required: true, unique: true, dropDups: true },
    email: { type: String, required: true, unique: true, dropDups: true },
    nombre: { type: String, required: false },
    apellido: { type: String, required: false },
    empresa: { type: String, required: false },
    oficina: { type: String, required: false },
    password: { type: String, required: true },
    terms_cond_acepted: { type: Boolean, required: false, default: false },

    grupo: { type: String, required: false },
    vista: {vistaSchema},
    isSuper: { type: Boolean, required: true, default: false },
    isHiper: { type: Boolean, required: true, default: false },
    isActive: { type: Boolean, required: true, default: false },

    
    salt: { type: String, required: true },
    passphrase: { type: String, required: true },
    verificationHash: { type: String, required: false },

    lastRecover: { type: Date, required: false },
    pubKey: { type: String, required: false },
    privKey: { type: String, required: false },
    creationDate: { type: Date, required: false },
    modificationDate: { type: Date, required: false },

});

const userModel = mongoose.model('User', userSchema);

export default userModel;
