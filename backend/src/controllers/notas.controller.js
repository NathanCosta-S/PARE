import Nota from "../models/Nota.js";
import AtribuicaoProfessor from "../models/AtribuicaoProfessor.js";

const formatarNotasComMaterias = async (notas) => {
  const lista = Array.isArray(notas) ? notas : [notas];
  const chaves = lista
    .map((nota) => {
      const turmaId =
        nota?.turmaId?._id?.toString?.() || nota?.turmaId?.toString?.();
      const professorId =
        nota?.professorId?._id?.toString?.() || nota?.professorId?.toString?.();
      return turmaId && professorId ? { turmaId, professorId } : null;
    })
    .filter(Boolean);

  const paresUnicos = Array.from(
    new Map(
      chaves.map((item) => [
        `${item.professorId}-${item.turmaId}`,
        item,
      ])
    ).values()
  );

  const atribuicoes =
    paresUnicos.length > 0
      ? await AtribuicaoProfessor.find({
          $or: paresUnicos.map(({ professorId, turmaId }) => ({
            professorId,
            turmaId,
          })),
        })
          .populate("materias", "nome")
          .lean()
      : [];

  const materiasPorChave = new Map();
  atribuicoes.forEach((atrib) => {
    materiasPorChave.set(
      `${atrib.professorId.toString()}-${atrib.turmaId.toString()}`,
      (atrib.materias || []).map((m) => ({
        _id: m._id,
        nome: m.nome,
      }))
    );
  });

  const transformar = (nota) => {
    if (!nota) return null;
    const base =
      typeof nota.toObject === "function" ? nota.toObject() : { ...nota };
    const chave = `${base.professorId?._id?.toString?.() ||
      base.professorId?.toString?.() ||
      ""}-${base.turmaId?._id?.toString?.() || base.turmaId?.toString?.() || ""}`;

    return {
      ...base,
      materias: materiasPorChave.get(chave) || [],
    };
  };

  const resultado = lista.map(transformar);
  return Array.isArray(notas) ? resultado : resultado[0] || null;
};

const toNumber = (value) => {
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
};

const calcularMedia = (p1, p2, t1, t2) => (p1 + p2 + t1 + t2) / 4;

// Cria ou atualiza a nota de um aluno em uma turma específica
export const lancarNotas = async (req, res) => {
  try {
    const { alunoId, turmaId, p1, p2, t1, t2 } = req.body;

    if (!alunoId || !turmaId) {
      return res
        .status(400)
        .json({ message: "alunoId e turmaId são obrigatórios." });
    }

    const notasConvertidas = [p1, p2, t1, t2].map(toNumber);
    if (notasConvertidas.some((n) => n === null)) {
      return res
        .status(400)
        .json({ message: "P1, P2, T1 e T2 devem ser números válidos." });
    }

    const [p1Valor, p2Valor, t1Valor, t2Valor] = notasConvertidas;
    const media = calcularMedia(p1Valor, p2Valor, t1Valor, t2Valor);

    const existeNota = await Nota.findOne({ alunoId, turmaId });

    // upsert garante que professor edite ou crie a mesma nota (1 nota por aluno/turma)
    const nota = await Nota.findOneAndUpdate(
      { alunoId, turmaId },
      {
        alunoId,
        turmaId,
        professorId: req.user.id,
        p1: p1Valor,
        p2: p2Valor,
        t1: t1Valor,
        t2: t2Valor,
        media,
        dataLancamento: new Date(),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .populate("alunoId", "name email")
      .populate("turmaId", "nome")
      .populate("professorId", "name email");

    const notaFormatada = await formatarNotasComMaterias([nota]);

    return res.status(existeNota ? 200 : 201).json(notaFormatada[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Busca nota de um aluno em uma turma, controlando quem pode ver
export const buscarNotaPorAluno = async (req, res) => {
  try {
    const { turmaId, alunoId } = req.params;

    if (!turmaId || !alunoId) {
      return res.status(400).json({ message: "Parâmetros obrigatórios ausentes." });
    }

    const ehProfessor = req.user.role === "professor";
    const ehMesmoAluno = req.user.role === "aluno" && req.user.id === alunoId;

    if (!ehProfessor && !ehMesmoAluno) {
      return res
        .status(403)
        .json({ message: "Apenas o professor e o próprio aluno podem ver estas notas." });
    }

    const nota = await Nota.findOne({ turmaId, alunoId })
      .populate("alunoId", "name email")
      .populate("turmaId", "nome")
      .populate("professorId", "name email");

    if (!nota) {
      return res.status(404).json({ message: "Nenhuma nota encontrada para este aluno." });
    }

    const notaFormatada = await formatarNotasComMaterias([nota]);

    return res.json(notaFormatada[0]);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Lista todas as notas do aluno logado 
export const minhasNotas = async (req, res) => {
  try {
    const notas = await Nota.find({ alunoId: req.user.id })
      .populate("turmaId", "nome")
      .populate("professorId", "name email")
      .sort({ updatedAt: -1 });

    const notasFormatadas = await formatarNotasComMaterias(notas);

    return res.json(notasFormatadas);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Lista todas as notas de uma turma 
export const listarNotasDaTurma = async (req, res) => {
  try {
    if (req.user.role !== "professor") {
      return res
        .status(403)
        .json({ message: "Apenas professores podem ver notas da turma." });
    }

    const { turmaId } = req.params;
    const notas = await Nota.find({ turmaId })
      .populate("alunoId", "name email")
      .populate("turmaId", "nome")
      .populate("professorId", "name email")
      .sort({ updatedAt: -1 });

    const notasFormatadas = await formatarNotasComMaterias(notas);

    return res.json(notasFormatadas);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
