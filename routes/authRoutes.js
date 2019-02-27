const express = require('express')
const router = express.Router()

const authController = require('../controllers/authControllers') // CONTROLLERS DA ROTA!


router.post('/register', authController.addNewUser) // ROTA PARA REGISTRAR NOVOS USUÁRIOS!
router.post('/authenticate', authController.authenticateUser) // ROTA PARA AUTENTICAR USUARIOS CADASTRADOS!
router.post('/reset_password', authController.passwordReset) // ROTA PARA RESETAR SENHA!
router.post('/forgot_password', authController.forgotPassword) // ROTA PARA GERAR NOVA SENHA (USUARIO ESQUECEU)!


module.exports = router