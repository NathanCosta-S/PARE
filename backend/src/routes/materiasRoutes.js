import { Router } from "express";
import Materia from "../models/Materia.js";

const router = Router();

// Listar
router.get("/", async (req, res) => {
  try {
    const materias = await Materia.find();
    res.json(materias);
  } catch (error) {
    res.status(500).json({ error: "Erro ao listar matérias" });
  }
});

// Criar
router.post("/", async (req, res) => {
  try {
    const novaMateria = await Materia.create({ nome: req.body.nome });
    res.json(novaMateria);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar matéria" });
  }
});

// Editar
router.put("/:id", async (req, res) => {
  try {
    const materia = await Materia.findByIdAndUpdate(req.params.id, { nome: req.body.nome }, { new: true });
    res.json(materia);
  } catch (error) {
    res.status(500).json({ error: "Erro ao editar matéria" });
  }
});

// Excluir
router.delete("/:id", async (req, res) => {
  try {
    await Materia.findByIdAndDelete(req.params.id);
    res.json({ message: "Matéria excluída" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir matéria" });
  }
});

export default router;
