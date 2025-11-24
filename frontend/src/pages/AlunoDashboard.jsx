import React, { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Loader2 } from "lucide-react";

export default function AlunoDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const { data } = await api.get("/aluno/dashboard-dados");
      setDados(data);
    } catch (error) {
      console.error(error);
      alert("Nao foi possivel carregar suas informacoes.");
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

  const frequencia = dados?.frequencia || { presentes: 0, ausentes: 0, total: 0 };
  const historicoPresenca = dados?.historicoPresenca || [];
  const notas = dados?.notas || [];

  return (
    <main className="container-page mx-auto py-6 space-y-6">
      <header className="flex flex-col gap-2 mb-4">
        <h1 className="text-2xl font-semibold text-white">Painel do Aluno</h1>
        <p className="text-sm text-white">
          Veja sua turma, frequencia e notas lancadas pelos professores.
        </p>
        {user && (
          <p className="text-xs text-white">
            Logado como: <span className="font-semibold">{user.email}</span>
          </p>
        )}
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="card md:col-span-1">
          <div className="card-body space-y-2">
            <h2 className="card-title">Minha turma</h2>
            {dados?.turma ? (
              <>
                <p className="text-lg font-semibold text-orange-700">
                  {dados.turma.nome}
                </p>
                <p className="text-sm text-gray-600">
                  Frequencia: {frequencia.presentes} presentes / {frequencia.ausentes} ausentes (total {frequencia.total})
                </p>
              </>
            ) : (
              <p className="text-gray-600 text-sm">
                Nenhuma turma atribuida no momento.
              </p>
            )}
          </div>
        </div>

        <div className="card md:col-span-2">
          <div className="card-body space-y-2">
            <h2 className="card-title">Historico de presencas</h2>
            {historicoPresenca.length === 0 ? (
              <p className="text-gray-600 text-sm">
                Nenhuma chamada registrada ainda.
              </p>
            ) : (
              <div className="max-h-64 overflow-y-auto border rounded-lg">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      <th className="p-2">Data</th>
                      <th className="p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicoPresenca
                      .sort((a, b) => new Date(b.data) - new Date(a.data))
                      .map((item, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="p-2">
                            {item.data ? new Date(item.data).toLocaleDateString() : "--"}
                          </td>
                          <td className="p-2">
                            {item.presente ? "Presente" : "Ausente"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-body space-y-3">
          <h2 className="card-title">Notas e medias</h2>
          <p className="card-muted text-sm">
            Apenas voce e seus professores podem ver essas informacoes.
          </p>

          {notas.length === 0 ? (
            <p className="text-gray-600 text-sm">Nenhuma nota registrada ainda.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {notas.map((nota) => (
                <div key={nota._id} className="border rounded-lg p-4 shadow-sm space-y-2 bg-white">
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
      </section>
    </main>
  );
}
