const Atribuicao = require('../models/Atribuicao');
const Turma = require('../models/Turma');
const User = require('../models/User');
const Registro = require('../models/Registro');
const Aviso = require('../models/Aviso');
const Trabalho = require('../models/Trabalho');

module.exports = {
  async listMinhasAtribuicoes(req, res){
    const atrib = await Atribuicao.find({ professor: req.user.id }).populate('materia turma');
    return res.json(atrib);
  },

  async listAlunosDaTurma(req, res){
    const turmaId = req.params.turmaId;
    const turma = await Turma.findById(turmaId).populate('alunos');
    if(!turma) return res.status(404).json({ message: 'Turma não encontrada' });
    return res.json(turma.alunos || []);
  },

  async lancarNota(req, res){
    const { aluno, materia, turma, valor, descricao } = req.body;
    const reg = await Registro.create({ tipo: 'nota', aluno, materia, turma, valor, descricao, professor: req.user.id });
    return res.status(201).json(reg);
  },

  async alterarNota(req, res){
    const reg = await Registro.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(reg);
  },

  async lancarFalta(req, res){
    const { aluno, materia, turma, descricao } = req.body;
    const reg = await Registro.create({ tipo: 'falta', aluno, materia, turma, descricao, professor: req.user.id });
    return res.status(201).json(reg);
  },

  async alterarFalta(req, res){
    const reg = await Registro.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(reg);
  },

  async criarAviso(req, res){
    const { titulo, conteudo, turmas } = req.body;
    const aviso = await Aviso.create({ titulo, conteudo, turmas, autor: req.user.id });
    return res.status(201).json(aviso);
  },

  async listarTrabalhosDaTurma(req, res){
    const turmaId = req.params.turmaId;
    const trabalhos = await Trabalho.find({ turma: turmaId }).populate('aluno materia');
    return res.json(trabalhos);
  }
};
