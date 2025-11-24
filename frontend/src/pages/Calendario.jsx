export default function Calendario() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="space-y-1">
        <p className="text-sm text-white uppercase tracking-wide">Calendario</p>
        <h1 className="text-3xl font-bold text-white">Calendario escolar - Final de ano</h1>
        <p className="text-sm text-white">
          Visão comum a todos os usuários com o calendário escolar.
        </p>
      </div>

      <div className="bg-white border rounded-2xl shadow overflow-hidden">
        <img
          src="/src/imgs/calendario.jpeg"
          alt="Calendario escolar"
          className="w-full h-auto"
        />
      </div>
    </div>
  );
}
