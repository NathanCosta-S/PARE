📘 PARE – Plataforma Acadêmica de Registro Escolar

Sistema completo para gerenciamento acadêmico, com módulos para Administração, Professores e Alunos, integrando chamadas, notas, turmas, matérias e atribuições.

🚀 Visão Geral

O PARE é um sistema Full Stack desenvolvido para escolas, cursos e instituições de ensino que precisam de uma solução moderna e eficiente para:

Controle de usuários

Gestão de turmas e matérias

Lançamento e consulta de notas

Registro e histórico de chamadas

Painéis independentes para Admin, Professor e Aluno

Autenticação segura com JWT

Interface rápida, responsiva e moderna

O sistema segue arquitetura modular, escalável e fácil de manter, utilizando tecnologias de ponta no frontend e backend.

🛠️ Tecnologias Utilizadas
Backend

Node.js

Express.js

MongoDB + Mongoose

JWT (JSON Web Token)

Bcrypt.js

Dotenv

Nodemon

Arquitetura em camadas (Models, Controllers, Routes, Middlewares)

Frontend

React.js

Vite

React Router DOM

Context API (Autenticação)

Axios com Interceptors

TailwindCSS

Componentização moderna

Geral

Git & GitHub

VS Code

RESTful API

Postman / Insomnia para testes

🔐 Funcionalidades Principais
👨‍💼 Admin

Gerenciar usuários (criar, editar, remover)

Criar/editar turmas e matérias

Atribuir professores a turmas e matérias

Atribuir alunos a turmas

Acompanhar organização geral do sistema

👨‍🏫 Professor

Ver turmas e matérias atribuídas

Lançar notas por matéria

Consultar notas lançadas

Registrar presença (chamada)

Acessar histórico de chamadas

👨‍🎓 Aluno

Acessar seu painel personalizado

Ver notas por matéria, professor e turma

Consultar médias automáticas

Visualizar seus dados acadêmicos

🧱 Arquitetura do Projeto
/backend
│── config/           → Conexões (MongoDB)
│── controllers/      → Regras de negócio
│── middlewares/      → Autenticação, roles, erros
│── models/           → Schemas do banco
│── routes/           → Endpoints da API
│── seed/             → Script de criação do Admin
│── server.js         → Inicialização do servidor

/frontend
│── src/
│     ├── components/ → Header, ProtectedRoute, Layout, etc.
│     ├── pages/      → Telas completas (Aluno, Professor, Admin)
│     ├── context/    → AuthContext (login global)
│     ├── lib/        → Axios configurado
│     ├── routes/     → Rotas da aplicação
│     └── styles/     → Tailwind e CSS global

🔗 Fluxo de Autenticação

Usuário faz login

Backend valida credenciais

Token JWT é gerado

Frontend guarda token no localStorage

Axios envia token automaticamente nas requisições

Middlewares validam token e role

Conteúdo é liberado apenas se o usuário tiver permissão

📌 Destaques Técnicos

API REST bem estruturada

Populates avançados no Mongoose

Autorização por tipo de usuário (Admin, Professor, Aluno)

Lançamento de notas por matéria

Registro de chamada com histórico detalhado

Sistema modular e escalável

Frontend totalmente responsivo e otimizado

📦 Como rodar o projeto (DEV)
Backend
cd backend
npm install
npm run dev


Crie um arquivo .env com:

MONGO_URI=mongodb://localhost:27017/pare
JWT_SECRET=sua_senha_secreta
PORT=4000

Frontend
cd frontend
npm install
npm run dev


Crie .env com:

VITE_API_URL=http://localhost:4000/api

📚 Scripts Úteis
Backend
Comando	Ação
npm run dev	Backend com nodemon
Frontend
Comando	Ação
npm run dev	Executa frontend local
🧪 Testes

Utilize Postman ou Insomnia para testar endpoints.

🌱 Criando Admin Inicial
node seed/createAdmin.js

🎯 Objetivo do Projeto

O PARE foi desenvolvido com foco em:

Organização

Transparência

Produtividade

Facilidade de uso

Agilidade no registro acadêmico

Arquitetura moderna e sustentável
