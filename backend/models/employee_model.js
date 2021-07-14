import mongoose from 'mongoose';

const vistaSchema = new mongoose.Schema([{

    proyecto: { type: String, required: true },
    nivel: { type: String, required: false },

}]);



const userSchema = new mongoose.Schema({

    ut_id: { type: String, required: true, unique: true, dropDups: true },
    email: { type: String, required: true, unique: true, dropDups: true },
    nombre: { type: String, required: false },

    empresa: { type: String, required: false },
    oficina: { type: String, required: false },
    password: { type: String, required: true },
    terms_cond_acepted: { type: Boolean, required: false, default: false },

    grupo: { type: String, required: false },
    vista: { type: Array, required: true},
    isSuper: { type: Boolean, required: true, default: false },
    isHiper: { type: Boolean, required: true, default: false },
    isInge: { type: Boolean, required: true, default: true },
    isUser: { type: Boolean, required: true, default: true },
    isActive: { type: Boolean, required: true, default: true },
    
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
