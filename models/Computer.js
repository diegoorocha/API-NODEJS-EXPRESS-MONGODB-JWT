const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ComputerSchema = new Schema({
    date: { // DATA DO IMPUT DA INFORMAÇÃO!
        type: Date,
        default: Date.now
    },
    user: { // USUARIO RESPONSAVEL PELO ENVIO DAS INFORMAÇÕES!
        type: mongoose.SchemaTypes.ObjectId, // ID DO USUARIO NA COLEÇÃO COMPUTER!
        ref: 'User', // REFERENCIA A COLEÇÃO (USER)
        require: true // RELAÇÃO ENTRE AS COLEÇÕES (USER E COMPUTER) É OBRIGATÓRIA!
    },
    fabricant: { // FABRICANTE 
        type: String,
        required: true,
        uppercase: true, // LETRA MAIUSCULA!
        trim: true // RETIRA OS ESPAÇOS EM BRANCO!
    },
    typeEquipament: { // TIPO DO EQUIPAMENTO! (NOTEBOOK OU DESK)
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    modelEquipament: { // MODELO DO EQUIPAMENTO (OPTPLEX ... VOSTRO ... ETC)
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    serialNumber: { // SERIAL DO EQUIPAMENTO!
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    hostName: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    patrimony: { // PATRIMONIO DA MAQUINA!
        type: Number,
        required: true,
        trim: true
    },
    department: { // DEPARTAMENTO DE ORIGEM!
        type: String,
        required: true,
        trim: true
    },

    clients: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Client',
    }]

}, {
        timestamps: true // CRIA AUTOMATICAMENTE O CREATAT, UPDATEAT!
    })

const Computer = mongoose.model('Computer', ComputerSchema)
module.exports = Computer