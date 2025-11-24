import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api";

export default function Chamada() {
  const { turmaId } = useParams();
  const [turma, setTurma] = useState(null);

  const [presencas, setPresencas] = useState({});

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const res = await api.get(`/turmas/${turmaId}`);
      setTurma(res.data);

      const estadoInicial = {};
      res.data.alunos.forEach((aluno) => {
        estadoInicial[aluno._id] = "presente"; 
      });

      setPresencas(estadoInicial);
    } catch (error) {
      console.log(error);
      alert("Erro ao carregar alunos da turma.");
    }
  };


  const salvarChamada = async () => {
    try {
      const presencasFormatadas = Object.entries(presencas).map(
        ([alunoId, status]) => ({
          aluno: alunoId,
          presente: status === "presente",
        })
      );

      await api.post("/chamada/registrar", {
        turmaId,
        presencas: presencasFormatadas,
      });

      alert("Chamada salva com sucesso!");
    } catch (error) {
      console.log(error);
      alert("Erro ao salvar chamada.");
    }
  };

  const marcar = (id, status) => {
    setPresencas((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl text-white font-bold mb-4">
        Chamada — {turma?.nome}
      </h1>

      <table className="w-full border rounded-xl bg-white shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Aluno</th>
            <th className="p-3 text-center">Presente</th>
            <th className="p-3 text-center">Ausente</th>
          </tr>
        </thead>

        <tbody>
          {turma?.alunos?.length ? (
            turma.alunos.map((aluno) => (
              <tr key={aluno._id} className="border-t">
                <td className="p-3">{aluno.name}</td>

                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={presencas[aluno._id] === "presente"}
                    onChange={() => marcar(aluno._id, "presente")}
                    className="w-5 h-5"
                  />
                </td>

                <td className="p-3 text-center">
                  <input
                    type="checkbox"
                    checked={presencas[aluno._id] === "ausente"}
                    onChange={() => marcar(aluno._id, "ausente")}
                    className="w-5 h-5"
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="p-4 text-center text-gray-500">
                Nenhum aluno atribuído a esta turma.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button
        onClick={salvarChamada}
        className="mt-5 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg"
      >
        Salvar Presenças
      </button>
    </div>
  );
}
