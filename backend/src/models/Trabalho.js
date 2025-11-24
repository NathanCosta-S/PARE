const mongoose = require('mongoose');

const TrabalhoSchema = new mongoose.Schema({
  aluno: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  materia: { type: mongoose.Schema.Types.ObjectId, ref: 'Materia', required: true },
  turma: { type: mongoose.Schema.Types.ObjectId, ref: 'Turma', required: true },
  arquivoUrl: { type: String, required: true }, // caminho para /uploads/...
  descricao: { type: String },
  enviadoEm: { type: Date, default: Date.now },
  status: { type: String, enum: ['enviado','avaliado'], default: 'enviado' }
});

module.exports = mongoose.model('Trabalho', TrabalhoSchema);
