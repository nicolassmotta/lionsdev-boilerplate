// Controller é a camada que conhece req e res.
// Ele chama o service e envia a resposta HTTP.
import UsuarioService from "../services/usuario.service.js";

// Retorna o perfil do usuário logado.
async function perfil(req, res, next) {
  try {
    // req.usuario foi criado pelo middleware de autenticação depois de validar o JWT.
    const usuario = await UsuarioService.buscarPerfil(req.usuario.id);

    // Enviamos o usuário dentro de um objeto para manter o padrão da resposta.
    return res.status(200).json({ usuario });
  } catch (error) {
    // Erros são enviados para o middleware central.
    return next(error);
  }
}

// Lista todos os usuários.
async function listar(req, res, next) {
  try {
    // A regra de buscar/limpar usuários fica no service.
    const usuarios = await UsuarioService.listarUsuarios();

    // Retorna a lista em JSON.
    return res.status(200).json({ usuarios });
  } catch (error) {
    // Encaminha o erro para tratamento centralizado.
    return next(error);
  }
}

// Atualiza o perfil do usuário logado.
async function atualizarPerfil(req, res, next) {
  try {
    // Usamos o id do token e os dados enviados no body.
    const usuario = await UsuarioService.atualizarPerfil(req.usuario.id, req.body);

    // Retorna o usuário atualizado.
    return res.status(200).json({ usuario });
  } catch (error) {
    // Encaminha qualquer erro para o middleware de erro.
    return next(error);
  }
}

// Remove a conta do usuário logado.
async function removerMinhaConta(req, res, next) {
  try {
    // O service remove usando o id que veio do token.
    const resultado = await UsuarioService.removerMinhaConta(req.usuario.id);

    // Retorna mensagem de sucesso.
    return res.status(200).json(resultado);
  } catch (error) {
    // Encaminha o erro.
    return next(error);
  }
}

// Exportamos as funções para as rotas de usuário.
export default {
  perfil,
  listar,
  atualizarPerfil,
  removerMinhaConta,
};
