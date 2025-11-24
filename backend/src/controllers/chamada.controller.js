import Chamada from "../models/Chamada.js";

// Registrar nova chamada
export const registrarChamada = async (req, res) => {
  try {
    const { turmaId, presencas } = req.body;

    if (!turmaId) {
        return res.status(400).json({ message: "O ID da turma é obrigatório." });
    }

    if (!Array.isArray(presencas)) {
      return res.status(400).json({ message: "Presenças deve ser uma lista!" });
    }
// Mapeamento de turmaId para o campo 'turma' do modelo
    const novaChamada = await Chamada.create({
      turma: turmaId, 
      presencas,
    });

    res.json({ message: "Chamada registrada!", chamada: novaChamada });

  } catch (error) {
    console.error("Erro ao registrar chamada:", error);

    // Lidar com erros de validação do Mongoose
    if (error.name === 'ValidationError') {
        // Retorna 400 Bad Request para erros de validação 
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ 
            message: "Erro de validação ao registrar a chamada.",
            errors: messages 
        });
    }

    // Erros internos do servidor 
    res.status(500).json({ error: error.message });
  }
};

// Listar chamadas de uma turma 
export const listarChamadasPorTurma = async (req, res) => {
  try {
    const { turmaId } = req.params;

    const chamadas = await Chamada.find({ turma: turmaId })
      .populate("presencas.aluno", "name email");

    res.json(chamadas);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar chamada específica por ID 
export const getChamadaById = async (req, res) => {
  try {
    const chamada = await Chamada.findById(req.params.id)
      .populate("presencas.aluno", "name email");

    if (!chamada) {
      return res.status(404).json({ message: "Chamada não encontrada" });
    }

    res.json(chamada);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};