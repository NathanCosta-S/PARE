import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { Loader2 } from "lucide-react";

export default function NotasAluno() {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarNotas();
  }, []);

  async function carregarNotas() {
    try {
      const { data } = await api.get("/notas/minhas");
      setNotas(data || []);
    } catch (error) {
      console.error(error);
      alert("Nao foi possivel carregar suas notas.");
    } finally {
      setLoading(false);
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
    <div className="max-w-4xl mx-auto p-6 space-y-5">
      <header className="space-y-1">
        <p className="text-sm text-gray-600 uppercase tracking-wide">Minhas notas</p>
        <h1 className="text-2xl font-bold text-gray-900">Notas e medias</h1>
        <p className="text-sm text-gray-600">
          Apenas voce e seus professores conseguem visualizar essas informacoes.
        </p>
      </header>

      {notas.length === 0 ? (
        <p className="text-gray-600">
          Voce ainda nao possui notas registradas. Volte mais tarde.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {notas.map((nota) => (
            <div
              key={nota._id}
              className="bg-white border rounded-xl shadow-sm p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase text-gray-500">Turma</p>
                  <p className="text-lg font-semibold">
                    {nota?.turmaId?.nome || "Turma"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Media</p>
                  <p className="text-2xl font-bold text-orange-700">
                    {Number(nota.media || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Professor:</span>{" "}
                  {nota?.professorId?.name || "Nao informado"}
                </p>
                <p>
                  <span className="font-semibold">Materia:</span>{" "}
                  {nota?.materias?.length
                    ? nota.materias.map((m) => m.nome).join(", ")
                    : "Nao informada"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-800">
                <p>
                  <span className="font-semibold">P1:</span> {nota.p1}
                </p>
                <p>
                  <span className="font-semibold">P2:</span> {nota.p2}
                </p>
                <p>
                  <span className="font-semibold">T1:</span> {nota.t1}
                </p>
                <p>
                  <span className="font-semibold">T2:</span> {nota.t2}
                </p>
              </div>

              <p className="text-xs text-gray-500">
                Ultima atualizacao:{" "}
                {nota.updatedAt
                  ? new Date(nota.updatedAt).toLocaleDateString()
                  : "--"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
