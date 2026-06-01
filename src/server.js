// dotenv carrega as variáveis do arquivo .env para process.env.
import dotenv from "dotenv";

// app contém toda a configuração do Express.
import app from "./app.js";

// Função que conecta no MongoDB.
import conectarBanco from "./config/database.js";

// Carrega o arquivo .env.
dotenv.config();

// No Render, a porta vem de process.env.PORT.
// No computador local, se não houver PORT, usamos 3000.
const PORT = process.env.PORT || 3000;

try {
  // Antes de subir o servidor, conectamos ao banco.
  await conectarBanco();

  // Se a conexão deu certo, iniciamos o servidor HTTP.
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}.`);
  });
} catch (error) {
  // Se a conexão ou a inicialização falhar, mostramos o erro no terminal.
  console.error("Erro ao iniciar a aplicação:", error.message);

  // Encerramos o processo com código 1 para indicar falha.
  process.exit(1);
}
