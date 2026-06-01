// Repository é a camada responsável por conversar com o banco de dados.
// Ela usa o Model do Mongoose, mas esconde esses detalhes das outras camadas.
import Usuario from "../models/usuario.model.js";

// Cria um usuário no MongoDB.
async function criar(dadosDoUsuario) {
  return Usuario.create(dadosDoUsuario);
}

// Busca um usuário pelo email.
// O parâmetro "incluirSenha" existe porque a senhaHash normalmente fica escondida.
// No login precisamos dela para comparar com a senha digitada.
async function buscarPorEmail(email, incluirSenha = false) {
  // Normalizamos o email para evitar diferenças como "TESTE@email.com" e "teste@email.com".
  const query = Usuario.findOne({ email: email.trim().toLowerCase() });

  // Como senhaHash tem select: false no Model, precisamos pedir explicitamente quando necessário.
  if (incluirSenha) {
    query.select("+senhaHash");
  }

  // Retorna a consulta pronta/executada pelo Mongoose.
  return query;
}

// Busca um usuário pelo ID do MongoDB.
async function buscarPorId(id) {
  return Usuario.findById(id);
}

// Lista todos os usuários.
// sort({ createdAt: -1 }) mostra os mais recentes primeiro.
async function listarTodos() {
  return Usuario.find().sort({ createdAt: -1 });
}

// Atualiza um usuário pelo ID.
async function atualizarPorId(id, dadosAtualizados) {
  return Usuario.findByIdAndUpdate(id, dadosAtualizados, {
    // new: true faz retornar o documento já atualizado.
    new: true,

    // runValidators: true garante que as validações do Schema também rodem no update.
    runValidators: true,
  });
}

// Remove um usuário pelo ID.
async function deletarPorId(id) {
  return Usuario.findByIdAndDelete(id);
}

// Exportamos todas as funções do repository em um objeto.
export default {
  criar,
  buscarPorEmail,
  buscarPorId,
  listarTodos,
  atualizarPorId,
  deletarPorId,
};
