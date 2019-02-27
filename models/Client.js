const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClientSchema = new Schema({
    name: {
        type: String,
        required: true,
        uppercase: true
    },
    email: {
        type: String,
        required: true,
    },
    nickName: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    computer: { // EQUIPAMENTO QUE O USUARIO VAI RECEBER!
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Computer',
        required: true
    },
    clientExists: {
        type: Boolean,
        required: true,
        default: true
    }
})
const Client = mongoose.model('Client', ClientSchema)
module.exports = Client