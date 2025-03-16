import mongoose from "mongoose";

const agentsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
}, { minimize: false })

const agentsModel =  mongoose.models.agents || mongoose.model('agents', agentsSchema);

export  default agentsModel;