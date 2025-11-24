import { Router } from "express";
import AtribuicaoAluno from "../models/AtribuicaoAluno.js";

const router = Router();

// Rotas de gestão de vínculo aluno-turma 
router.get("/", async (req, res) => {
  try {
    const data = await AtribuicaoAluno.find()
      .populate("aluno", "name email")
      .populate("turma", "nome");
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Erro ao listar atribuições" });
  }
});

router.post("/", async (req, res) => {
  try {
    const atrib = await AtribuicaoAluno.create(req.body);
    res.json(atrib);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar atribuição" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await AtribuicaoAluno.findByIdAndDelete(req.params.id);
    res.json({ message: "Atribuição removida" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao excluir atribuição" });
  }
});

export default router;
