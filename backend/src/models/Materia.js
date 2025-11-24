import mongoose from "mongoose";

const MateriaSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

export default mongoose.model("Materia", MateriaSchema);
