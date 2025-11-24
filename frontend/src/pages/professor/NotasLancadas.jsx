import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api";
import { Loader2 } from "lucide-react";

export default function NotasLancadas() {
  const { turmaId } = useParams();
  const [turma, setTurma] = useState(null);
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarNotas(); 
  }, [turmaId]);

  async function carregarNotas() {
    try {
      setLoading(true);
      const turmaRes = await api.get(`/turmas/${turmaId}`);
      const notasRes = await api.get(`/notas/turma/${turmaId}`);
      setTurma(turmaRes.data);
      setNotas(notasRes.data || []);
    } catch (error) {
      console.error(error);
      alert("Nao foi possivel carregar as notas lancadas.");
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
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <p className="text-sm text-white uppercase tracking-wide">Turma</p>
          <h1 className="text-2xl font-bold text-white">{turma?.nome}</h1>
          <p className="text-sm text-white">
            Notas lancadas (visiveis apenas para voce e cada aluno).
          </p>
        </div>
      </header>

      {notas.length === 0 ? (
        <p className="text-gray-600">
          Nenhuma nota lancada ainda para esta turma. Volte apos registrar as notas.
        </p>
      ) : (
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">Aluno</th>
                <th className="p-3 text-center">P1</th>
                <th className="p-3 text-center">P2</th>
                <th className="p-3 text-center">T1</th>
                <th className="p-3 text-center">T2</th>
                <th className="p-3 text-center">Media</th>
                <th className="p-3 text-center">Atualizado</th>
              </tr>
            </thead>
            <tbody>
              {notas.map((nota) => (
                <tr key={nota._id} className="border-t">
                  <td className="p-3 font-medium">
                    {nota.alunoId?.name || "Aluno"}
                  </td>
                  <td className="p-3 text-center">{nota.p1}</td>
                  <td className="p-3 text-center">{nota.p2}</td>
                  <td className="p-3 text-center">{nota.t1}</td>
                  <td className="p-3 text-center">{nota.t2}</td>
                  <td className="p-3 text-center font-semibold text-orange-700">
                    {Number(nota.media || 0).toFixed(2)}
                  </td>
                  <td className="p-3 text-center text-sm text-gray-500">
                    {nota.updatedAt
                      ? new Date(nota.updatedAt).toLocaleDateString()
                      : "--"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
