import express from "express";
import { atribuirProfessor } from "../controllers/atribuicaoProfessor.controller.js";
import AtribuicaoProfessor from "../models/AtribuicaoProfessor.js";

const router = express.Router();

// Criar atribuição
router.post("/", atribuirProfessor);

// Listar atribuições
router.get("/", async (req, res) => {
  try {
    const registros = await AtribuicaoProfessor.find()
      .populate("professorId", "name")
      .populate("turmaId", "nome")
      .populate("materias", "nome");

    res.json(registros);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar atribuições", error });
  }
});

export default router;
