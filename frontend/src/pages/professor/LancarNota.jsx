import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { Loader2 } from "lucide-react";

// Campos de notas + média local
const estadoInicialNotas = { p1: "", p2: "", t1: "", t2: "", media: null };

const calcularMediaLocal = (dados) => {
  const total =
    Number(dados.p1 || 0) +
    Number(dados.p2 || 0) +
    Number(dados.t1 || 0) +
    Number(dados.t2 || 0);
  return Number((total / 4).toFixed(2));
};

export default function LancarNota() {
  const { turmaId } = useParams();
  const [turma, setTurma] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState("");
  const [notas, setNotas] = useState(estadoInicialNotas);
  const [loading, setLoading] = useState(true);
  const [carregandoNota, setCarregandoNota] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    carregarDadosTurma();
  }, [turmaId]);

  useEffect(() => {
    if (alunoSelecionado) {
      carregarNotaDoAluno(alunoSelecionado);
    } else {
      setNotas(estadoInicialNotas);
    }
  }, [alunoSelecionado]);

  async function carregarDadosTurma() {
    try {
      setLoading(true);
      const { data } = await api.get(`/turmas/${turmaId}`);
      setTurma(data);
      setAlunos(data.alunos || []);
    } catch (error) {
      console.error(error);
      alert("Nao foi possivel carregar a turma.");
    } finally {
      setLoading(false);
    }
  }

  async function carregarNotaDoAluno(alunoId) {
    try {
      setCarregandoNota(true);
      const { data } = await api.get(`/notas/turma/${turmaId}/aluno/${alunoId}`);
      setNotas({
        p1: data.p1,
        p2: data.p2,
        t1: data.t1,
        t2: data.t2,
        media: data.media,
      });
    } catch (err) {
      if (err?.response?.status === 404) {
        setNotas(estadoInicialNotas);
      } else {
        console.error(err);
        alert("Erro ao buscar notas do aluno.");
      }
    } finally {
      setCarregandoNota(false);
    }
  }

  function alterarNota(campo, valor) {
    const normalizado = valor === "" ? "" : Number(valor);
    setNotas((prev) => {
      const atualizado = { ...prev, [campo]: normalizado };
      const todosPreenchidos = ["p1", "p2", "t1", "t2"].every(
        (c) => atualizado[c] !== ""
      );

      return {
        ...atualizado,
        media: todosPreenchidos ? calcularMediaLocal(atualizado) : null,
      };
    });
  }

  async function salvarNotas() {
    if (!alunoSelecionado) {
      alert("Selecione o aluno para lancar notas.");
      return;
    }

    const campos = ["p1", "p2", "t1", "t2"];
    if (campos.some((c) => notas[c] === "")) {
      alert("Preencha P1, P2, T1 e T2 para calcular a media.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        alunoId: alunoSelecionado,
        turmaId,
        p1: Number(notas.p1),
        p2: Number(notas.p2),
        t1: Number(notas.t1),
        t2: Number(notas.t2),
      };

      const { data } = await api.post("/notas/lancar", payload);

      setNotas({
        p1: data.p1,
        p2: data.p2,
        t1: data.t1,
        t2: data.t2,
        media: data.media,
      });

      alert("Notas salvas com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar notas.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-10 text-center">
        <Loader2 className="animate-spin mx-auto w-10 h-10 text-orange-700" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="space-y-1">
        <p className="text-sm text-white uppercase tracking-wide">Turma</p>
        <h1 className="text-2xl font-bold text-white">{turma?.nome}</h1>
      </header>

      <div className="bg-white shadow rounded-xl p-5 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-600">Selecione o aluno</label>
            <select
              value={alunoSelecionado}
              onChange={(e) => setAlunoSelecionado(e.target.value)}
              className="border rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Escolha um aluno --</option>
              {alunos.map((aluno) => (
                <option key={aluno._id} value={aluno._id}>
                  {aluno.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 text-sm">
            {alunoSelecionado ? (
              <>
                <p className="text-gray-700">
                  <span className="font-semibold">Aluno:</span>{" "}
                  {alunos.find((a) => a._id === alunoSelecionado)?.name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold ">Turma:</span> {turma?.nome}
                </p>
              </>
            ) : (
              <p className="text-gray-600">
                Escolha um aluno para visualizar ou lancar as notas e media.
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {[
            { campo: "p1", label: "P1" },
            { campo: "p2", label: "P2" },
            { campo: "t1", label: "T1" },
            { campo: "t2", label: "T2" },
          ].map(({ campo, label }) => (
            <div key={campo} className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={notas[campo]}
                disabled={!alunoSelecionado || carregandoNota}
                onChange={(e) => alterarNota(campo, e.target.value)}
                className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Nota ${label}`}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-gray-50 border rounded-lg p-4">
          <div>
            <p className="text-sm text-gray-600">
              Media = (P1 + P2 + T1 + T2) / 4
            </p>
            <p className="text-3xl font-bold text-gray-900">
              {alunoSelecionado && notas.media !== null ? notas.media.toFixed(2) : "--"}
            </p>
          </div>

          <button
            onClick={salvarNotas}
            disabled={!alunoSelecionado || saving}
            className="bg-orange-700 text-white px-5 py-3 rounded-lg text-lg hover:bg-orange-800 disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Salvar notas"}
          </button>
        </div>

        {carregandoNota && (
          <p className="text-sm text-gray-500">Carregando notas do aluno...</p>
        )}
      </div>
    </div>
  );
}
