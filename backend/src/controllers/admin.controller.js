const User = require('../models/User');
const Materia = require('../models/Materia');
const Turma = require('../models/Turma');
const Atribuicao = require('../models/Atribuicao');

module.exports = {
  // Users
  async createUser(req, res){
    try {
      const { name, email, password, role } = req.body;
      if(!name || !email || !password) return res.status(400).json({ message: 'Dados incompletos' });
      const bcrypt = require('bcryptjs');
      const hash = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hash, role });
      return res.status(201).json(user);
    } catch(err){ console.error(err); res.status(500).json({ message: 'Erro' }); }
  },

  async listUsers(req, res){
    const users = await User.find().select('-password');
    return res.json(users);
  },

  async getUser(req, res){
    const user = await User.findById(req.params.id).select('-password');
    if(!user) return res.status(404).json({ message: 'User não encontrado' });
    return res.json(user);
  },

  async updateUser(req, res){
    const updates = req.body;
    if(updates.password){
      const bcrypt = require('bcryptjs');
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    return res.json(user);
  },

  async deleteUser(req, res){
    await User.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Deletado' });
  },

  // Materias
  async createMateria(req, res){
    const { nome, descricao } = req.body;
    const m = await Materia.create({ nome, descricao });
    return res.status(201).json(m);
  },

  async listMaterias(req, res){
    const ms = await Materia.find();
    return res.json(ms);
  },

  async updateMateria(req, res){
    const m = await Materia.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(m);
  },

  // Turmas
  async createTurma(req, res){
    const { nome, ano } = req.body;
    const t = await Turma.create({ nome, ano });
    return res.status(201).json(t);
  },

  async listTurmas(req, res){
    const ts = await Turma.find();
    return res.json(ts);
  },

  async updateTurma(req, res){
    const t = await Turma.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(t);
  },

  // Atribuições
  async vincularProfessor(req, res){
    const { professorId, materiaId, turmaId } = req.body;
    const a = await Atribuicao.create({ professor: professorId, materia: materiaId, turma: turmaId });
    return res.status(201).json(a);
  },

  async adicionarAlunoTurma(req, res){
    // estratégia simples: cria um vínculo
    const { alunoId, turmaId } = req.body;
    // verificar se aluno existe
    const aluno = await User.findById(alunoId);
    if(!aluno) return res.status(404).json({ message: 'Aluno não encontrado' });
    //salvar lista de alunos na Turma: adiciona campo alunos no documento Turma
    const turma = await require('../models/Turma').findById(turmaId);
    if(!turma) return res.status(404).json({ message: 'Turma não encontrada' });
    turma.alunos = turma.alunos || [];
    if(!turma.alunos.includes(alunoId)) turma.alunos.push(alunoId);
    await turma.save();
    return res.json(turma);
  }
};
