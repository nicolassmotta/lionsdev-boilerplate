// Router permite criar um conjunto de rotas separado para autenticação.
import { Router } from "express";

// Controller com as funções de cadastro e login.
import AuthController from "../controllers/auth.controller.js";

// Middleware que confere se os campos obrigatórios vieram no body.
import validarCampos from "../middlewares/validarCampos.middleware.js";

// Criamos o roteador de autenticação.
const router = Router();

// POST /api/auth/cadastro
// Primeiro valida os campos; depois chama o controller.
router.post("/cadastro", validarCampos(["nome", "email", "senha"]), AuthController.cadastrar);

// POST /api/auth/login
// Primeiro valida email/senha; depois chama o controller.
router.post("/login", validarCampos(["email", "senha"]), AuthController.login);

// Exportamos o roteador para ser usado no app.js.
export default router;
