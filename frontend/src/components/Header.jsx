import { NavLink, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return null; // segurança

  // Menu único para todos os perfis
  const menuToShow = [{ label: "Calendario", path: "/calendario" }];

  return (
    <header className="w-full bg-white shadow-md py-3 px-6 flex items-center justify-between">
      {/* LOGO */}
      <div className="flex items-center gap-2">
        <img src="/src/imgs/pare-logo.png" className="h-20" alt="Logo PARE" />
      </div>

      {/* MENU */}
      <nav className="hidden md:flex gap-6">
        {menuToShow.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `text-base font-medium px-2 pb-1 border-b-2 transition-all ${
                isActive
                  ? "border-orange-600 text-orange-700"
                  : "border-transparent text-gray-700 hover:text-orange-600 hover:border-orange-600"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all"
      >
        Sair
      </button>
    </header>
  );
}
