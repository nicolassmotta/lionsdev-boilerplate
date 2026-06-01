// jsonwebtoken permite verificar se o token JWT é válido.
import jwt from "jsonwebtoken";

// Helper para criar erros padronizados.
import criarErro from "../utils/criarErro.js";

// Middleware de autenticação.
// Ele roda antes das rotas protegidas.
export default function autenticar(req, res, next) {
  // O token deve chegar no cabeçalho Authorization.
  // Exemplo: Authorization: Bearer TOKEN_AQUI
  const authHeader = req.headers.authorization;

  // Se não veio Authorization, a pessoa não está autenticada.
  if (!authHeader) {
    return next(criarErro("Token não informado.", 401));
  }

  // Separamos o texto "Bearer" do token.
  // Resultado esperado: tipo = "Bearer" e token = "eyJ..."
  const [tipo, token] = authHeader.split(" ");

  // Validamos o formato do cabeçalho.
  if (tipo !== "Bearer" || !token) {
    return next(criarErro("Formato do token inválido. Use: Bearer TOKEN.", 401));
  }

  try {
    // jwt.verify confere a assinatura do token usando o mesmo JWT_SECRET que criou o token.
    // Se o token estiver inválido ou expirado, essa linha gera erro e cai no catch.
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // Guardamos dados do usuário dentro da requisição.
    // Assim os próximos controllers sabem quem está logado.
    req.usuario = {
      id: payload.id,
      email: payload.email,
    };

    // Token válido: a requisição pode seguir para a rota/controller.
    return next();
  } catch (error) {
    // Token inválido ou expirado: bloqueamos o acesso.
    return next(criarErro("Token inválido ou expirado.", 401));
  }
}
