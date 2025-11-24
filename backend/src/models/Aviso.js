const mongoose = require('mongoose');

const AvisoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  conteudo: { type: String },
  turmas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Turma' }],
  autor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Aviso', AvisoSchema);
