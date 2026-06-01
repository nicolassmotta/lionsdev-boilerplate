// bcryptjs é usado aqui porque atualizar a senha também precisa gerar novo hash.
import bcrypt from "bcryptjs";

// Service conversa com repository, não diretamente com o Model.
import UsuarioRepository from "../repositories/usuario.repository.js";

// Helper para criar erros com status HTTP.
import criarErro from "../utils/criarErro.js";

// Remove campos que não devem ser enviados para o cliente.
function montarUsuarioSeguro(usuario) {
  // Transforma o documento do Mongoose em objeto comum.
  const usuarioSeguro = usuario.toObject();

  // Garante que a senhaHash nunca será devolvida na resposta.
  delete usuarioSeguro.senhaHash;

  // Remove o campo interno do Mongoose.
  delete usuarioSeguro.__v;

  // Retorna o usuário limpo.
  return usuarioSeguro;
}

// Validação simples de senha usada quando o aluno troca a senha.
function validarSenha(senha) {
  // A senha precisa ter pelo menos 6 caracteres.
  if (!senha || senha.length < 6) {
    throw criarErro("A senha deve ter pelo menos 6 caracteres.", 400);
  }
}

// Busca o perfil do usuário logado.
async function buscarPerfil(idDoUsuario) {
  // O id vem do token JWT, depois que o middleware de autenticação valida o token.
  const usuario = await UsuarioRepository.buscarPorId(idDoUsuario);

  // Se o token aponta para um usuário que não existe mais, retornamos 404.
  if (!usuario) {
    throw criarErro("Usuário não encontrado.", 404);
  }

  // Devolvemos apenas dados seguros.
  return montarUsuarioSeguro(usuario);
}

// Lista todos os usuários cadastrados.
async function listarUsuarios() {
  // Busca todos no banco.
  const usuarios = await UsuarioRepository.listarTodos();

  // Limpa cada usuário antes de devolver.
  return usuarios.map((usuario) => montarUsuarioSeguro(usuario));
}

// Atualiza o perfil do usuário logado.
async function atualizarPerfil(idDoUsuario, dados = {}) {
  // Montamos um objeto apenas com os campos permitidos.
  // Assim evitamos atualizar campos que o usuário não deveria controlar.
  const dadosAtualizados = {};

  // Se veio nome, limpamos espaços extras e preparamos para atualizar.
  if (dados.nome) {
    dadosAtualizados.nome = dados.nome.trim();
  }

  // Se veio senha, validamos e geramos uma nova senhaHash.
  if (dados.senha) {
    validarSenha(dados.senha);

    // Pegamos o custo do bcrypt do .env ou usamos 10 como padrão.
    const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

    // A senha pura nunca vai para o banco.
    dadosAtualizados.senhaHash = await bcrypt.hash(dados.senha, saltRounds);
  }

  // Se nenhum campo permitido foi enviado, não há o que atualizar.
  if (Object.keys(dadosAtualizados).length === 0) {
    throw criarErro("Envie nome e/ou senha para atualizar.", 400);
  }

  // Atualiza o usuário no banco.
  const usuarioAtualizado = await UsuarioRepository.atualizarPorId(idDoUsuario, dadosAtualizados);

  // Se não encontrou o usuário, retorna 404.
  if (!usuarioAtualizado) {
    throw criarErro("Usuário não encontrado.", 404);
  }

  // Retorna o usuário atualizado sem campos sensíveis.
  return montarUsuarioSeguro(usuarioAtualizado);
}

// Remove a conta do usuário logado.
async function removerMinhaConta(idDoUsuario) {
  // Deleta pelo id que veio do token.
  const usuarioDeletado = await UsuarioRepository.deletarPorId(idDoUsuario);

  // Se não encontrou, retorna 404.
  if (!usuarioDeletado) {
    throw criarErro("Usuário não encontrado.", 404);
  }

  // Mensagem simples confirmando a remoção.
  return { message: "Conta removida com sucesso." };
}

// Exportamos as ações que o controller de usuário pode usar.
export default {
  buscarPerfil,
  listarUsuarios,
  atualizarPerfil,
  removerMinhaConta,
};
