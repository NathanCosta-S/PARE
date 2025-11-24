import { Outlet } from "react-router-dom";
import Header from "../components/Header";

export default function AppLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return null; 

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-transparent p-4">
        <Outlet />
      </main>
    </div>
  );
}
