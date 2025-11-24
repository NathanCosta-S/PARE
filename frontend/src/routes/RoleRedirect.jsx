import { Navigate } from "react-router-dom";

export default function RoleRedirect() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <Navigate to="/login" />;

  const routeMap = {
    admin: "/admin",
    professor: "/professor",
    aluno: "/aluno",
  };

  return <Navigate to={routeMap[user.role]} replace />;
}
