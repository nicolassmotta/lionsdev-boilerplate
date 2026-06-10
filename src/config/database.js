// Importamos o Mongoose, biblioteca que conecta o Node.js ao MongoDB.
import mongoose from "mongoose";

// Esta função centraliza a conexão com o banco de dados.
// Assim o restante da aplicação não precisa saber os detalhes da conexão.
async function conectarBanco() {
  // A URI do MongoDB vem do arquivo .env em ambiente local
  // e das variáveis de ambiente no Render em produção.
  const mongoUri = process.env.MONGO_URI;

  // Se a URI não existir, a aplicação não consegue conectar ao banco.
  // Por isso geramos um erro claro logo no início.
  if (!mongoUri) {
    throw new Error("MONGO_URI não configurada no ambiente.");
  }

  // O mongoose.connect abre a conexão com o MongoDB.
  // Como é uma operação assíncrona, usamos await.
  await mongoose.connect(mongoUri);

  // Mensagem simples para confirmar no terminal que a conexão funcionou.
  console.log("MongoDB conectado com sucesso.");
}

export default conectarBanco;