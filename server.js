const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const serverConfig = require('./config/serverConfig') // CONFIGURAÇÕES DO SERVER (PORTA, BANCO DE DADOS E HASH PASSWORD)!
const mongoConfig = require('./config/mongoConfig') //  CONFIGURAÇÕES DA CONEXÃO DO SERVER MONGOB (MLAB)!

const server = express() // SERVIDOR EXPRESS!

// CONFIG CORS!
server.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "X-Requested-With")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    next()
})

// MIDDLEWARE REQUISIÇÃO!
server.use(bodyParser.json()) // ANALISA REQUISIÇÕES EM JSON!
server.use(bodyParser.urlencoded({ extended: true })) // INFORMANDO O TIPO DE DADOS CODIFICADOS NA URL!

// CONTROLLER PARA ROTAS DE AUTENTICAÇÃO!
//const authController = require('./controllers/authController')

// ROTAS!
const authRoutes = require('./routes/authRoutes') // ROTA (CRIAR, AUTENTICAR, RESETAR SENHA)!
const loggedRoutes = require('./routes/loggedRoutes') // ROTA PARA USUARIOS JÁ CADASTRADOS E AUTENTICADOS!

// PREFIXO ROTAS!
server.use('/auth', authRoutes) // LOCALHOST:4000/AUTH <<< TUDO QUE COMEÇA COM ESTE PREFIXO, USA AUTHROUTES!
server.use('/computer', loggedRoutes) // PREFIXO PARA USUARIOS JÁ CADASTRADOS E AUTENTICADOS!


// CONEXÃO EXPRESS!
server.listen(serverConfig.PORT, () => {
    console.log('STATUS CONEXÃO SERVER EXPRESS: CONECTADO NA PORTA:' + serverConfig.PORT, '!')
})





