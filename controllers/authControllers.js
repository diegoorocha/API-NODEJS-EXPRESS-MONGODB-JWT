// CONTROLLERS PARA USUÁRIOS NÃO LOGADOS!
const User = require('../models/User') // MODELS (SCHEMA) DE USUÁRIOS (CADASTRO)!
const bcrypt = require('bcryptjs') // ENCRIPTAR A SENHA (PASSWORD) NA SUA CRIAÇÃO!
const jwt = require('jsonwebtoken') // GERADOR DE TOKENS!
const crypto = require('crypto') // CRIPTOGRAFA SENHA (PASSWORD)! NATIVO NODEJS

const mailService = require('../services/mailer') // SERVIÇO DE EMAIL!
const secretConfig = require('../config/secretConfig') // CHAVE SECRETA PARA A GERAÇÃO DE TOKEN!

// CRIAR/GERAR TOKEN!
function generateToken(params = {}) { // TODOS OS PARAMETROS DO MODEL USER ATRIBUIDO A UM OBJETO VAZIO!
    return jwt.sign(params, secretConfig.KEY, { // RETORNA(ID UNICO) OS PARAMETROS CRIPTOGRAFADOS COM A CHAVE SECRETA!
        expiresIn: 86400 // TEMPO DE EXPIRAÇÃO APÓS A GERAÇÃO DO TOKEN!
    })
}

// REGISTRAR NOVOS USUÁRIOS!
exports.addNewUser = async (req, res) => {
    const { email } = req.body //RECEBENDO O EMAIL!

    try {
        if (await User.findOne({ email })) // VALIDAR SE HÁ DUPLICIDADE NO EMAIL VINDO DO REQ.BODY (DIGITADO PELO USUARIO)!
            return res.status(400).send({ error: 'Usuário(email) já existe!' }) // RETORNO SE O EMAIL INFORMADO JÁ ESTIVER CADASTRADO!

        const user = await User.create(req.body) // SE NÃO HOUVER DUPLICIDADE DE EMAIL, A CONTA É CRIADA!

        user.password = undefined // APÓS A CRIAÇÃO, NA RESPOSTA(RES) NÃO É EVIDENCIADO O CAMPO PASSWORD!

        return res.send({ user, token: generateToken({ id: user.id }) }) // RETORNO APÓS CRIAÇÃO DO USUARIO E O TOKEN GERADO PARA O ID DO USUARIO CRIADO!
        // RETORNANDO O TOKEN GERADO NA CRIAÇÃO DO USUARIO, O TOKEN FICA ARMAZENADO PARA LOGAR AUTOMATICAMENTE (RESPEITANDO O PRAZO DE 24H PARA EXPIRAR!)

    } catch (err) { // SE HOUVER ERRO!
        console.log(err) // MOSTRAR O ERRO NO CONSOLE (CASO HOUVER!)
        return res.status(400).send({ error: 'Falha no registro!!' }) // RETORNO DO ERRO CASO NÃO TENHA CADASTRO/TOKEN!
    }
}

// AUTENTICAR USUARIOS!
exports.authenticateUser = async (req, res) => {
    const { email, password } = req.body // RECEBER EMAIL E SENHA DIGITADOS!

    const user = await User.findOne({ email }).select('+password') // PROCURAR O EMAIL NO BANCO DE DADOS E A SENHA CORRESPONDENTE!
    // UTILIZADO O .SELECT('+PASSWORD') POIS NO MODEL USER, PASSWORD ESTÁ COMO SELECT FALSE!
    // NECESSÁRIO UTILIZAR O .SELECT('+PASSWORD') PARA BUSCAR/MOSTRAR O CAMPO!

    if (!user) // SE NÃO ACHAR O USUARIO (EMAIL DIGITADO!)
        return res.status(400).send({ error: 'Usuário não existe!!' }) // RETORNO SE O USUÁRIO (EMAIL) NÃO FOR LOCALIZADO!

    if (!await bcrypt.compare(password, user.password)) // COMPARAR A SENHA CADASTRADA COM A SENHA DIGITADA!
        // UTILIZADO O BCRYPT POIS A SENHA ESTA CRIPTGRAFADA!
        return res.status(400).send({ error: 'Senha invalida!!' }) // RETORNO CASO A COMPARAÇÃO DAS SENHAS (BANCO DADOS E DIGITADA) NÃO FOREM IGUAIS!

    user.password = undefined // NÃO VAI RETORNAR A SENHA CASO O USUARIO SE AUTENTICAR!

    // GERANDO O TOKEN PARA AUTENTICAÇÃO!
    const token = jwt.sign({ id: user.id }, secretConfig.KEY, {
        // GERANDO O TOKEN NO ID DO USUARIO UTILIZANDO A KEY SECRET!
        expiresIn: 84600
        // O TOKEN EXPIRA EM 24H APÓS O LOGIN!
    })
    res.send({ user, token: generateToken({ id: user.id }) }) // RETORNA O TOKEN GERADO ATRELADO AO ID (UNICO!)
}

// RESET DE SENHA!
exports.passwordReset = async (req, res) => {
    const { email, password, token } = req.body // RECEBE O EMAIL E O PASSWORD DIGITADOS PELO USUARIO E O TOKEN SALVO NO STORAGELOCAL!

    try {
        const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires') // VERIFICAR SE O EMAIL É CADASTRADO(EXISTE)
        // VERIFICAR O PASSWORD RESET TOKEN (GERADO NA SOLICITAÇÃO DO RESET) E
        // VERIFICAR O PASSWORD RESET EXPIRES (DATA DE EXPIRAÇÃO DO TOKEN GERADO)

        if (!user) // SE O EMAIL(USUARIO NÃO EXISTIR)!
            return res.status(400).send({ error: 'Usuário não existe!!' }) // RETORNO SE O USUARIO NÃO EXISTIR!

        if (token !== user.passwordResetToken) // VERIFICA SE O TOKEN DO USUARIO E O TOKEN GERADO NO PASSWORDRESETTOKEN SÃO CORRESPONDENTES!
            return res.status(400).send({ error: 'Token invalido!!' }) // RETORNO SE OS TOKENS NÃO FOREM CORRESPONDENTES!

        // VERIFICAR O PASSWORDRESETEXPIRES (DATA)
        const now = new Date() // VERIFICAR A DATA DE AGORA!
        if (now > user.passwordResetExpires) // SE A DATA AGORA É MAIOR QUE A DATA DO TOKEN GERADO!
            return res.status(400).send({ error: 'Token expirado!!' }) // RETORNO SE A DATA AGORA FOR MAIOR QUE A DATA DO TOKEN!
        // SE O TOKEN ESTIVER EXPIRADO, NECESSÁRIO SE AUTENTICAR NOVAMENTE!

        user.password = password // SE DER TUDO CERTO, ATRIBUI O NOVO PASSWORD DIGITADO PARA O PASSWORD NO BANCO DADOS!

        await user.save() // SALVA O NOVO PASSWORD DIGITADO NO BANCO!
        res.send({ true: 'Senha alterada!' }) // RETORNO DA SENHA SALVA NO BANCO DADOS!

    } catch (err) { // ERRO NO PROCESSO PARA RESETAR SENHA!
        console.log(err) // EVIDENCIAR O ERRO NO CONSOLE!
        return res.status(400).send({ error: 'Não foi possivel resetar a senha!!' }) // RETORNO DO ERRO!
    }
}

// ESQUECEU A SENHA!
// OBS: SERÁ CRIADO UM SERVIÇO DE EMAIL PARA REALIZAR O PROCESSO! (NODEMAILER E MAILTRAP[CAIXA DE EMAIL FAKE PARA TESTES!])
// PROCESSOS: SERÁ ENVIADO UM EMAIL PARA O USUÁRIO COM UM TOKEN GERADO PARA SOMENTE PARA ESTE FIM (ESQUECEU A SENHA!)
// PROCESSOS1: O USUARIO INFORMARA O TOKEN, E A NOVA SENHA!

// UTILIZADO [NODEMAILER{SERVIÇO DE EMAIL} E NODEMAILER-EXPRESS-HANDLEBARS{CRIAÇÃO DA TEMPLATE}]!

exports.forgotPassword = async (req, res) => {
    const { email } = req.body // RECEBENDO O EMAIL DIGITADO!

    try { // VERIFICAÇÕES
        const user = await User.findOne({ email }) // VERIFICA SE O EMAIL(USUARIO) DIGITADO EXISTE!

        if (!user) // SE O USUARIO(EMAIL) NÃO EXISTIR!
            return res.status(400).send({ error: 'Usuário não existe!!' }) // RETORNO SE O USUARIO(EMAIL) NÃO EXISTE!

        // GERAR UM TOKEN COM 20 CARACTERES PARA REALIZAR A ALTERAÇÃO DO PASSWORD!
        const token = crypto.randomBytes(20).toString('hex') //TOKEN EM HEXADECIMAL!

        //TEMPO DE EXPIRAÇÃO DO TOKEN!
        const now = new Date() // DATA AGORA!
        now.setHours(now.getHours() + 1) //PEGA A DATA AGORA E SETAR MAIS 1 HORA (FUTURO!)

        await User.findByIdAndUpdate(user.id, { // REFERENCIA O USER.ID(ID DO USUARIO!)
            '$set': { // SELECIONANDO OS CAMPOS QUE SERÃO ALTERADOS!
                passwordResetToken: token, // O CAMPO PASSWORDRESETTOKEN VAI RECEBER O TOKEN GERADO!
                passwordResetExpires: now, // VAI RECEBER A DATA DE EXPIRAÇÃO (DATA AGORA + 1 HORA)
            }
        })
        // ENVIANDO O EMAIL PARA ALTERAR/RECUPERAR A SENHA!
        mailService.sendMail({
            to: email, // VAI ENVIAR O EMAIL PARA O EMAIL DIGITADO PELO USUARIO, VINDO DE REQ.BODY!
            from: 'no-reply@no-reply.com.br', // EMAIL DE ENVIO!
            template: 'forgot_password', // CAMINHO(NOME) DA TEMPLATE DE EMAIL!
            context: { token, }, // VARIAVEIS DENTRO DA TEMPLATE DE EMAIL!
        },
            (err) => { // SE HOUVER ERRO!
                if (err)
                    //console.log(err) // EVIDENCIAR O ERRO NO CONSOLE!
                    return res.status(400).send({ error: 'Não foi possivel enviar e-mail para resetar a senha!!' }) // RETORNO SE HOUVER ERRO!

                // SE NÃO TIVER ERRO!
                return res.send({ true: 'Email enviado com sucesso!' }) // RETORNO SE NÃO HOUVER ERRO!
            })
    } catch (err) { // SE HOUVER ERRO!
        console.log(err) // EVIDENCIAR O ERRO NO CONSOLE!
        return res.status(400).send({ error: 'Erro ao resetar a senha!!' }) // RETORNO SE HOUVER ERRO!
    }
}