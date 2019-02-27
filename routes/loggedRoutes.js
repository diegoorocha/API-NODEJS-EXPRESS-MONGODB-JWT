// ROTA PARA USUARIOS AUTENTICADOS!
const express = require('express')
const router = express.Router()

//MIDDLEWARE PARA VERIFICAR SE ESTÁ AUTENTICADO OU NÃO!
const authMiddleware = require('../middlewares/authMiddleware') // MIDDLEWARE DE AUTENTICAÇÃO!
const loggedController = require('../controllers/loggedControllers') // CONTROLE DE USUARIOS AUTENTICADOS!

router.use(authMiddleware) // TODAS AS ROTAS ABAIXO, USARAM O MIDDLEWARE!
router.post('/', loggedController.newComputer) // CRIAR NOVAS INFORMAÇÕES DO COMPUTADOR!
router.get('/', loggedController.allComputer) // ROTA PARA BUSCAR TODOS OS COMPUTADORES!
router.get('/computer_id/:computerId', loggedController.allComputerId) // ROTA PARA BUSCAR O COMPUTADOR PELO ID!
router.get('/type/:typeEquipament', loggedController.computerType) // ROTA PARA BUSCAR TIPO DE EQUIPAMENTO (NOTEBOOK, DESKTOP, MONITOR)!
router.get('/fabricant', loggedController.brandNameEquipament) // ROTA PARA BUSCAR MARCA/FABRICANTE DOS EQUIPAMENTOS!
router.get('/qtdEquipament', loggedController.allBrandName) // ROTA PARA MOSTRAR A QUANTIDADE DE CADA TIPO DE EQUIPAMENTO(NOTEBOOK, MONITOR, DESKTOP)!
router.get('/marcaVsFabricant', loggedController.allMarcaVsFabricant) // ROTA PARA MOSTRAR A QUANTIDADE DE CADA MARCA POR TIPO (DELL NOTEBOOK = 2 ... DELL DESKTOP = 10 ... AOC MONITOR = 4 ... ETC)!
router.get('/qtdEquipamentDepartment', loggedController.equipamentDepartment) // ROTA PARA MOSTRAR POR SETOR A QUANTIDADE DE EQUIPAMENTOS (NOTEBOOK, DESKTOP, MONITOR)
router.get('/totalEquipament', loggedController.totalEquipament) // ROTA PARA MOSTRAR O TOTAL DE CADA EQUIPAMENTO!
router.get('/userEquipament/:clientId', loggedController.listUser) // ROTA PARA MOSTAR O CLIENT(USUARIO) DE CADA EQUIPAMENTO PELO ID!
router.get('/userAdmin/:userId', loggedController.listId) // ROTA PARA MOSTRAR QUEM CRIOU O COMPUTER(EQUIPAMENT) E CLIENT (USUARIO DA MAQUINA)!
router.put('/updateEquipament/:computerId', loggedController.updateEquipament) // ROTA PARA ATUALIZAR EQUIPAMENTO PELO ID!
router.delete('/deleteEquipament/:computerId', loggedController.deletEquipament) // ROTA PARA DELETAR EQUIPAMENTO PELO ID!


module.exports = router