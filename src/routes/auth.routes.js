// Router permite criar um conjunto de rotas separado para autenticação.
import { Router } from "express";

// Controller com as funções de cadastro e login.
import AuthController from "../controllers/auth.controller.js";

// Middlewares que conferem os campos obrigatórios de cada rota.
// São duas funções: uma para o cadastro e outra para o login.
import { validarCadastro, validarLogin } from "../middlewares/validarCampos.middleware.js";

// Criamos o roteador de autenticação.
const router = Router();

// POST /api/auth/cadastro
// Primeiro o middleware confere os campos; depois o controller faz o cadastro.
router.post("/cadastro", validarCadastro, AuthController.cadastrar);

// POST /api/auth/login
// Primeiro o middleware confere email/senha; depois o controller faz o login.
router.post("/login", validarLogin, AuthController.login);

// Exportamos o roteador para ser usado no app.js.
export default router;
