// SERVIÇO DE EMAIL!

const nodemailer = require('nodemailer')
const path = require('path') // RESOLVER CONFLITOS DE CAMINHOS!
const hbs = require('nodemailer-express-handlebars') // HANDLEBARS PARA TEMPLATE ENGINE EMAIL!

const { host, port, user, pass } = require('../config/mailConfig') // CONFIGURAÇÕES PARA CONEXÃO DO EMAIL (MAILTRAP!)

// CONEXÃO DO SERVIÇO DE EMAIL (CONECTADO NO MAILTRAP PARA TESTES!)
const transport = nodemailer.createTransport({
    host,
    port,
    auth: {
        user,
        pass
    }
})

// CONFIGURANDO O HANDLEBARS PARA A TEMPLATE ENGINE DO EMAIL!
transport.use('compile', hbs({
    viewEgine: 'handlebars', // TEMPLATE ENGINE!
    viewPath: path.resolve('./resources/mail'), // LOCAL DOS TEMPLATE DE EMAIL!
    extName: '.html' // EXTENSÃO DO TEMPLATE DE EMAIL!
}))

module.exports = transport

