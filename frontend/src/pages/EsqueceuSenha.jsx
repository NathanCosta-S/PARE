import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import logoPare from "../imgs/pare-logo.png";

export default function EsqueceuSenha() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  //  envia email para reset e alterna entre formulário e confirmação de envio
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Chama API para enviar email de recuperação
      await api.post("/auth/esqueceu-senha", { email });
      setEnviado(true);
    } catch (err) {
      console.error("Erro ao enviar email:", err);
      setError("Erro ao enviar email. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: "url('/src/imgs/imagem-EsqueceuSenha.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/40 to-orange-800/40"></div>
      
      {/* Card */}
      <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md relative z-10">
        
        {/* Logo */}
        <div className="flex flex-col items-center mb-4">
          <img
            src={logoPare}
            alt="PARE Logo"
            className="w-48 mb-2"
          />
        </div>

        {/* Linha divisória */}
        <hr className="border-2 border-orange-600 mb-6" />

        {!enviado ? (
          <>
            {/* Título */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-orange-600 mb-2">
                Esqueceu sua senha?
              </h2>
              <p className="text-sm text-gray-600">
                Digite seu email e enviaremos um link para redefinir sua senha
              </p>
            </div>

            {/* Mensagem de erro */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-200 text-black placeholder-black font-semibold text-lg p-4 rounded-xl outline-none focus:ring-2 focus:ring-orange-600"
                  required
                  disabled={loading}
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-orange-700 hover:bg-orange-800 disabled:bg-orange-400 disabled:cursor-not-allowed transition-all duration-300 text-white font-bold text-xl p-4 rounded-full mt-2 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              >
                {loading ? "ENVIANDO..." : "ENVIAR LINK"}
              </button>
            </form>

            {/* Link para voltar ao login */}
            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="text-sm text-gray-600 hover:text-orange-700 transition-colors inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Voltar para o login
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Mensagem de sucesso */}
            <div className="text-center py-6">
              {/* Ícone de sucesso */}
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Email Enviado!
              </h2>
              
              <p className="text-gray-600 mb-2">
                Enviamos um link de recuperação para:
              </p>
              
              <p className="text-orange-700 font-semibold mb-6">
                {email}
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-sm text-left">
                <p className="text-blue-800">
                  <strong>📧 Verifique sua caixa de entrada</strong>
                </p>
                <p className="text-blue-700 mt-2">
                  O email pode levar alguns minutos para chegar. Não se esqueça de verificar a pasta de spam!
                </p>
              </div>

              {/* Botões */}
              <div className="flex flex-col gap-3">
                <Link 
                  to="/login"
                  className="w-full bg-orange-700 hover:bg-orange-800 transition-all duration-300 text-white font-bold text-lg p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 text-center"
                >
                  Voltar para o Login
                </Link>
                
                <button
                  onClick={() => {
                    setEnviado(false);
                    setEmail("");
                  }}
                  className="text-sm text-gray-600 hover:text-orange-700 transition-colors"
                >
                  Enviar para outro email
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
