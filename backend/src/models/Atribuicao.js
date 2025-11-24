const mongoose = require('mongoose');

const AtribuicaoSchema = new mongoose.Schema({
  professor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  materia: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: true },
  turma: { type: mongoose.Schema.Types.ObjectId, ref: 'Turma', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Atribuicao', AtribuicaoSchema);
