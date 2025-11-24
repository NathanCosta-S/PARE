import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // envia credenciais, guarda token/user e direciona pelo perfil
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/login",
        {
          email,
          password: senha, 
        }
      );

      const { token, user } = response.data;

      if (token && user) {
        // salva token e usuário
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        // redireciona por tipo de usuário
        if (user.role === "admin") {
          navigate("/admin");
        } else if (user.role === "professor") {
          navigate("/professor");
        } else if (user.role === "aluno") {
          navigate("/aluno");
        } else {
          navigate("/"); 
        }
      } else {
        setError("Resposta do servidor inválida.");
      }
    } catch (err) {
      console.error("Erro no login:", err);
      setError("Email ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/src/imgs/background-imagem.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/*  */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-orange-800/10"></div>

      {/* Card de login */}
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-4">
          <img
            src="/src/imgs/pare-logo.png"
            alt="PARE Logo"
            className="w-50 mb-2"
            onError={(e) => {
              console.error("Erro ao carregar logo");
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* linha laranja */}
        <hr className="border-2 border-orange-600 mb-6" />

        {/* erro */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
            {error}
          </div>
        )}

        {/* formulário */}
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-200 text-black placeholder-black font-semibold text-lg p-4 rounded-xl outline-none focus:ring-2 focus:ring-orange-600"
            required
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full bg-gray-200 text-black placeholder-black font-semibold text-lg p-4 rounded-xl outline-none focus:ring-2 focus:ring-orange-600"
            required
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-700 hover:bg-orange-800 disabled:bg-orange-400 disabled:cursor-not-allowed transition-all duration-300 text-white font-bold text-xl p-4 rounded-full mt-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
          >
            {loading ? "ENTRANDO..." : "ENTRAR"}
          </button>
        </form>

        {/* Esqueceu senha */}
        <div className="mt-4 text-center">
          <Link
            to="/esqueceu-senha"
            className="text-sm text-gray-600 hover:text-orange-700 transition-colors"
          >
            Esqueceu sua senha?
          </Link>
        </div>
      </div>
    </div>
  );
}
