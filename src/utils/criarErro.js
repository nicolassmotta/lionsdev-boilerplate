// Função auxiliar para criar erros com uma mensagem e um status HTTP.
// Isso evita repetir várias vezes: const error = new Error(...); error.status = ...
export default function criarErro(message, status = 500) {
  // Criamos um erro padrão do JavaScript com a mensagem recebida.
  const error = new Error(message);

  // Adicionamos o status HTTP para o middleware de erro saber qual resposta enviar.
  error.status = status;

  // Devolvemos o erro pronto para ser usado com "throw" ou "next(error)".
  return error;
}
