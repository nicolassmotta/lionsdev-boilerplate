# Boilerplate API MVC com Autenticação

Base didática para criar APIs com **Express**, **MongoDB**, **Mongoose**, **bcryptjs**, **JWT** e organização em camadas.

Use este projeto quando for começar uma API nova. Ele já vem com cadastro, login, middleware de autenticação, tratamento de erros, conexão com banco, `requests.http`, `.env.example` e configuração de deploy no Render.

---

## 1. Como Usar em um Projeto Novo

1. Copie esta pasta para um novo repositório ou use como template no GitHub.
2. Troque o nome do projeto no `package.json`.
3. Rode:

```bash
npm install
cp .env.example .env
npm start
```

4. Preencha o `.env` com sua connection string do MongoDB Atlas.
5. Teste o cadastro e o login usando `requests.http`.
6. Depois crie os models, routes, controllers, services e repositories do exercício.

> O boilerplate já resolve a parte repetitiva. O exercício novo deve focar nas regras do sistema.

---

## 2. Estrutura de Pastas

```txt
src/
├── app.js
├── server.js
├── config/
│   └── database.js
├── controllers/
│   ├── auth.controller.js
│   └── usuario.controller.js
├── middlewares/
│   ├── autenticacao.middleware.js
│   ├── erro.middleware.js
│   └── validarCampos.middleware.js
├── models/
│   └── usuario.model.js
├── repositories/
│   └── usuario.repository.js
├── routes/
│   ├── auth.routes.js
│   └── usuario.routes.js
├── services/
│   ├── auth.service.js
│   └── usuario.service.js
└── utils/
    └── criarErro.js
```

### `src/server.js`

É o arquivo que inicia a aplicação.

Responsabilidades:

- carregar variáveis do `.env`;
- conectar no MongoDB;
- iniciar o servidor na porta correta.

Código que sempre aparece:

```js
const PORT = process.env.PORT || 3000;
```

No computador do aluno, usa `3000`. No Render, usa a porta definida pela plataforma.

### `src/app.js`

É onde o Express é configurado.

Responsabilidades:

- criar o `app`;
- ativar `express.json()`;
- registrar as rotas principais;
- registrar a rota 404;
- registrar o middleware central de erro.

Quando criar uma nova entidade, como `produtos`, normalmente você adiciona aqui:

```js
import produtoRoutes from "./routes/produto.routes.js";

app.use("/api/produtos", produtoRoutes);
```

### `src/config/database.js`

Guarda a conexão com o MongoDB.

Responsabilidades:

- ler `process.env.MONGO_URI`;
- chamar `mongoose.connect`;
- impedir que a conexão fique espalhada pelo projeto.

### `src/models/`

Models definem o formato dos dados no MongoDB.

Exemplo: `usuario.model.js` define campos como `nome`, `email` e `senhaHash`.

Quando criar uma nova entidade, crie um model:

```txt
models/produto.model.js
```

O model responde perguntas como:

- quais campos existem?
- quais campos são obrigatórios?
- quais campos têm validação?
- quais campos não devem aparecer por padrão?

### `src/repositories/`

Repositories conversam com o banco.

Eles concentram comandos como:

- `Model.create`;
- `Model.find`;
- `Model.findById`;
- `Model.findOne`;
- `Model.findByIdAndUpdate`;
- `Model.findByIdAndDelete`.

Regra prática:

> Se o código está fazendo consulta no MongoDB, ele provavelmente pertence ao repository.

Exemplo de arquivo novo:

```txt
repositories/produto.repository.js
```

### `src/services/`

Services guardam as regras de negócio.

Exemplos:

- verificar se email já existe;
- gerar hash da senha;
- comparar senha no login;
- impedir atualização inválida;
- decidir se uma operação pode acontecer.

Regra prática:

> Se o código está decidindo uma regra do sistema, ele provavelmente pertence ao service.

O service não deve usar `req` nem `res`.

### `src/controllers/`

Controllers recebem a requisição HTTP e devolvem a resposta.

Responsabilidades:

- ler `req.body`, `req.params` e `req.query`;
- chamar o service correto;
- escolher o status HTTP;
- responder com JSON;
- enviar erros para `next(error)`.

Código que sempre aparece:

```js
async function exemplo(req, res, next) {
  try {
    const resultado = await ExemploService.algumaAcao(req.body);
    return res.status(200).json(resultado);
  } catch (error) {
    return next(error);
  }
}
```

### `src/routes/`

Routes definem os endereços da API.

Exemplos deste boilerplate:

```txt
POST /api/auth/cadastro
POST /api/auth/login
GET /api/usuarios/perfil
```

Regra prática:

> Rota não deve ter regra de negócio grande. Ela aponta para o controller e aplica middlewares.

### `src/middlewares/`

Middlewares são funções que rodam antes ou depois das rotas.

Este boilerplate tem:

- `autenticacao.middleware.js`: valida o token JWT;
- `validarCampos.middleware.js`: confere campos obrigatórios;
- `erro.middleware.js`: centraliza respostas de erro.

### `src/utils/`

Utils guardam funções pequenas reutilizáveis.

Exemplo:

```txt
utils/criarErro.js
```

Essa função cria erros com mensagem e status HTTP:

```js
throw criarErro("Usuário não encontrado.", 404);
```

---

## 3. Fluxo de uma Requisição

Exemplo: `POST /api/auth/login`

```txt
1. app.js recebe a requisição
2. routes/auth.routes.js encontra POST /login
3. validarCampos confere email e senha
4. auth.controller.js lê req.body
5. auth.service.js valida email, senha e gera JWT
6. usuario.repository.js busca o usuário no MongoDB
7. usuario.model.js define como o usuário existe no banco
8. controller retorna JSON
```

Esse fluxo deve se repetir nas próximas APIs.

---

## 4. Autenticação Pronta

### Cadastro

`POST /api/auth/cadastro`

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "senha": "123456"
}
```

O cadastro:

- valida campos obrigatórios;
- impede email duplicado;
- transforma a senha em hash;
- salva `senhaHash`, nunca `senha`;
- retorna usuário seguro e token JWT.

### Login

`POST /api/auth/login`

```json
{
  "email": "maria@email.com",
  "senha": "123456"
}
```

O login:

- busca o usuário pelo email;
- inclui `senhaHash` apenas nessa busca;
- compara senha digitada com bcrypt;
- retorna token JWT.

### Rotas Protegidas

Rotas protegidas usam:

```txt
Authorization: Bearer TOKEN_AQUI
```

No código, aplique o middleware:

```js
router.use(autenticar);
```

ou em uma rota específica:

```js
router.get("/perfil", autenticar, UsuarioController.perfil);
```

---

## 5. Como Criar uma Nova Entidade

Exemplo: uma API de produtos.

### Passo 1 - Criar o model

```txt
src/models/produto.model.js
```

Define campos como nome, preço e estoque.

### Passo 2 - Criar o repository

```txt
src/repositories/produto.repository.js
```

Concentra as consultas ao MongoDB.

### Passo 3 - Criar o service

```txt
src/services/produto.service.js
```

Guarda regras como:

- não permitir preço negativo;
- não permitir estoque menor que zero;
- validar se o produto existe antes de atualizar.

### Passo 4 - Criar o controller

```txt
src/controllers/produto.controller.js
```

Lê `req.body`, `req.params` e chama o service.

### Passo 5 - Criar as rotas

```txt
src/routes/produto.routes.js
```

Define:

```txt
POST /api/produtos
GET /api/produtos
GET /api/produtos/:id
PATCH /api/produtos/:id
DELETE /api/produtos/:id
```

### Passo 6 - Registrar no `app.js`

```js
import produtoRoutes from "./routes/produto.routes.js";

app.use("/api/produtos", produtoRoutes);
```

---

## 6. Variáveis de Ambiente

Crie um `.env` a partir do `.env.example`:

```env
PORT=3000
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/nome_do_projeto
JWT_SECRET=troque_essa_chave_por_uma_chave_grande
JWT_EXPIRES_IN=1d
BCRYPT_SALT_ROUNDS=10
```

Nunca envie `.env` para o GitHub.

---

## 7. Scripts

```bash
npm start
```

Inicia a API com:

```bash
node src/server.js
```

---

## 8. Rotas Incluídas

| Método | Rota                     | Protegida | Função                         |
| ------ | ------------------------ | --------- | ------------------------------ |
| GET    | `/`                      | Não       | Testar se a API está rodando   |
| POST   | `/api/auth/cadastro`     | Não       | Cadastrar usuário              |
| POST   | `/api/auth/login`        | Não       | Fazer login e receber token    |
| GET    | `/api/usuarios/perfil`   | Sim       | Ver perfil do usuário logado   |
| PATCH  | `/api/usuarios/perfil`   | Sim       | Atualizar nome e/ou senha      |
| DELETE | `/api/usuarios/perfil`   | Sim       | Remover a própria conta        |
| GET    | `/api/usuarios`          | Sim       | Listar usuários cadastrados    |

---

## 9. Checklist Antes de Começar um Exercício

- Troque o nome do projeto no `package.json`.
- Troque o nome do banco na `MONGO_URI`.
- Rode `npm install`.
- Teste cadastro e login.
- Crie os arquivos da nova entidade.
- Registre as novas rotas no `app.js`.
- Atualize o `requests.http` com exemplos do exercício.
- Atualize o README do projeto novo.

---

## 10. Deploy no Render

No Render:

- **Build Command:** `npm install`
- **Start Command:** `npm start`

Variáveis:

| Key                  | Value                              |
| -------------------- | ---------------------------------- |
| `MONGO_URI`          | Connection string do MongoDB Atlas |
| `JWT_SECRET`         | Chave grande e secreta             |
| `JWT_EXPIRES_IN`     | `1d`                               |
| `BCRYPT_SALT_ROUNDS` | `10`                               |
| `NODE_ENV`           | `production`                       |

Não configure `PORT` no Render. A plataforma define essa variável automaticamente.

---

## 11. Checklist de Segurança

- Salve `senhaHash`, nunca `senha`.
- Use `select: false` em campos sensíveis.
- Não retorne `senhaHash`.
- Use mensagem genérica no login: `Email ou senha incorretos.`
- Proteja rotas privadas com JWT.
- Guarde segredos no `.env`.
- Não envie `.env` para o GitHub.
- Coloque regra de negócio no service.
- Coloque acesso ao banco no repository.
- Trate erros com o middleware central.
