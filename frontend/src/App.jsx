import { Routes, Route, Navigate } from "react-router-dom";

// ---------- PÁGINAS ----------
import Login from "./pages/Login";

import AdminDashboard from "./pages/AdminDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import AlunoDashboard from "./pages/AlunoDashboard";
import NotasAluno from "./pages/aluno/Notas";

import Usuarios from "./pages/admin/Usuarios";
import Turmas from "./pages/Turmas";
import Atribuicoes from "./pages/admin/Atribuicoes";

// PROFESSOR
import ProfessorTurmas from "./pages/professor/ProfessorTurmas";
import Chamada from "./pages/professor/Chamada";
import HistoricoChamada from "./pages/professor/HistoricoChamada";
import LancarNota from "./pages/professor/LancarNota";
import NotasLancadas from "./pages/professor/NotasLancadas";
import Calendario from "./pages/Calendario";

// Layout e proteção
import ProtectedRoute from "./routes/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import RoleRedirect from "./routes/RoleRedirect";

export default function App() {
  return (
    <Routes>
      {/* Publico */}
      <Route path="/login" element={<Login />} />

      {/* Protegido */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Redirecionamento pós login */}
        <Route path="/" element={<RoleRedirect />} />

        {/* Admin */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/turmas" element={<Turmas />} />
        <Route path="/atribuicoes" element={<Atribuicoes />} />

        {/* Professor */}
        <Route path="/professor" element={<ProfessorDashboard />} />
        <Route path="/professor/turmas" element={<ProfessorTurmas />} />

        {/* ✔ ROTAS QUE ESTAVAM DESLOGANDO */}
        <Route path="/professor/chamada/:turmaId" element={<Chamada />} />
        <Route
          path="/professor/historico-chamada/:turmaId"
          element={<HistoricoChamada />}
        />

        <Route path="/professor/notas/:turmaId" element={<LancarNota />} />
        <Route
          path="/professor/notas-lancadas/:turmaId"
          element={<NotasLancadas />}
        />

        {/* Aluno */}
        <Route path="/aluno" element={<AlunoDashboard />} />
        <Route path="/aluno/notas" element={<NotasAluno />} />

        {/* Todos: Calendario */}
        <Route path="/calendario" element={<Calendario />} />
      </Route>

      {/* Rota fallback */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}
