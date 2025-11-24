import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Rotas principais
import adminRoutes from "./routes/admin.routes.js";
import professorRoutes from "./routes/professor.routes.js";
import alunoRoutes from "./routes/aluno.routes.js";
import authRoutes from "./routes/auth.routes.js";

// Rotas de atribuições
import atribuicaoProfessorRoutes from "./routes/atribuicaoProfessorRoutes.js";
import atribuicaoAlunoRoutes from "./routes/atribuicaoAlunoRoutes.js";

// Rotas de Turmas e Matérias
import turmasRoutes from "./routes/turmasRoutes.js";
import materiasRoutes from "./routes/materiasRoutes.js";

// chamada e notas
import chamadaRoutes from "./routes/chamada.routes.js";
import notasRoutes from "./routes/notas.routes.js";

const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));


// Auth
app.use("/api/auth", authRoutes);

// Admin 
app.use("/api/admin", adminRoutes);

// Professor / Aluno
app.use("/api/professor", professorRoutes);
app.use("/api/aluno", alunoRoutes);

// Turmas e Matérias
app.use("/api/turmas", turmasRoutes);
app.use("/api/materias", materiasRoutes);

// Atribuições
app.use("/api/atrib-professor", atribuicaoProfessorRoutes);
app.use("/api/atrib-aluno", atribuicaoAlunoRoutes);

// chamada e notas
app.use("/api/chamada", chamadaRoutes);
app.use("/api/notas", notasRoutes);

// Rota inicial
app.get("/", (req, res) => res.send("API PARE rodando 🚀"));

// MONGO CONNECTION

const MONGO = process.env.MONGO_URI || "mongodb://localhost:27017/pare_db";

mongoose
  .connect(MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongo conectado!");
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port} 🚀`);
    });
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB ❌", err);
    process.exit(1);
  });
