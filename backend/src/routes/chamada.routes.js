import { Router } from "express";
import {
  registrarChamada,
  listarChamadasPorTurma,
  getChamadaById
} from "../controllers/chamada.controller.js";

const router = Router();

// Registrar chamada
router.post("/registrar", registrarChamada);

// Histórico por turma
router.get("/historico/:turmaId", listarChamadasPorTurma);

// Obter chamada específica
router.get("/:id", getChamadaById);

export default router;