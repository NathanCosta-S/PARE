const mongoose = require("mongoose");

const atribuicaoProfessorSchema = new mongoose.Schema({
  professorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  turmaId: { type: mongoose.Schema.Types.ObjectId, ref: "Turma", required: true },
  materias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Materia" }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AtribuicaoProfessor", atribuicaoProfessorSchema);
