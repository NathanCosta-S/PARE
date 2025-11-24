import mongoose from "mongoose";

const AtribuicaoAlunoSchema = new mongoose.Schema(
  {
    aluno: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    turma: { type: mongoose.Schema.Types.ObjectId, ref: "Turma", required: true }
  },
  { timestamps: true }
);

export default mongoose.model("AtribuicaoAluno", AtribuicaoAlunoSchema);
