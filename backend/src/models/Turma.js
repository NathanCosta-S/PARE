import mongoose from "mongoose";

const TurmaSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true },

    // Lista de alunos vinculados à turma
    alunos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // modelo de usuário (aluno)
      },
    ],

    // Lista de professores + matérias atribuídas
    professores: [
      {
        professorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        materias: [{ type: mongoose.Schema.Types.ObjectId, ref: "Materia" }],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Turma", TurmaSchema);
