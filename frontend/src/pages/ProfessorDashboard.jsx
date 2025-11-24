import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProfessorDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white">Painel do Professor</h1>
      <p className="text-white">
        Acompanhe suas turmas, registre chamadas, notas e ocorrências.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        {/* Minhas Turmas */}
        <div className="bg-white p-6 shadow-md rounded-2xl">
          <h2 className="font-semibold  text-lg">Minhas turmas</h2>
          <p className="text-gray-600 mt-2">
            Veja a lista de turmas em que você está atribuído como professor.
          </p>
          <button
            onClick={() => navigate("/professor/turmas")}
            className="mt-4 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700"
          >
            Ver turmas
          </button>
        </div>

        {/* Chamada */}
        <div className="bg-white p-6 shadow-md rounded-2xl">
          <h2 className="font-semibold text-lg">Chamada / Faltas</h2>
          <p className="text-gray-600 mt-2">
            Registre presença e faltas dos alunos em cada aula.
          </p>
          <button
            onClick={() => navigate("/professor/turmas")} 
            className="mt-4 border px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Lançar chamada
          </button>
        </div>

        {/* Notas */}
        <div className="bg-white p-6 shadow-md rounded-2xl">
          <h2 className="font-semibold text-lg">Notas</h2>
          <p className="text-gray-600 mt-2">
            Lance ou atualize notas de avaliações e trabalhos.
          </p>
          <button
            onClick={() => navigate("/professor/turmas")}
            className="mt-4 border px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Lançar notas
          </button>
        </div>

      </div>
    </div>
  );
}
