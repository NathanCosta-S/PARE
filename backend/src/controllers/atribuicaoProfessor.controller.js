import AtribuicaoProfessor from "../models/AtribuicaoProfessor.js";

export const atribuirProfessor = async (req, res) => {
  try {
    const { professorId, turmaId, materias } = req.body;

    await AtribuicaoProfessor.deleteMany({ professorId, turmaId });

    // Cria novo vínculo
    const registro = await AtribuicaoProfessor.create({
      professorId,
      turmaId,
      materias
    });

    res.status(201).json({ message: "Professor atribuído com sucesso!", registro });
  } catch (error) {
    console.error("Erro ao atribuir professor:", error);
    res.status(500).json({ message: "Erro ao atribuir professor", error });
  }
};
