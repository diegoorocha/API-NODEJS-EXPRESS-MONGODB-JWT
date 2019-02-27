const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs') // ENCRIPTAR SENHA!

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true, // TODOS OS EMAILS SERÃO ENVIADOS EM CAIXA BAIXA!
        unique: true // O EMAIL TEM QUE SER UNICO POR USUARIO!
    },
    password: {
        type: String,
        required: true,
        select: false, // CAMPO NÃO SERÁ DEMONSTRADO EM NENHUMA REQUISIÇÃO!
    },
    passwordResetToken: { // AO SOLICITAR O RESET DE SENHA, O USUÁRIO RECEBE UM TOKEN!
        type: String,
        select: false
    },
    passwordResetExpires: { // DATA DE EXPIRAÇÃO DO TOKEN SOLICITADO PARA RESET DE SENHA!
        type: String,
        select: false
    }
}, {
        timestamps: true, // CRIA AUTOMATICAMENTE CAMPOS (CREATEAT E UPDATEAT)
    })

// CONFIGURANDO O BCRYPT PARA ENCRIPTAR A SENHA ANTES DE SER CRIADA!
UserSchema.pre('save', async function (next) {
    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

    next()
})
// FUNÇÃO .PRE('SAVE') ORIUNDA DO MONGOOSE UTILIZADA ANTES DE SALVAR NO BANCO!
// CONST HASH ESTÁ UTILIZANDO O BCRYPT.HASH(NOME DA FUNÇÃO) NO CAMPO PASSWORD!
// 10 = TOTAL DE TENTATIVAS!
// ATRIBUINDO O PASSWORD AO HASH!
// NEXT APÓS GERAR O HASH NO CAMPO PASSWORD!

const User = mongoose.model('User', UserSchema)
module.exports = User