// bcryptjs é usado para gerar hash da senha e comparar senha no login.
import bcrypt from "bcryptjs";

// jsonwebtoken é usado para criar o token JWT.
import jwt from "jsonwebtoken";

// O service não acessa o Model diretamente; ele usa o repository.
import UsuarioRepository from "../repositories/usuario.repository.js";

// Helper para criar erros com status HTTP.
import criarErro from "../utils/criarErro.js";

// Validação simples de senha para o exemplo da aula.
function validarSenha(senha) {
  // Exigimos pelo menos 6 caracteres para evitar senhas muito curtas.
  if (!senha || senha.length < 6) {
    throw criarErro("A senha deve ter pelo menos 6 caracteres.", 400);
  }
}

// Remove campos sensíveis antes de devolver o usuário na resposta.
function montarUsuarioSeguro(usuario) {
  // Documento Mongoose tem métodos internos; toObject transforma em objeto comum.
  const usuarioSeguro = usuario.toObject();

  // Garantia extra: nunca devolvemos senhaHash para o cliente.
  delete usuarioSeguro.senhaHash;

  // Removemos o campo interno do Mongoose para deixar a resposta mais limpa.
  delete usuarioSeguro.__v;

  // Retornamos apenas os dados seguros.
  return usuarioSeguro;
}

// Gera o token JWT que será usado pelo cliente nas rotas protegidas.
function gerarToken(usuario) {
  // Sem segredo JWT, a API não consegue assinar tokens com segurança.
  if (!process.env.JWT_SECRET) {
    throw criarErro("JWT_SECRET não configurado no ambiente.", 500);
  }

  // jwt.sign cria um token assinado.
  // O primeiro argumento é o payload: dados que queremos guardar dentro do token.
  return jwt.sign(
    {
      // Guardamos o id para identificar o usuário nas rotas protegidas.
      id: usuario._id.toString(),

      // Guardamos o email porque pode ser útil para logs ou verificações simples.
      email: usuario.email,
    },

    // Chave secreta usada para assinar o token.
    process.env.JWT_SECRET,
    {
      // Tempo de expiração do token. Se não vier do .env, usamos 1 dia.
      expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    }
  );
}

// Cadastra um novo usuário.
async function cadastrar({ nome, email, senha }) {
  // Validação básica para garantir que os campos chegaram no body.
  if (!nome || !email || !senha) {
    throw criarErro("Nome, email e senha são obrigatórios.", 400);
  }

  // Valida a senha antes de gerar o hash.
  validarSenha(senha);

  // Normalizamos o email antes de buscar/salvar.
  const emailNormalizado = email.trim().toLowerCase();

  // Verificamos se já existe usuário com esse email.
  const usuarioExistente = await UsuarioRepository.buscarPorEmail(emailNormalizado);

  // Email duplicado retorna status 409: conflito.
  if (usuarioExistente) {
    throw criarErro("Email já cadastrado.", 409);
  }

  // Quantidade de rodadas do bcrypt.
  // Quanto maior, mais pesado fica gerar o hash.
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);

  // Aqui a senha pura vira hash.
  // É esse valor que será salvo no banco.
  const senhaHash = await bcrypt.hash(senha, saltRounds);

  // Criamos o usuário no banco com senhaHash, nunca com senha pura.
  const usuarioCriado = await UsuarioRepository.criar({
    nome: nome.trim(),
    email: emailNormalizado,
    senhaHash,
  });

  // Retornamos usuário seguro e token.
  // Assim o aluno já consegue testar rotas protegidas depois do cadastro.
  return {
    usuario: montarUsuarioSeguro(usuarioCriado),
    token: gerarToken(usuarioCriado),
  };
}

// Faz login de um usuário já cadastrado.
async function login({ email, senha }) {
  // Login precisa de email e senha.
  if (!email || !senha) {
    throw criarErro("Email e senha são obrigatórios.", 400);
  }

  // Buscamos o usuário pelo email incluindo a senhaHash.
  // Sem o segundo argumento true, senhaHash não viria por causa do select: false.
  const usuario = await UsuarioRepository.buscarPorEmail(email, true);

  // Mensagem genérica para não revelar se o email existe ou não.
  if (!usuario) {
    throw criarErro("Email ou senha incorretos.", 401);
  }

  // Compara a senha digitada com o hash salvo no banco.
  const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash);

  // Se a comparação falhar, o login não é autorizado.
  if (!senhaCorreta) {
    throw criarErro("Email ou senha incorretos.", 401);
  }

  // Login correto: devolvemos usuário seguro e token JWT.
  return {
    usuario: montarUsuarioSeguro(usuario),
    token: gerarToken(usuario),
  };
}

// Exportamos as funções que o controller pode chamar.
export default {
  cadastrar,
  login,
};
