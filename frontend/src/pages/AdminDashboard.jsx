import { useState } from "react";
import Usuarios from "./admin/Usuarios";
import TurmasMaterias from "./admin/TurmasMaterias";
import Atribuicoes from "./admin/Atribuicoes";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [tab, setTab] = useState("dashboard");

  return (
    <main className="container-page mx-auto py-6 space-y-6">

      {/* Header */}
      <header className="flex flex-col gap-1 mb-4">
        <h1 className="text-2xl font-semibold text-white">
          Painel do Administrador
        </h1>
        <p className="text-sm text-white">
          Gerencie usuários, turmas, matérias e atribuições.
        </p>
        {user && (
          <p className="text-xs text-white">
            Logado como: <span className="font-semibold">{user.email}</span>
          </p>
        )}
      </header>

      {/* Menu */}
      <nav className="flex gap-2 border-b border-gray-300 pb-2">
        <button
          onClick={() => setTab("dashboard")}
          className={`px-4 py-2 rounded-md font-medium transition ${
            tab === "dashboard"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Dashboard
        </button>

        <button
          onClick={() => setTab("usuarios")}
          className={`px-4 py-2 rounded-md font-medium transition ${
            tab === "usuarios"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Usuários
        </button>

        <button
          onClick={() => setTab("turmas")}
          className={`px-4 py-2 rounded-md font-medium transition ${
            tab === "turmas"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Turmas & Matérias
        </button>

        <button
          onClick={() => setTab("atribuicoes")}
          className={`px-4 py-2 rounded-md font-medium transition ${
            tab === "atribuicoes"
              ? "bg-orange-600 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Atribuições
        </button>
      </nav>

      {/* Conteúdo */}
      {tab === "dashboard" && (
        <>
          {/* Stats */}
          <section className="grid gap-4 sm:grid-cols-3">
            <div className="stat">
              <div className="stat-body">
                <div>
                  <p className="stat-label">Usuários cadastrados</p>
                  <p className="stat-value">—</p>
                </div>
              </div>
            </div>

            <div className="stat">
              <div className="stat-body">
                <div>
                  <p className="stat-label">Turmas ativas</p>
                  <p className="stat-value">—</p>
                </div>
              </div>
            </div>

            <div className="stat">
              <div className="stat-body">
                <div>
                  <p className="stat-label">Matérias cadastradas</p>
                  <p className="stat-value">—</p>
                </div>
              </div>
            </div>
          </section>

          {/* Ações rápidas */}
          <section className="grid gap-4 md:grid-cols-3">
            <div className="card">
              <div className="card-body space-y-2">
                <h2 className="card-title">Gerenciar Usuários</h2>
                <p className="card-muted">
                  Cadastre, edite ou remova professores e alunos.
                </p>
                <button
                  onClick={() => setTab("usuarios")}
                  className="btn btn-primary text-sm mt-2"
                >
                  Ir para Usuários
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-body space-y-2">
                <h2 className="card-title">Turmas e Matérias</h2>
                <p className="card-muted">
                  Organize turmas e matérias do sistema.
                </p>
                <button
                  onClick={() => setTab("turmas")}
                  className="btn btn-primary text-sm mt-2"
                >
                  Ir para Turmas/Matérias
                </button>
              </div>
            </div>

            <div className="card">
              <div className="card-body space-y-2">
                <h2 className="card-title">Atribuições</h2>
                <p className="card-muted">
                  Vincule professores e alunos às turmas corretas.
                </p>
                <button
                  onClick={() => setTab("atribuicoes")}
                  className="btn btn-primary text-sm mt-2"
                >
                  Ir para Atribuições
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {tab === "usuarios" && <Usuarios />}
      {tab === "turmas" && <TurmasMaterias />}
      {tab === "atribuicoes" && <Atribuicoes />}
    </main>
  );
}
