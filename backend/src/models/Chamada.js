import mongoose from "mongoose";

const PresencaSchema = new mongoose.Schema({
  aluno: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: true 
  },
  presente: { 
    type: Boolean, 
    default: false 
  }
});

const ChamadaSchema = new mongoose.Schema({
  turma: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Turma", 
    required: true 
  },
  data: { 
    type: Date, 
    default: Date.now 
  },
  presencas: {
    type: [PresencaSchema],
    required: true,
    default: [] 
  }
}, {
  timestamps: true
});

export default mongoose.model("Chamada", ChamadaSchema);