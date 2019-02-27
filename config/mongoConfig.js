const mongoose = require('mongoose')

const serverConfig = require('./serverConfig') // CONFIGURAÇÕES DO SERVER (PORTA, BANCO DE DADOS E HASH PASSWORD)!

// OPTIONS SETUP DO MONGOOSE!
const options = {
    useNewUrlParser: true
}

// DECLARANDO PROMISE GLOBAL MONGOOSE.PROMISE!
mongoose.Promise = global.Promise

// CONEXÃO COM O BANCO DADOS MLAB ONLINE!
mongoose.connect(serverConfig.MONGOKEY, options)
    .then(() => {
        console.log('STATUS CONEXÃO SERVER MONGODB: CONECTADO!') // MSG SE CONECTAR!
    })
    .catch((err) => {
        console.log('STATUS CONEXÃO SERVER MONGOB: NÃO CONECTADO, VERIFICAR O ERRO:', +err) // MSG SE HOUVER ERRO!
    })

module.exports = mongoose // EXPORTANDO TUDO QUE INICIA-SE COM MONGOOSE!