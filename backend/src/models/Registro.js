const mongoose = require('mongoose');

const RegistroSchema = new mongoose.Schema({
  tipo: { type: String, enum: ['nota','falta'], required: true },
  aluno: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  materia: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: true },
  turma: { type: mongoose.Schema.Types.ObjectId, ref: 'Turma', required: true },
  valor: { type: Number }, 
  descricao: { type: String },
  data: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registro', RegistroSchema);
