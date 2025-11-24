# PARE - Gestão Escolar (Admin / Professor / Aluno)

Aplicação full-stack para gestão escolar com três perfis: **admin**, **professor** e **aluno**. Inclui autenticação JWT, cadastro de usuários, turmas e matérias, atribuições de professor/aluno a turma, chamadas, lançamento de notas (P1/P2/T1/T2) com média e visualização por perfil. Front-end em React + Tailwind; back-end em Node.js + Express + MongoDB (Mongoose).

---

## 📦 Estrutura do projeto

- `backend/`: API Express conectada ao MongoDB.
  - `src/models/`: esquemas Mongoose (User, Turma, Atribuições, Nota, Chamada, etc).
  - `src/controllers/`: regras de negócio (auth, notas, aluno, professor, admin).
  - `src/routes/`: rotas REST (auth, admin, professor, aluno, turmas, notas, chamada).
  - `src/middlewares/`: autenticação JWT (`auth.middleware`) e checagem de role (`role.middleware`).
  - `src/server.js`: bootstrap da API, conexão Mongo e montagem de rotas.
- `frontend/`: SPA em React.
  - `src/App.jsx`: roteamento principal protegido.
  - `src/layouts/AppLayout.jsx`: layout com Header.
  - `src/components/Header.jsx`: menu único (Calendário) + logout.
  - `src/pages/`: telas para cada perfil (professor, aluno, admin) e calendário.
  - `src/lib/api.js`: axios pré-configurado com baseURL e interceptor de token.
  - `tailwind.config.js` / `index.css`: tema visual e utilitários.

---

## 🚀 Como rodar

### Pré-requisitos
- Node 18+
- MongoDB rodando localmente (ou URI de conexão)

### Backend
```bash
cd backend
cp .env.example .env   # ajuste MONGO_URI e JWT_SECRET
npm install
npm run dev            # ou npm start
```
API padrão: `http://localhost:4000/api`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
App padrão: `http://localhost:5173`.

---

## 🔐 Autenticação e perfis
- Login via `/api/auth/login` (JWT).
- Middleware `auth.middleware` injeta `req.user`.
- Middleware `role.middleware` restringe por role.
  - **admin**: gerencia usuários, turmas, matérias, atribuições.
  - **professor**: vê turmas atribuídas, lança chamadas, lança/edita notas.
  - **aluno**: vê turma vinculada, frequência e notas pessoais.

---

## 🗂️ Principais modelos (backend)
- `User`: nome, email, senha (hash), role (`admin|professor|aluno`).
- `Turma`: nome, arrays de alunos e professores/matérias.
- `AtribuicaoAluno` / `AtribuicaoProfessor`: vínculo aluno↔turma e professor↔turma/matérias.
- `Nota`: alunoId, turmaId, professorId, P1/P2/T1/T2, média (índice único por aluno/turma).
- `Chamada`: turma, data, presenças por aluno.
- Outros: `Registro`, `Aviso`, `Trabalho`.

---

## 🌐 Rotas principais (backend)
- `/api/auth`: login/registro.
- `/api/admin`: CRUD de usuários (admin-only).
- `/api/turmas`, `/api/materias`: CRUD básico.
- `/api/atrib-professor`, `/api/atrib-aluno`: gerencia vínculos.
- `/api/chamada`: professor registra e lista chamadas por turma.
- `/api/notas`:
  - `POST /lancar` (professor): cria/atualiza P1/P2/T1/T2 e média.
  - `GET /turma/:turmaId/aluno/:alunoId`: professor ou próprio aluno.
  - `GET /turma/:turmaId`: professor vê notas da turma.
  - `GET /minhas` (aluno): notas do aluno logado.
- `/api/aluno/dashboard-dados`: aluno vê turma, frequência e notas.

---

## 🖥️ Frontend (fluxos)
- **Login**: salva token e user no localStorage; rotas protegidas via `ProtectedRoute`.
- **Header único**: item "Calendario" + botão de sair.
- **Calendário**: página acessível a todos logados; exibe imagem do calendário escolar.

### Admin
- `AdminDashboard`: tabs para Usuários / Atribuições / Turmas & Matérias.
- `Usuarios`: lista usuários, cria/edita/exclui com modal.
- `Atribuicoes`: gerencia vínculos de professores e alunos.
- `TurmasMaterias`: CRUD de turmas e matérias em tabela com ações.

### Professor
- `ProfessorDashboard`: atalho para turmas.
- `ProfessorTurmas`: lista turmas atribuídas; links para chamada, histórico, lançar notas e ver notas lançadas.
- `Chamada`: marca presença/ausência por aluno e salva.
- `LancarNota`: escolhe aluno da turma, preenche P1/P2/T1/T2, calcula média local, salva no backend (upsert).
- `NotasLancadas`: lista notas da turma com médias e datas.

### Aluno
- `AlunoDashboard`: mostra turma vinculada, frequência agregada (presenças/ausências), histórico de chamadas e notas com médias. Dados vêm de `/api/aluno/dashboard-dados`.
- `aluno/Notas`: lista só as notas do aluno autenticado.

---

## 🎨 Tema e UI
- Tailwind com paleta laranja personalizada:
  - Claro: `#c94e1b`
  - Escuro: `#954532`
- Fundo global com imagem `src/imgs/background-imagem.jpeg` (cover, fixed).
- Componentes reutilizam classes utilitárias em `index.css` (cards, botões, inputs).

---

## 🧠 Pontos de atenção (comentados no código)
- `backend/src/controllers/notas.controller.js`:
  - Upsert de nota por aluno/turma e cálculo de média centralizado no backend.
  - Controle de acesso: professor ou próprio aluno podem ler.
- `backend/src/controllers/aluno.controller.js`:
  - Agrega chamadas para frequência e retorna notas já populadas.
- `frontend/src/pages/professor/LancarNota.jsx`:
  - Média calculada client-side para feedback rápido; sincroniza após salvar.
- `frontend/src/pages/professor/NotasLancadas.jsx`:
  - Carrega notas da turma e exibe médias e última atualização.

---

## ✅ Checklist para apresentação
- Mostrar login e mudança de role (redirect para dashboard correspondente).
- Admin: criar usuário, criar turma/matéria, atribuir professor/aluno.
- Professor: abrir turma, registrar chamada, lançar/editar notas; ver notas lançadas.
- Aluno: ver painel com turma, frequência e notas/médias.
- Calendário: página comum a todos (imagem do calendário escolar).

