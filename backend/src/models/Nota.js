const mongoose = require("mongoose");

const NotaSchema = new mongoose.Schema(
  {
    alunoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    turmaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Turma",
      required: true,
    },
    professorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    p1: { type: Number, required: true },
    p2: { type: Number, required: true },
    t1: { type: Number, required: true },
    t2: { type: Number, required: true },
    media: { type: Number, required: true },
    dataLancamento: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Evita notas duplicadas para o mesmo aluno na mesma turma
NotaSchema.index({ alunoId: 1, turmaId: 1 }, { unique: true });

module.exports = mongoose.model("Nota", NotaSchema);
