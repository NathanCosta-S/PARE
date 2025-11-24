import { useEffect, useState } from "react";
import axios from "axios";

export default function TurmasMaterias() {
  const [tab, setTab] = useState("turmas");

  const [turmas, setTurmas] = useState([]);
  const [materias, setMaterias] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [editId, setEditId] = useState(null);

  // Carregar dados do backend
  async function loadData() {
    try {
      const { data: turmasRes } = await axios.get("http://localhost:4000/api/turmas");
      const { data: materiasRes } = await axios.get("http://localhost:4000/api/materias");
      setTurmas(turmasRes);
      setMaterias(materiasRes);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openModal(item = null) {
    setEditId(item?._id || null);
    setItemName(item?.nome || "");
    setModalOpen(true);
  }

  function closeModal() {
    setItemName("");
    setEditId(null);
    setModalOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const endpoint =
      tab === "turmas" ? "http://localhost:4000/api/turmas" : "http://localhost:4000/api/materias";

    try {
      if (editId) {
        await axios.put(`${endpoint}/${editId}`, { nome: itemName });
      } else {
        await axios.post(endpoint, { nome: itemName });
      }

      closeModal();
      loadData();
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    const endpoint =
      tab === "turmas" ? "http://localhost:4000/api/turmas" : "http://localhost:4000/api/materias";

    try {
      await axios.delete(`${endpoint}/${id}`);
      loadData();
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  }

  const list = tab === "turmas" ? turmas : materias;

  return (
    <main className="container-page mx-auto py-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-white">Turmas & Matérias</h1>
        <button
          onClick={() => openModal()}
          className="btn btn-primary"
        >
          + Nova {tab === "turmas" ? "Turma" : "Matéria"}
        </button>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2">
        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            tab === "turmas" ? "bg-orange-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("turmas")}
        >
          Turmas
        </button>

        <button
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            tab === "materias" ? "bg-orange-600 text-white" : "bg-gray-200"
          }`}
          onClick={() => setTab("materias")}
        >
          Matérias
        </button>
      </div>

      {/* Listagem no estilo de Usuários */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan="2" className="p-4 text-center text-gray-500">
                  Nenhum registro encontrado
                </td>
              </tr>
            ) : (
              list.map((item) => (
                <tr key={item._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{item.nome}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => openModal(item)}
                      className="px-3 py-1 border border-orange-700 text-orange-700 rounded hover:bg-orange-50"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-3 py-1 border border-red-500 text-red-600 rounded hover:bg-red-50"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold">
              {editId ? "Editar" : "Nova"} {tab === "turmas" ? "Turma" : "Matéria"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Nome"
                className="input"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                required
              />

              <div className="flex justify-end gap-2">
                <button onClick={closeModal} type="button" className="btn-ghost">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
