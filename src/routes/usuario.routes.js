// Router permite criar um conjunto separado de rotas de usuário.
import { Router } from "express";

// Controller com as ações relacionadas aos usuários.
import UsuarioController from "../controllers/usuario.controller.js";

// Middleware que valida o token JWT.
import autenticar from "../middlewares/autenticacao.middleware.js";

// Criamos o roteador de usuários.
const router = Router();

// Todas as rotas abaixo desta linha exigem token JWT.
// Isso evita repetir "autenticar" em cada rota.
router.use(autenticar);

// GET /api/usuarios
// Lista usuários cadastrados.
router.get("/", UsuarioController.listar);

// GET /api/usuarios/perfil
// Retorna os dados do usuário logado.
router.get("/perfil", UsuarioController.perfil);

// PATCH /api/usuarios/perfil
// Atualiza nome e/ou senha do usuário logado.
router.patch("/perfil", UsuarioController.atualizarPerfil);

// DELETE /api/usuarios/perfil
// Remove a conta do usuário logado.
router.delete("/perfil", UsuarioController.removerMinhaConta);

// Exportamos o roteador para o app.js.
export default router;
