// Controller é a camada que recebe req/res e chama o service.
// Aqui ficam os endpoints de autenticação: cadastro e login.
import AuthService from "../services/auth.service.js";

// Controller do cadastro.
async function cadastrar(req, res, next) {
  try {
    // Enviamos o body para o service, onde ficam as regras de negócio.
    const resultado = await AuthService.cadastrar(req.body);

    // Cadastro criado com sucesso retorna status 201.
    return res.status(201).json(resultado);
  } catch (error) {
    // Se der erro, passamos para o middleware central de erro.
    return next(error);
  }
}

// Controller do login.
async function login(req, res, next) {
  try {
    // O service valida email/senha e gera o token.
    const resultado = await AuthService.login(req.body);

    // Login bem-sucedido retorna status 200.
    return res.status(200).json(resultado);
  } catch (error) {
    // Qualquer erro segue para o middleware central de erro.
    return next(error);
  }
}

// Exportamos as funções para serem usadas nas rotas.
export default {
  cadastrar,
  login,
};
