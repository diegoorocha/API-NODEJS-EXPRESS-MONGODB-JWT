// MIDDLEWARE PARA VERIFICAR SE O USUARIO ESTÁ AUTENTICADO OU NÃO!

const jwt = require('jsonwebtoken')
const secretConfig = require('../config/secretConfig') // CHAVE SECRETA!

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization // NA REQUISIÇÃO, VAI BUSCAR O HEADER AUTHORIZATION!
    // NESTE CAMPO, ESTARÁ O TOKEN!

    if (!authHeader) // SE NÃO ENCONTRAR NO HEADER O CAMPO AUTHORIZATION!
        return res.status(401).send({ error: 'Token não autorizado!!' }) // RETORNO!

    const parts = authHeader.split(' ') // SEPARAR O TOKEN EM 2 PARTES!
    // PARTE 1 = BEARER
    // PARTE 2 = TOKEN
    // FICANDO: 'PARTE1 PARTE2' (DIVIDIDO UM PARA CADA LADO)!
    if (!parts.lenght === 2) // SE PARTS NÃO TIVER 2 PARTES (PARTE 1 = BEARER ... PARTE 2 = TOKEN)!
        return res.status(401).send({ error: 'Erro ao verificar o token!!' }) // RETORNO CASO NÃO ENCONTRE AS 2 PARTES!

    const [scheme, token] = parts
    // SCHEME = PARTE 1 = BEARER!
    // TOKEN = PARTE 2 = TOKEN!

    if (!/^Bearer$/i.test(scheme)) // UTILIZANDO REGEX PARA VERIFICAR SE SCHEME COMEÇA COM A PALAVRA "BEARER"!
        return res.status(401).send({ error: 'Token mal formatado!!' }) // RETORNO CASO A PARTE 1 = SCHEME NÃO COMEÇE COM BEARER!

    jwt.verify(token, secretConfig.KEY, (err, decoded) => { // VERIFICAR SE O TOKEN INFORMADO E A CHAVE SECRETA SÃO CORRESPONDENTES!
        if (err) // SE HOUVER ERRO!
            return res.status(401).send({ error: 'Token Invalido!!' }) // RETORNO DO ERRO!

        req.userId = decoded.id // SE O TOKEN INFORMADO ESTIVER OK, SERA ATRELADO AO USER.ID PARA USAR NA ROTA AUTENTICADA!
        return next()
    })
}

// INFORMAÇÕES IMPORTANTES:

// 1 - TODOS OS TOKENS COMEÇAM COM A PALAVRA (BEARER)!
// EXEMPLO: BEARERadf81a7dce923e4d7e96c35dc4edbc1b66594c40
// PARTE 1 = BEARER (SCHEME)
// PARTE 2 = adf81a7dce923e4d7e96c35dc4edbc1b66594c40 (TOKEN)

// 2 - REGEX
// UTILIZANDO A REGEX PARA VERIFICAR SE A PARTE 1 = SCHEME = BEARER!
// IF (!/^Bearer$/i)
// INICIO REGEX = ^ ... ^
// PALAVRA PROCURADA = BEARER
// I = CASE INSENSITIVE (TANTO FAZ MAIUSCULA / MINUSCULA)
// FIM REGEX = .../$^