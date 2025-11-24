import AtribuicaoAluno from "../models/AtribuicaoAluno.js";

// Criar atribuição (vincular aluno a uma turma)
export const atribuirAluno = async (req, res) => {
  try {
    const { aluno, turma } = req.body;

    // Validação simples
    if (!aluno || !turma) {
      return res.status(400).json({
        message: "Aluno e Turma são obrigatórios para realizar a atribuição.",
      });
    }

    // Remover atribuições antigas desse aluno para a mesma turma
    await AtribuicaoAluno.deleteMany({ aluno, turma });

    // Criar nova atribuição
    const registro = await AtribuicaoAluno.create({
      aluno,
      turma,
    });

    return res.status(201).json({
      message: "Aluno atribuído com sucesso!",
      registro,
    });
  } catch (error) {
    console.error("Erro ao atribuir aluno:", error);
    return res.status(500).json({
      message: "Erro ao atribuir aluno.",
      error,
    });
  }
};

// Listar todas as atribuições
export const listarAtribuicoesAluno = async (req, res) => {
  try {
    const registros = await AtribuicaoAluno.find()
      .populate("aluno", "name email")
      .populate("turma", "nome");

    return res.json(registros);
  } catch (error) {
    console.error("Erro ao listar atribuições:", error);
    return res.status(500).json({
      message: "Erro ao listar atribuições.",
      error,
    });
  }
};

// Remover uma atribuição
export const excluirAtribuicaoAluno = async (req, res) => {
  try {
    await AtribuicaoAluno.findByIdAndDelete(req.params.id);

    return res.json({
      message: "Atribuição removida com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao excluir atribuição:", error);
    return res.status(500).json({
      message: "Erro ao excluir atribuição.",
      error,
    });
  }
};
