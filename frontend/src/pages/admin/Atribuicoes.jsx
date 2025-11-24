import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Loader2, Users, GraduationCap, Link2 } from "lucide-react";

export default function Atribuicoes() {
  const [professores, setProfessores] = useState([]);
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [atribuicoesProfessor, setAtribuicoesProfessor] = useState([]);
  const [atribuicoesAluno, setAtribuicoesAluno] = useState([]);

  const [professorSelecionado, setProfessorSelecionado] = useState("");
  const [turmaProfessorSelecionada, setTurmaProfessorSelecionada] = useState("");
  const [materiasSelecionadas, setMateriasSelecionadas] = useState([]);

  const [alunoSelecionado, setAlunoSelecionado] = useState("");
  const [turmaAlunoSelecionada, setTurmaAlunoSelecionada] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [usersRes, turmasRes, materiasRes, atribProfRes, atribAlunoRes] =
        await Promise.all([
          api.get("/admin/users"),
          api.get("/turmas"),
          api.get("/materias"),
          api.get("/atrib-professor"),
          api.get("/atrib-aluno"),
        ]);

      setProfessores(usersRes.data.filter((u) => u.role === "professor"));
      setAlunos(usersRes.data.filter((u) => u.role === "aluno"));
      setTurmas(turmasRes.data);
      setMaterias(materiasRes.data);
      setAtribuicoesProfessor(atribProfRes.data);
      setAtribuicoesAluno(atribAlunoRes.data);
    } catch (e) {
      console.error(e);
    }
  };

  const salvarProfessor = async () => {
    if (!professorSelecionado || !turmaProfessorSelecionada || materiasSelecionadas.length === 0) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/atrib-professor", {
        professorId: professorSelecionado,
        turmaId: turmaProfessorSelecionada,
        materias: materiasSelecionadas,
      });
      await carregarDados();
      alert("Professor atribuído com sucesso!");
    } finally {
      setLoading(false);
    }
  };

  const salvarAluno = async () => {
    if (!alunoSelecionado || !turmaAlunoSelecionada) {
      alert("Preencha todos os campos.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/atrib-aluno", {
        aluno: alunoSelecionado,
        turma: turmaAlunoSelecionada,
      });
      await carregarDados();
      alert("Aluno atribuído com sucesso!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10 animate-fadeIn">
      <h1 className="text-3xl text-white font-bold flex items-center gap-2">
        <Link2 className="w-7 h-7 text-white" /> Atribuições
      </h1>

      {/* Vincular Professor */}
      <div className="bg-white shadow-xl rounded-2xl border border-orange-200 p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-orange-600">
          <GraduationCap /> Vincular Professor
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="p-3 rounded-xl border bg-gray-50"
            value={professorSelecionado}
            onChange={(e) => setProfessorSelecionado(e.target.value)}
          >
            <option value="">Selecione o professor</option>
            {professores.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className="p-3 rounded-xl border bg-gray-50"
            value={turmaProfessorSelecionada}
            onChange={(e) => setTurmaProfessorSelecionada(e.target.value)}
          >
            <option value="">Selecione a turma</option>
            {turmas.map((t) => (
              <option key={t._id} value={t._id}>
                {t.nome}
              </option>
            ))}
          </select>

          {/* CHECKBOXES DE MATÉRIAS */}
          <div className="space-y-2">
            <label className="font-medium text-gray-700">Matérias</label>

            <div className="border rounded-xl p-3 bg-gray-50 max-h-40 overflow-y-auto space-y-2">
              {materias.map((m) => (
                <label key={m._id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={materiasSelecionadas.includes(m._id)}
                    onChange={() => {
                      if (materiasSelecionadas.includes(m._id)) {
                        setMateriasSelecionadas(materiasSelecionadas.filter((id) => id !== m._id));
                      } else {
                        setMateriasSelecionadas([...materiasSelecionadas, m._id]);
                      }
                    }}
                    className="accent-orange-600 w-4 h-4"
                  />
                  <span>{m.nome}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={salvarProfessor}
          className="bg-orange-600 hover:bg-orange-700 text-white w-full py-3 rounded-xl text-lg transition"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Salvar"}
        </button>
      </div>

      {/* Lista de professores */}
      <div className="bg-white shadow-md rounded-2xl border p-6 space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700">
          <Users /> Professores Atribuídos
        </h2>

        {atribuicoesProfessor.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhuma atribuição registrada.</p>
        ) : (
          <div className="space-y-3">
            {atribuicoesProfessor.map((item) => (
              <div
                key={item._id}
                className="bg-gray-50 rounded-xl p-4 border shadow-sm hover:shadow-md transition"
              >
                <p><strong>Professor:</strong> {item.professorId?.name}</p>
                <p><strong>Turma:</strong> {item.turmaId?.nome}</p>
                <p className="text-sm text-gray-600 mt-2">
                  <strong>Matérias:</strong> {item.materias?.map((m) => m.nome).join(", ")}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vincular aluno */}
      <div className="bg-white shadow-xl rounded-2xl border border-orange-200 p-6 space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-orange-700">
          <Users /> Vincular Aluno
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="p-3 rounded-xl border bg-gray-50"
            value={alunoSelecionado}
            onChange={(e) => setAlunoSelecionado(e.target.value)}
          >
            <option value="">Selecione o aluno</option>
            {alunos.map((a) => (
              <option key={a._id} value={a._id}>
                {a.name}
              </option>
            ))}
          </select>

          <select
            className="p-3 rounded-xl border bg-gray-50"
            value={turmaAlunoSelecionada}
            onChange={(e) => setTurmaAlunoSelecionada(e.target.value)}
          >
            <option value="">Selecione a turma</option>
            {turmas.map((t) => (
              <option key={t._id} value={t._id}>
                {t.nome}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={salvarAluno}
          className="bg-orange-700 hover:bg-orange-800 text-white w-full py-3 rounded-xl text-lg transition"
        >
          {loading ? <Loader2 className="animate-spin mx-auto" /> : "Salvar"}
        </button>
      </div>

      {/* Lista de alunos */}
      <div className="bg-white shadow-md rounded-2xl border p-6 space-y-3">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-gray-700">
          <Users /> Alunos Atribuídos
        </h2>

        {atribuicoesAluno.length === 0 ? (
          <p className="text-gray-500 text-sm">Nenhuma atribuição registrada.</p>
        ) : (
          <div className="space-y-3">
            {atribuicoesAluno.map((item) => (
              <div
                key={item._id}
                className="bg-gray-50 rounded-xl p-4 border shadow-sm hover:shadow-md transition"
              >
                <p><strong>Aluno:</strong> {item.aluno?.name}</p>
                <p><strong>Turma:</strong> {item.turma?.nome}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
