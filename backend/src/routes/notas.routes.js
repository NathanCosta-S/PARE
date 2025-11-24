import express from "express";
import auth from "../middlewares/auth.middleware.js";
import role from "../middlewares/role.middleware.js";
import {
  lancarNotas,
  buscarNotaPorAluno,
  minhasNotas,
  listarNotasDaTurma,
} from "../controllers/notas.controller.js";

const router = express.Router();

// Professor lança/atualiza notas
router.post("/lancar", auth, role(["professor"]), lancarNotas);

// Professor vê notas lançadas da turma
router.get("/turma/:turmaId", auth, role(["professor"]), listarNotasDaTurma);

// Professor ou o próprio aluno consulta a nota em uma turma
router.get("/turma/:turmaId/aluno/:alunoId", auth, buscarNotaPorAluno);

// Aluno vê apenas as próprias notas
router.get("/minhas", auth, role(["aluno"]), minhasNotas);

export default router;
