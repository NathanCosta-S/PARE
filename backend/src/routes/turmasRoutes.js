import { Router } from "express";
import Turma from "../models/Turma.js";
import AtribuicaoAluno from "../models/AtribuicaoAluno.js";

const router = Router();

// Lista todas as turmas
router.get("/", async (req, res) => {
  try {
    const turmas = await Turma.find();
    res.json(turmas);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar turmas" });
  }
});

//  Buscar turma por ID incluindo ALUNOS ATRIBUÍDOS
router.get("/:id", async (req, res) => {
  try {
    const turma = await Turma.findById(req.params.id);

    if (!turma) {
      return res.status(404).json({ message: "Turma não encontrada" });
    }

    // Buscar alunos na coleção AtribuicaoAluno
    const atribuicoes = await AtribuicaoAluno.find({
      turma: turma._id,
    }).populate("aluno", "name email");

    // Transformar resultado em lista de alunos
    const alunos = atribuicoes.map((item) => item.aluno);

    res.json({
      _id: turma._id,
      nome: turma.nome,
      alunos
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar turma por ID" });
  }
});

export default router;
