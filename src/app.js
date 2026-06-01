// Arquivo responsável por criar e configurar a aplicação Express.

// Importamos o Express.
import express from "express";

// Importamos as rotas de autenticação.
import authRoutes from "./routes/auth.routes.js";

// Importamos as rotas de usuários.
import usuarioRoutes from "./routes/usuario.routes.js";

// Middleware central de erro.
import erroMiddleware from "./middlewares/erro.middleware.js";

// Helper para criar erro de rota não encontrada.
import criarErro from "./utils/criarErro.js";

// Criamos a aplicação Express.
const app = express();

// Middleware nativo do Express para ler JSON no corpo das requisições.
app.use(express.json());

// Rota inicial apenas para testar se a API está rodando.
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Boilerplate API MVC está rodando.",
    rotas: {
      cadastro: "POST /api/auth/cadastro",
      login: "POST /api/auth/login",
      perfil: "GET /api/usuarios/perfil",
    },
  });
});

// Todas as rotas de autenticação começam com /api/auth.
app.use("/api/auth", authRoutes);

// Todas as rotas de usuário começam com /api/usuarios.
app.use("/api/usuarios", usuarioRoutes);

// Se nenhuma rota acima responder, esta função será executada.
// Ela cria um erro 404 e envia para o middleware de erro.
app.use((req, res, next) => {
  return next(criarErro("Rota não encontrada.", 404));
});

// Middleware de erro precisa ficar por último.
// Ele recebe erros gerados nos controllers, services, middlewares e rota 404.
app.use(erroMiddleware);

// Exportamos app para o server.js iniciar o servidor.
export default app;
