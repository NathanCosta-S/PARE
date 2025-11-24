const Registro = require('../models/Registro');
const Aviso = require('../models/Aviso');
const Trabalho = require('../models/Trabalho');
const Materia = require('../models/Materia');
const AtribuicaoProfessor = require('../models/AtribuicaoProfessor');
const AtribuicaoAluno = require('../models/AtribuicaoAluno').default;
const Chamada = require('../models/Chamada').default;
const Nota = require('../models/Nota');

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
      chaves.map((item) => [`${item.professorId}-${item.turmaId}`, item])
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
          .populate('materias', 'nome')
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
      typeof nota.toObject === 'function' ? nota.toObject() : { ...nota };
    const chave = `${base.professorId?._id?.toString?.() ||
      base.professorId?.toString?.() ||
      ''}-${base.turmaId?._id?.toString?.() || base.turmaId?.toString?.() || ''}`;

    return {
      ...base,
      materias: materiasPorChave.get(chave) || [],
    };
  };

  const resultado = lista.map(transformar);
  return Array.isArray(notas) ? resultado : resultado[0] || null;
};

module.exports = {
  async historico(req, res){
    const alunoId = req.user.id;
    const registros = await Registro.find({ aluno: alunoId }).populate('materia turma');
    // resumir por materia
    const resumo = {};
    registros.forEach(r => {
      const mid = r.materia ? r.materia._id.toString() : 'outros';
      resumo[mid] = resumo[mid] || { materia: r.materia, notas: [], faltas: 0 };
      if(r.tipo === 'nota') resumo[mid].notas.push(r.valor);
      if(r.tipo === 'falta') resumo[mid].faltas += 1;
    });
    return res.json({ registros, resumo });
  },

  async avisos(req, res){
    const alunoId = req.user.id;
    // buscar turmas onde aluno esta matriculado
    const Turma = require('../models/Turma').default;
    const turmas = await Turma.find({ alunos: alunoId }).select('_id');
    const ids = turmas.map(t => t._id);
    const avisos = await Aviso.find({ turmas: { $in: ids } }).populate('autor turmas');
    return res.json(avisos);
  },

  async uploadTrabalho(req, res){
    if(!req.file) return res.status(400).json({ message: 'Arquivo ausente' });
    const { materia, turma, descricao } = req.body;
    const arquivoUrl = `/uploads/${req.file.filename}`;
    const t = await Trabalho.create({ aluno: req.user.id, materia, turma, arquivoUrl, descricao });
    return res.status(201).json(t);
  },

  async listarTrabalhos(req, res){
    const trabalhos = await Trabalho.find({ aluno: req.user.id }).populate('materia turma');
    return res.json(trabalhos);
  },

  // Dashboard do aluno
  async dashboardDados(req, res){
    try {
      const atribuicao = await AtribuicaoAluno.findOne({ aluno: req.user.id }).populate('turma', 'nome');
      const turma = atribuicao?.turma || null;
      const turmaId = turma?._id;

      // agrega presença nas chamadas da turma do aluno
      const frequencia = { presentes: 0, ausentes: 0, total: 0 };
      const historicoPresenca = [];

      if (turmaId) {
        const chamadas = await Chamada.find({ turma: turmaId }).select('presencas data');

        chamadas.forEach((c) => {
          const registroAluno = c.presencas.find(
            (p) => p.aluno.toString() === req.user.id
          );
          if (registroAluno) {
            frequencia.total += 1;
            if (registroAluno.presente) frequencia.presentes += 1;
            else frequencia.ausentes += 1;

            historicoPresenca.push({
              data: c.data,
              presente: registroAluno.presente,
            });
          }
        });
      }

      // Notas do aluno 
      const notas = await Nota.find({ alunoId: req.user.id })
        .populate('turmaId', 'nome')
        .populate('professorId', 'name email')
        .sort({ updatedAt: -1 });
      const notasFormatadas = await formatarNotasComMaterias(notas);

      return res.json({
        turma,
        frequencia,
        historicoPresenca,
        notas: notasFormatadas,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao carregar dados do aluno' });
    }
  }
};
