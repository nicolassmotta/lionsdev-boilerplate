// Importamos o Mongoose para criar o Schema e o Model do usuário.
import mongoose from "mongoose";

// Schema é o "molde" do documento que será salvo na coleção de usuários.
const UsuarioSchema = new mongoose.Schema(
  {
    // Nome do usuário.
    // trim remove espaços extras no começo e no fim.
    nome: {
      type: String,
      required: [true, "O nome é obrigatório."],
      trim: true,
      minlength: [2, "O nome deve ter pelo menos 2 caracteres."],
    },

    // Email do usuário.
    // unique cria uma regra para evitar emails repetidos.
    // lowercase salva o email em minúsculo.
    // match valida um formato simples de email.
    email: {
      type: String,
      required: [true, "O email é obrigatório."],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido."],
    },

    // Nunca salvamos a senha pura no banco.
    // Salvamos apenas o hash da senha.
    // select: false faz o Mongoose não retornar esse campo por padrão.
    senhaHash: {
      type: String,
      required: [true, "A senhaHash é obrigatória."],
      select: false,
    },
  },
  {
    // timestamps cria automaticamente os campos createdAt e updatedAt.
    timestamps: true,

    // toJSON define como o documento será transformado quando virar JSON.
    // Aqui removemos campos que não devem aparecer na resposta da API.
    toJSON: {
      transform(document, retorno) {
        // Mesmo se senhaHash aparecer em alguma consulta específica,
        // removemos antes de enviar a resposta para o cliente.
        delete retorno.senhaHash;

        // __v é um campo interno do Mongoose. Não precisamos mostrar aos alunos/clientes.
        delete retorno.__v;

        // Retornamos o objeto já limpo.
        return retorno;
      },
    },
  }
);

// Model é a ferramenta usada para criar, buscar, atualizar e deletar usuários.
const Usuario = mongoose.model("Usuario", UsuarioSchema);

// Exportamos o Model para ser usado no repository.
export default Usuario;
