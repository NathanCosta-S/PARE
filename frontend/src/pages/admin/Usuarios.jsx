import { useEffect, useState } from "react";
import axios from "axios";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "professor",
    password: "",
  });

  // Carregar lista de usuários
  const loadUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/admin/users");
      setUsuarios(response.data);
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
    }
  };

  // Abrir modal para criar novo usuário
  const handleNewUser = () => {
    setEditingUser(null);
    setFormData({ name: "", email: "", role: "professor", password: "" });
    setIsOpen(true);
  };

  // Abrir modal para edição
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role, password: "" });
    setIsOpen(true);
  };

  // Excluir usuário
  const handleDelete = async (id) => {
    if (confirm("Tem certeza que deseja excluir este usuário?")) {
      try {
        await axios.delete(`http://localhost:4000/api/admin/users/${id}`);
        alert("Usuário removido!");
        loadUsuarios();
      } catch (error) {
        console.error("Erro ao excluir usuário:", error);
        alert("Erro ao excluir!");
      }
    }
  };

  // Salvar ou atualizar usuário
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Atualizando usuário
        await axios.put(
          `http://localhost:4000/api/admin/users/${editingUser._id}`,
          formData
        );
        alert("Usuário atualizado com sucesso!");
      } else {
        // Novo usuário
        await axios.post("http://localhost:4000/api/admin/users", formData);
        alert("Usuário cadastrado!");
      }

      setIsOpen(false);
      setEditingUser(null);
      loadUsuarios();
      setFormData({ name: "", email: "", role: "professor", password: "" });

    } catch (error) {
      console.error("Erro ao salvar usuário:", error);
      alert("Erro ao salvar!");
    }
  };

  useEffect(() => {
    loadUsuarios();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-white">Gerenciar Usuários</h1>
        <button
          onClick={handleNewUser}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg"
        >
          + Novo Usuário
        </button>
      </header>

      {/* Tabela */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-left text-gray-700">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Email</th>
              <th className="p-3">Tipo</th>
              <th className="p-3 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  Nenhum usuário cadastrado
                </td>
              </tr>
            ) : (
              usuarios.map((user) => (
                <tr key={user._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3 flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                  className="px-3 py-1 border border-orange-700 text-orange-700 rounded hover:bg-orange-50"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
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
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {editingUser ? "Editar Usuário" : "Novo Usuário"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Nome completo"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full border p-2 rounded"
              />

              <input
                type="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border p-2 rounded"
              />

              <select
                required
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full border p-2 rounded"
              >
                <option value="professor">Professor</option>
                <option value="aluno">Aluno</option>
              </select>

              <input
                type="password"
                placeholder={editingUser ? "Nova senha (opcional)" : "Senha"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full border p-2 rounded"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700"
                >
                  {editingUser ? "Salvar Alterações" : "Salvar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
