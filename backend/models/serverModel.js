import mongoose from 'mongoose';

const serverSchema = new mongoose.Schema({
    pubKey: { type: String, required: true },
    privKey: { type: String, required: true },
    passphrase: { type: String, required: true },
})

const serverModel = mongoose.model('Server', serverSchema);

export default serverModel;