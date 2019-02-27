// ROTAS / CONTROLLERS SOMENTE COM USUARIO AUTENTICADO!
const express = require('express')

const Computer = require('../models/Computer') // MODEL COMPUTER !
const User = require('../models/User') // MODEL USER = QUEM CADASTROU O EQUIPAMENTO E CLIENT!
const Client = require('../models/Client') // MODEL CLIENT = QUEM USA O EQUIPAMENTO!


// INSERIR/CRIAR COMPUTADOR!
exports.newComputer = async (req, res) => {
    try { // VERIFICAÇÕES!
        const {
            fabricant,
            typeEquipament,
            modelEquipament,
            serialNumber,
            hostName,
            patrimony,
            department,
            clients, // REFERENCIAR O USUARIO RESPONSAVEL PELA MAQUINA!
        } = req.body // INFORMAÇÕES DIGITADAS VINDO DO REQ.BODY!

        if (await Computer.findOne({ serialNumber })) // PROCURAR O SERIALNUMBER!
            return res.status(400).send({ error: 'Este serial number já existe!!' }) // RETORNO SE ENCONTRAR O SERIAL!

        if (await Computer.findOne({ hostName })) //PROCURAR O HOSTNAME!
            return res.status(400).send({ error: 'Este hostname já existe!' }) // RETORNO SE ENCONTRAR O HOSTNAME!     

        const computer = await Computer.create({
            fabricant,
            typeEquipament,
            modelEquipament,
            serialNumber,
            hostName,
            patrimony,
            department,
            user: req.userId // INFORMA O USUARIO AUTENTICADO (MIDDLEWARE) E AUTOMATICAMENTE O RESPONSAVEL PELO IMPUT DA INFORMAÇÃO!
        })
        // CRIANDO E SALVANDO O CLIENT (USUARIO DA MAQUINA)!
        await Promise.all(clients.map(async client => { // VAI PERCORRER A COLEÇÃO CLIENT!
            const clientEquipament = new Client({ ...client, computer: computer._id }) // RECEBER TUDO DA COLEÇÃO CLIENTE = { ...CLIENT}
            // COMPUTER: COMPUTER._ID = O CAMPO COMPUTER RECEBE O ID DO COMPUTER. NO MONGO O OBJECT ID VEM SEMPRE COM (_ID) UNDERLINE!

            await clientEquipament.save()
            computer.clients.push(clientEquipament) // ADICIONANDO CLIENT(USUARIO) NO COMPUTER!
        }))
        await computer.save() // SALVANDO CLIENT!
        return res.send({ computer }) // RETORNO APÓS SALVAR! ENVIARA AS INFORMAÇÕES SALVADAS!

    } catch (err) { // SER DER ERRO AO TENTAR CRIAR AS INFORMAÇÕES!
        console.log(err)
        return res.status(400).send({ error: 'Erro ao criar informações!!' }) // RETORNO!
    }
}

// LISTAR TODOS OS COMPUTADORES!
exports.allComputer = async (req, res) => {

    try { // VERIFICAÇÕES!
        const computers = await Computer.find().populate(['user', 'clients']) // BUSCAR TODOS OS COMPUTADORES!
        // FIND = VAI BUSCAR TODOS OS COMPUTADORES.
        // POPULATE = VAI ADICIONAR TODAS AS INFORMAÇÕES DO USUARIO (VINDO DA COLEÇÃO USER)
        // USER ESTÁ DENTRO DE UM ARRAY!

        return res.send({ computers }) // RETORNA TODOS OS COMPUTADORES CADASTRADOS!

    } catch (err) { // SE DER ERRO AO TENTAR LOCALIZAR TODOS OS COMPUTADORES!
        console.log(err)
        return res.status(400).send({ error: 'Erro ao localizar os computadores!!' }) // RETORNO!
    }
}

// LISTAR TODOS OS COMPUTADORES PELO ID!
exports.allComputerId = async (req, res) => {

    try { //VERIFICAÇÕES!
        const computer = await Computer.findById(req.params.computerId).populate(['user', 'clients'])
        // REQ.PARAMS.COMPUTERID = O ID DO COMPUTADOR QUE QUEREMOS PROCURAR NO BANCO DE DADOS!
        // POPULATE VAI TRAZER AS INFORMAÇÕES DO USUARIO!

        return res.send({ computer }) // RETORNA O COMPUTADOR DO ID PROCURADO!

    } catch (err) {
        console.log(err)
        return res.status(400).send({ error: 'Erro ao localizar o computador!!' })
    }
}

// LISTAR TIPO(NOTEBOOK, DESKTOP, MONITOR) DE EQUIPAMENTO!
exports.computerType = async (req, res) => {
    try { // VERIFICAÇÕES!
        const computer = await Computer.find({ typeEquipament: req.params.typeEquipament }) // RECEBENDO PARAMETROS DIGITADOS E PROCURADO!

        if (computer == null || computer.length == 0) // SE O VALOR DIGITADO NÃO FOR ENCONTRADO E RETORNAR NULO(VAZIO)!
            return res.status(400).send({ error: 'Tipo de equipamento invalido!!' }) // RETORNO!


        return res.send({ computer }) // RETORNO CASO O TIPO DE COMPUTADOR, SEJA ENCONTRADO!

    } catch (err) { // SE DER ERRO!
        console.log(err)
        return res.status(400).send({ error: 'Erro ao tentar localizar tipo de equipamento!!' }) // RETORNO DO ERRO!
    }
}

// LISTAR OS EQUIPAMENTOS POR MARCA!!
exports.brandNameEquipament = async (req, res) => {
    try { // VERIFICAÇÕES!
        const computer = await Computer.find({ fabricant: req.body.fabricant }) // RECEBENDO PARAMETROS DIGITADOS E PROCURADO!

        if (computer == null || computer.length == 0) // SE O VALOR DIGITADO NÃO FOR ENCONTRADO E RETORNAR NULO(VAZIO)!
            return res.status(400).send({ error: 'Fabricante não localizado!!' }) // RETORNO!

        return res.send({ computer }) // RETORNO CASO O FABRICANTE DOS COMPUTADORES, SEJA ENCONTRADO!

    } catch (err) { // SE DER ERRO!
        console.log(err)
        return res.status(400).send({ error: 'Erro ao tentar localizar fabricante!!' }) // RETORNO DO ERRO!
    }
}

// QUANTIDADE DE TIPO DE EQUIPAMENTOS(NOTEBOOK, DESKTOP, MONITOR)
exports.allBrandName = async (req, res) => {
    try { // VERIFICAÇÕES
        const computer = await Computer.aggregate([
            {
                $group: { _id: "$typeEquipament", total: { $sum: 1 } }, // PESQUISAR TODOS OS TIPOS(NOTEBOOK, DESKTOP, MONITOR) DE EQUIPAMENTOS E SOMAR!
            }])

        return res.send({ computer }) // RETORNO COM CADA TIPO E SUA QUANTIDADE!

    } catch (err) { // SE DER ERRO!
        console.log(err)
        return res.status(400).send({ error: "Não foi possivel realizar esta operação!!" }) // RETORNO DO ERRO!

    }
}

// AGRUPAR POR MARCA(DELL ... AOC ... LENOVO), TIPO DE EQUIPAMENTO(NOTEBOOK ... DESKTOP ... MONITOR) E MOSTRAR SUAS QUANTIDADES!
exports.allMarcaVsFabricant = async (req, res) => {
    try { // VERIFICAÇÕES!
        const computer = await Computer.aggregate([
            {
                $group: {
                    _id: { Marca: "$fabricant", Tipo: "$typeEquipament" }, // AGRUPAR MARCA E TIPO DE EQUIPAMENTO!
                    Total: { $sum: 1 } // SOMAR SUAS QUANTIDADES!
                }
            }])
        return res.send({ computer }) // RETORNO COM MARCA/TIPO E QUANTIDADE!

    } catch (err) { // SE DER ERRO!
        console.log(err)
        return res.status(400).send({ error: "Não foi possivel realizar esta operação!!" }) // RETORNO DO ERRO!
    }
}

// QUANTIDADE TOTAL DE CADA EQUIPAMENTO!
exports.totalEquipament = async (req, res) => {
    try { // VERIFICAÇÕES!
        const computer = await Computer.aggregate([
            {
                $group: {
                    _id: { Equipamento: "$typeEquipament" }, // AGRUPAR POR TIPO DE EQUIPAMENTO!
                    Total: { $sum: 1 } // SOMAR SUAS QUANTIDADES!
                }
            }
        ])
        return res.send({ computer }) // RETORNO O TIPO E QUANTIDADE!
    } catch (err) { // SE DER ERRO!
        console.log(err)
        return res.status(400).send({ error: 'Não foi possivel realizar esta operação!!' }) // RETORNO DO ERRO!
    }
}

// QUANTIDADE DE TIPO(NOTEBOO ... DESKTOP ... MONITOR) DE EQUIPAMENTO POR DEPARTAMENTO(SUPORTE ... RH ... CLOUD)!
exports.equipamentDepartment = async (req, res) => {
    try { // VERIFICAÇÕES!
        const computer = await Computer.aggregate([
            {
                $match: { 'department': req.body.department } // RECEBENDO PARAMETROS DIGITADOS (NOME DO DEPARTAMENTO!)
            },
            {
                $group: { // AGRUPAR 
                    _id: {
                        Departamento: "$department", // MOSTRAR O SETOR PROCURADO!
                        Marca: "$fabricant", // MOSTRAR A MARCA!
                        Tipo: "$typeEquipament" // MOSTRA O TIPO DE EQUIPAMENTO (PRINCIPAL REFERENCIA DA BUSCA!)
                    },
                    Total: { $sum: 1 }, // SOMA OS EQUIPAMENTOS POR TIPO DE CADA DEPARTAMENTO!
                }
            }
        ])
        if (computer == null || computer.length == 0) // SE O VALOR DIGITADO NÃO FOR ENCONTRADO E RETORNAR NULO(VAZIO)!
            return res.status(400).send({ error: 'Departamento não localizado!' }) // RETORNO!

        return res.send({ computer }) // CASO DER TUDO OK!

    } catch (err) { // SE DER ERRO!
        console.log(err)
        return res.status(400).send({ error: 'Não foi possivel localizar realizar esta operação!!' }) //RETORNO DO ERRO!
    }
}

// LISTAR QUEM CADASTROU O EQUIPAMENTO POR USUARIO (ID)!
exports.listId = async (req, res) => {
    try {  // VERIFICAÇÕES
        const user = await User.findById(req.params.userId) // PROCURAR O ID DO USER(ADMIN CADASTRADO NO SISTEMA PARA IMPUT DE INFORMÇÕES).

        return res.send({ user }) // CASO OK, RETORNO!
    } catch (err) { // SE DER ERRO!
        console.log(err)
        return res.status(400).send({ error: 'Erro ao localizar o admin!!' }) // RETORNO DO ERRO!
    }
}


// LISTAR EQUIPAMENTOS POR USUARIO(CLIENT) (ID)!
exports.listUser = async (req, res) => {
    try { // VERIFICAÇÕES
        const client = await Client.findById(req.params.clientId).populate('computer') // PROCURAR O ID DO CLIENT(USUARIO DO EQUIPAMENTO) E AS INFORMAÇÕES DO COMPUTER.

        return res.send({ client }) // CASO OK, RETORNO!
    } catch (err) { // SE DER ERRO!
        console.log(err)
        return res.status(400).send({ error: 'Erro ao localizar usuário!!' }) // RETORNO DO ERRO!
    }
}

// ATUALIZAR EQUIPAMENTO CADASTRADO PELO ID!
exports.updateEquipament = async (req, res) => {
    try { // VERIFICAÇÕES!
        const {
            fabricant,
            typeEquipament,
            modelEquipament,
            serialNumber,
            hostName,
            patrimony,
            department,
            clients,
        } = req.body // RECEBENDO INFORMAÇÕES DIGITADAS!

        const computer = await Computer.findByIdAndUpdate(req.params.computerId, {
            fabricant,
            typeEquipament,
            modelEquipament,
            serialNumber,
            hostName,
            patrimony,
            department,
        }, {
                new: true // RETORNAR O VALOR ATUALIZADO (MONGOOSE)!
            })

        // ATUALIZANDO OS CLIENTES (USUARIOS)!
        computer.clients = [] // RECEBENDO O CLIENT(USUARIO) EM ARRAY!

        await Client.remove({ computer: computer._id }) // DELETANDO/REMOVENDO O CLIENT(USUARIO) DO COMPUTADOR ESPECIFICO!

        // CRIAR NOVO USUARIO (CLIENT)!
        await Promise.all(clients.map(async client => {
            const clientEquipament = new Client({ ...client, computer: computer._id }) // RECEBER TUDO DA COLEÇÃO CLIENTE = { ...CLIENT}
            // COMPUTER: COMPUTER._ID = O CAMPO COMPUTER RECEBE O ID DO COMPUTER. NO MONGO O OBJECT ID VEM SEMPRE COM (_ID) UNDERLINE!

            await clientEquipament.save() // SALVAR O CLIENT!
            computer.clients.push(clientEquipament) // ADICIONANDO CLIENT(USUARIO) NO COMPUTER!
        }))

        await computer.save() // SALVANDO AS ALTERAÇÕES!

        return res.send({ computer }) // RETORNO!

    } catch (err) { // SE DER ERRO!
        console.log(err)
        return res.status(400).send({ error: "Erro ao atualizar!!" }) // RETORNO DO ERRO!
    }
}

// REMOVER/DELETAR EQUIPAMENTO CADASTRADO PELO ID!
exports.deletEquipament = async (req, res) => {
    try { // VERIFICAÇÕES!
        await Computer.findByIdAndRemove(req.params.computerId) // RECEBER O PARAMETRO (ID) DO EQUIPAMENT A SER DELETADO!

        return res.send({ true: 'Equipamento deletado!!' }) // RETORNO OK!

    } catch (err) { // SE DER ERRO!
        console.log(err)
        return res.status(400).send({ error: 'Erro ao deletar equipamento!!' }) // RETORNO DO ERRO!
    }

}
