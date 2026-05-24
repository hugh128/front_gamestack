import { useEffect, useState } from "react";
import { sessionsAPI, playersAPI, gamesAPI } from "../utils/api";
import { Spinner, Modal, Toast, ConfirmDialog, Badge, EmptyState, StatCard } from "../components/UI";

const MODOS = ["historia", "multijugador", "cooperativo", "competitivo", "libre"];
const PLATAFORMAS = ["PC", "PS5", "PS4", "Xbox Series X", "Xbox One", "Nintendo Switch", "Mobile"];

const modoColor = {
  historia: "cyan", multijugador: "pink", cooperativo: "green",
  competitivo: "yellow", libre: "gray",
};

const emptySession = {
  jugadorId: "", jugadorUsername: "", juegoId: "", juegoTitulo: "",
  fechaInicio: new Date().toISOString().slice(0, 16),
  fechaFin: "", plataforma: "PC", modoJuego: "libre", notas: "",
  estadisticas: { puntuacion: 0, muertes: 0, victorias: 0, derrotas: 0 },
};

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [players, setPlayers] = useState([]);
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [filtroModo, setFiltroModo] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [form, setForm] = useState(emptySession);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filtroModo) params.modo = filtroModo;
      const [sessRes, playRes, gameRes, statsRes] = await Promise.all([
        sessionsAPI.getAll(params),
        playersAPI.getAll(),
        gamesAPI.getAll(),
        sessionsAPI.getStats(),
      ]);
      setSessions(sessRes.data.data);
      setPlayers(playRes.data.data);
      setGames(gameRes.data.data);
      setStats(statsRes.data.data);
    } catch {
      showToast("Error cargando datos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [filtroModo]);

  const openCreate = () => { setForm(emptySession); setEditSession(null); setShowModal(true); };
  const openEdit = (s) => {
    setForm({
      ...s,
      fechaInicio: s.fechaInicio ? new Date(s.fechaInicio).toISOString().slice(0, 16) : "",
      fechaFin: s.fechaFin ? new Date(s.fechaFin).toISOString().slice(0, 16) : "",
    });
    setEditSession(s._id);
    setShowModal(true);
  };

  const handlePlayerChange = (playerId) => {
    const player = players.find((p) => p._id === playerId);
    setForm((f) => ({ ...f, jugadorId: playerId, jugadorUsername: player?.username || "" }));
  };

  const handleGameChange = (gameId) => {
    const game = games.find((g) => g._id === gameId);
    setForm((f) => ({ ...f, juegoId: gameId, juegoTitulo: game?.titulo || "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      if (!payload.fechaFin) delete payload.fechaFin;
      if (editSession) {
        await sessionsAPI.update(editSession, payload);
        showToast("Sesión actualizada");
      } else {
        await sessionsAPI.create(payload);
        showToast("Sesión registrada");
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      showToast(err.response?.data?.message || "Error guardando sesión", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await sessionsAPI.delete(confirm.id);
      showToast("Sesión eliminada");
      setConfirm({ open: false, id: null });
      fetchAll();
    } catch {
      showToast("Error eliminando sesión", "error");
    }
  };

  const formatDuration = (min) => {
    if (!min) return "—";
    const h = Math.floor(min / 60);
    const m = min % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const formatDate = (d) => d ? new Date(d).toLocaleString("es-GT", { dateStyle: "short", timeStyle: "short" }) : "—";

  return (
    <div className="space-y-8 animate-in">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <ConfirmDialog
        isOpen={confirm.open}
        message="¿Eliminar esta sesión de juego?"
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, id: null })}
      />

      <div className="flex items-center justify-between">
        <h1 className="section-title text-2xl text-white flex-1">
          <span className="text-neon-green mr-3">◎</span> Sesiones de Juego
        </h1>
        <button className="btn-cyber btn-cyber-green" onClick={openCreate}>+ NUEVA SESIÓN</button>
      </div>

      {/* Mini stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatCard label="Total Sesiones" value={stats.totalSesiones} color="green" />
          <StatCard label="Minutos Totales" value={`${stats.totalHoras}m`} color="cyan" />
          <StatCard label="Modos Jugados" value={stats.porModo?.length || 0} color="pink" />
        </div>
      )}

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <select className="input-cyber max-w-[200px]" value={filtroModo} onChange={(e) => setFiltroModo(e.target.value)}>
          <option value="">Todos los modos</option>
          {MODOS.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
        {filtroModo && (
          <button className="btn-cyber btn-cyber-pink text-xs" onClick={() => setFiltroModo("")}>LIMPIAR</button>
        )}
      </div>

      {loading ? <Spinner /> : sessions.length === 0 ? <EmptyState message="No hay sesiones registradas" /> : (
        <div className="grid gap-3">
          {sessions.map((s) => (
            <div key={s._id} className="card-cyber p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap mb-1">
                    <span className="font-display font-bold text-white text-sm">{s.jugadorUsername || "—"}</span>
                    <span className="font-mono text-xs text-slate-500">▶</span>
                    <span className="font-mono text-sm text-[var(--neon-cyan)]">{s.juegoTitulo || "—"}</span>
                    <Badge text={s.modoJuego} color={modoColor[s.modoJuego] || "gray"} />
                    {s.completada && <Badge text="COMPLETADA" color="green" />}
                  </div>
                  <div className="flex flex-wrap gap-4 font-mono text-xs text-slate-500 mb-1">
                    <span>📅 {formatDate(s.fechaInicio)}</span>
                    {s.fechaFin && <span>→ {formatDate(s.fechaFin)}</span>}
                    <span className="text-[var(--neon-green)]">⏱ {formatDuration(s.duracionMinutos)}</span>
                    <span>🎮 {s.plataforma}</span>
                  </div>
                  {/* Stats */}
                  {s.estadisticas && Object.values(s.estadisticas).some((v) => v > 0) && (
                    <div className="flex flex-wrap gap-3 font-mono text-xs mt-1">
                      {s.estadisticas.puntuacion > 0 && <span className="text-[var(--neon-yellow)]">★ {s.estadisticas.puntuacion}</span>}
                      {s.estadisticas.victorias > 0 && <span className="text-[var(--neon-green)]">✓ {s.estadisticas.victorias}V</span>}
                      {s.estadisticas.derrotas > 0 && <span className="text-[var(--neon-pink)]">✗ {s.estadisticas.derrotas}D</span>}
                      {s.estadisticas.muertes > 0 && <span className="text-slate-400">💀 {s.estadisticas.muertes}</span>}
                    </div>
                  )}
                  {s.notas && <p className="text-xs text-slate-500 mt-1 italic">"{s.notas}"</p>}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button className="btn-cyber btn-cyber-green text-xs" onClick={() => openEdit(s)}>EDITAR</button>
                  <button className="btn-cyber btn-cyber-pink text-xs" onClick={() => setConfirm({ open: true, id: s._id })}>ELIMINAR</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editSession ? "EDITAR SESIÓN" : "NUEVA SESIÓN"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-cyber">Jugador *</label>
              <select className="input-cyber" required value={form.jugadorId} onChange={(e) => handlePlayerChange(e.target.value)}>
                <option value="">Seleccionar jugador...</option>
                {players.map((p) => <option key={p._id} value={p._id}>{p.username}</option>)}
              </select>
            </div>
            <div>
              <label className="label-cyber">Juego *</label>
              <select className="input-cyber" required value={form.juegoId} onChange={(e) => handleGameChange(e.target.value)}>
                <option value="">Seleccionar juego...</option>
                {games.map((g) => <option key={g._id} value={g._id}>{g.titulo}</option>)}
              </select>
            </div>
            <div>
              <label className="label-cyber">Plataforma *</label>
              <select className="input-cyber" required value={form.plataforma} onChange={(e) => setForm({ ...form, plataforma: e.target.value })}>
                {PLATAFORMAS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label-cyber">Modo de Juego</label>
              <select className="input-cyber" value={form.modoJuego} onChange={(e) => setForm({ ...form, modoJuego: e.target.value })}>
                {MODOS.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="label-cyber">Fecha Inicio</label>
              <input className="input-cyber" type="datetime-local" value={form.fechaInicio}
                onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })} />
            </div>
            <div>
              <label className="label-cyber">Fecha Fin (opcional)</label>
              <input className="input-cyber" type="datetime-local" value={form.fechaFin}
                onChange={(e) => setForm({ ...form, fechaFin: e.target.value })} />
            </div>
          </div>

          {/* Estadísticas */}
          <div>
            <div className="label-cyber mb-3">Estadísticas de Partida</div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "puntuacion", label: "Puntuación" },
                { key: "victorias", label: "Victorias" },
                { key: "derrotas", label: "Derrotas" },
                { key: "muertes", label: "Muertes" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="label-cyber">{label}</label>
                  <input
                    className="input-cyber"
                    type="number"
                    step={key === "kda" ? "0.1" : "1"}
                    min="0"
                    value={form.estadisticas?.[key] || 0}
                    onChange={(e) => setForm({ ...form, estadisticas: { ...form.estadisticas, [key]: +e.target.value } })}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="label-cyber">Notas</label>
            <input className="input-cyber" value={form.notas || ""} onChange={(e) => setForm({ ...form, notas: e.target.value })} placeholder="Notas opcionales sobre la partida..." />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-cyber btn-cyber-pink" onClick={() => setShowModal(false)}>CANCELAR</button>
            <button type="submit" className="btn-cyber btn-cyber-green">{editSession ? "ACTUALIZAR" : "REGISTRAR"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
