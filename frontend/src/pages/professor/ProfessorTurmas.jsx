import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { Users, History } from "lucide-react";

export default function ProfessorTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    carregarTurmas();
  }, []);

  const carregarTurmas = async () => {
    try {
      const res = await api.get("/atrib-professor");

    
      const turmasProfessor = res.data.filter(
        (item) => item.professorId?._id === user.id
      );

      setTurmas(turmasProfessor);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-20">Carregando...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-white mb-4">Minhas Turmas</h1>

      {turmas.length === 0 ? (
        <p className="text-gray-600">Você não possui turmas atribuídas.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {turmas.map((item) => (
            <div
              key={item._id}
              className="bg-white border rounded-2xl shadow p-5 hover:shadow-lg transition cursor-pointer"
            >
              <h2 className="text-xl font-semibold text-orange-600 mb-1 flex items-center gap-2">
                <Users /> {item.turmaId?.nome}
              </h2>

              <p className="text-gray-700 text-sm mb-2">
                <strong>Matérias:</strong>{" "}
                {item.materias.map((m) => m.nome).join(", ")}
              </p>

              <div className="flex flex-col gap-3 mt-4">
                {/*  LANÇAR CHAMADA */}
                <button
                  onClick={() =>
                    navigate(`/professor/chamada/${item.turmaId._id}`)
                  }
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
                >
                  Lançar Chamada
                </button>

                {/*  HISTÓRICO DE CHAMADA */}
                <button
                  onClick={() =>
                    navigate(`/professor/historico-chamada/${item.turmaId._id}`)
                  }
                  className="bg-orange-700 text-white px-4 py-2 rounded-lg hover:bg-orange-800 flex items-center gap-2"
                >
                  <History size={18} /> Histórico de Chamada
                </button>

                <button
                  onClick={() =>
                    navigate(`/professor/notas/${item.turmaId._id}`)
                  }
                  className="border px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Lançar Notas
                </button>

                <button
                  onClick={() =>
                    navigate(`/professor/notas-lancadas/${item.turmaId._id}`)
                  }
                  className="border px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Notas lancadas
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
