import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../lib/api"; 

export default function HistoricoChamada() {
  const { turmaId } = useParams();
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (turmaId) {
      loadHistorico();
    }
  }, [turmaId]);

  const loadHistorico = async () => {
    try {
      const res = await api.get(`/chamada/historico/${turmaId}`);
      setHistorico(res.data);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-bold mb-4">Histórico de Chamada</h1>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl text-white font-bold mb-4">Histórico de Chamada</h1>

      {historico.length === 0 ? (
        <p>Nenhuma chamada registrada.</p>
      ) : (
        <div className="space-y-4">
          {historico.map((c, index) => (
            <div key={index} className="p-4 bg-white shadow rounded">
              <p className="font-semibold">
                📅 Data: {new Date(c.data).toLocaleDateString()}
              </p>

              <table className="w-full mt-2 border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2">Aluno</th>
                    <th className="p-2">Presença</th>
                  </tr>
                </thead>
                <tbody>
                  {c.presencas.map((p, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{p.aluno?.name || "Aluno removido"}</td>
                      <td className="p-2">
                        {p.presente ? "✔️ Presente" : "❌ Ausente"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
