// ============================================================================
// Middlewares de validação de campos
// ============================================================================
//
// Um middleware é uma função que roda ANTES do controller. Aqui temos dois,
// um para cada rota de autenticação. Cada um é um middleware COMUM, com a
// assinatura (req, res, next) — sem fábrica, sem função dentro de função.
//
// A ideia: conferir se o body trouxe os campos obrigatórios. Se faltar algum,
// encerramos a requisição com erro 400 e NEM chamamos o controller.

// Helper para criar erros padronizados (mensagem + status HTTP).
import criarErro from "../utils/criarErro.js";

// Middleware da rota de CADASTRO.
// O cadastro precisa de: nome, email e senha.
export function validarCadastro(req, res, next) {
  // Lemos os campos esperados no corpo da requisição.
  const { nome, email, senha } = req.body;

  // Conferimos um campo de cada vez, de cima para baixo.
  if (!nome) {
    return next(criarErro("O campo 'nome' é obrigatório.", 400));
  }

  if (!email) {
    return next(criarErro("O campo 'email' é obrigatório.", 400));
  }

  if (!senha) {
    return next(criarErro("O campo 'senha' é obrigatório.", 400));
  }

  // Está tudo certo: liberamos a requisição para seguir ao controller.
  return next();
}

// Middleware da rota de LOGIN.
// O login precisa de: email e senha.
export function validarLogin(req, res, next) {
  // Lemos os campos esperados no corpo da requisição.
  const { email, senha } = req.body;

  // Conferimos um campo de cada vez.
  if (!email) {
    return next(criarErro("O campo 'email' é obrigatório.", 400));
  }

  if (!senha) {
    return next(criarErro("O campo 'senha' é obrigatório.", 400));
  }

  // Está tudo certo: liberamos a requisição para seguir ao controller.
  return next();
}
