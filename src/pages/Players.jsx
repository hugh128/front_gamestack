import { useEffect, useState } from "react";
import { playersAPI } from "../utils/api";
import { Spinner, Modal, Toast, ConfirmDialog, Badge, EmptyState } from "../components/UI";

const RANGOS = ["Bronce", "Plata", "Oro", "Platino", "Diamante", "Maestro", "Gran Maestro"];
const PLATAFORMAS = ["PC", "PS5", "PS4", "Xbox Series X", "Xbox One", "Nintendo Switch", "Mobile"];

const rangoColor = {
  Bronce: "yellow", Plata: "gray", Oro: "yellow", Platino: "cyan",
  Diamante: "cyan", Maestro: "pink", "Gran Maestro": "pink",
};

const emptyPlayer = {
  username: "", email: "", nombre: "", apellido: "", pais: "", biografia: "", nivel: 1, xp: 0,
  plataformaFavorita: "", rangoCompetitivo: "Bronce", activo: true,
};

export default function Players() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroRango, setFiltroRango] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editPlayer, setEditPlayer] = useState(null);
  const [form, setForm] = useState(emptyPlayer);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showLogroModal, setShowLogroModal] = useState(false);

  const showToast = (msg, type = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (filtroRango) params.rango = filtroRango;
      const res = await playersAPI.getAll(params);
      setPlayers(res.data.data);
    } catch {
      showToast("Error cargando jugadores", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlayers(); }, [search, filtroRango]);

  const openCreate = () => { setForm(emptyPlayer); setEditPlayer(null); setShowModal(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditPlayer(p._id); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editPlayer) {
        await playersAPI.update(editPlayer, form);
        showToast("Jugador actualizado");
      } else {
        await playersAPI.create(form);
        showToast("Jugador creado");
      }
      setShowModal(false);
      fetchPlayers();
    } catch (err) {
      showToast(err.response?.data?.message || "Error guardando jugador", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await playersAPI.delete(confirm.id);
      showToast("Jugador eliminado");
      setConfirm({ open: false, id: null });
      fetchPlayers();
    } catch {
      showToast("Error eliminando jugador", "error");
    }
  };

  const handleAddLogro = async (e) => {
    e.preventDefault();
    try {
      await playersAPI.addLogro(selectedPlayer._id, logroForm);
      showToast("Logro desbloqueado 🏆");
      setShowLogroModal(false);
      fetchPlayers();
    } catch {
      showToast("Error agregando logro", "error");
    }
  };

  const handleDeleteLogro = async (playerId, logroId) => {
    try {
      await playersAPI.deleteLogro(playerId, logroId);
      showToast("Logro eliminado");
      fetchPlayers();
    } catch {
      showToast("Error eliminando logro", "error");
    }
  };

  return (
    <div className="space-y-8 animate-in">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <ConfirmDialog
        isOpen={confirm.open}
        message="¿Eliminar este jugador? Se perderán todos sus datos."
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, id: null })}
      />

      <div className="flex items-center justify-between">
        <h1 className="section-title text-2xl text-white flex-1">
          <span className="text-neon-pink mr-3">◉</span> Jugadores
        </h1>
        <button className="btn-cyber btn-cyber-pink" onClick={openCreate}>+ NUEVO JUGADOR</button>
      </div>

      <div className="flex flex-wrap gap-3">
        <input className="input-cyber max-w-xs" placeholder="Buscar username..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <select className="input-cyber max-w-[180px]" value={filtroRango} onChange={(e) => setFiltroRango(e.target.value)}>
          <option value="">Todos los rangos</option>
          {RANGOS.map((r) => <option key={r}>{r}</option>)}
        </select>
        {(search || filtroRango) && (
          <button className="btn-cyber btn-cyber-pink text-xs" onClick={() => { setSearch(""); setFiltroRango(""); }}>LIMPIAR</button>
        )}
      </div>

      {loading ? <Spinner /> : players.length === 0 ? <EmptyState message="No hay jugadores registrados" /> : (
        <div className="grid gap-4">
          {players.map((player) => (
            <div key={player._id} className="card-cyber p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-display font-bold text-white text-sm">
                      {player.username}
                    </h3>
                    <Badge text={player.rangoCompetitivo} color={rangoColor[player.rangoCompetitivo] || "cyan"} />
                    {!player.activo && <Badge text="INACTIVO" color="pink" />}
                  </div>
                  <div className="font-mono text-xs text-slate-500 mb-2">{player.email}</div>
                  <div className="flex flex-wrap gap-3 font-mono text-xs">
                    <span className="text-[var(--neon-cyan)]">LVL {player.nivel}</span>
                    <span className="text-[var(--neon-yellow)]">{player.xp} XP</span>
                    <span className="text-slate-400">{player.totalHorasJugadas}h jugadas</span>
                    {player.pais && <span className="text-slate-500">📍 {player.pais}</span>}
                    {player.plataformaFavorita && <span className="text-slate-500">🎮 {player.plataformaFavorita}</span>}
                  </div>
                  {player.biografia && (
                    <p className="text-xs text-slate-400 font-body mt-2 line-clamp-1">{player.biografia}</p>
                  )}
                  {player.logros?.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[rgba(0,245,255,0.08)]">
                      <div className="font-mono text-xs text-slate-500 mb-2 uppercase tracking-widest">
                        Logros ({player.logros.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {player.logros.slice(0, 4).map((l) => (
                          <div key={l._id} className="flex items-center gap-1 bg-[var(--dark-950)] px-2 py-1 group">
                            <span className="font-mono text-xs text-[var(--neon-yellow)]">🏆 {l.nombre}</span>
                            <span className="text-[var(--neon-yellow)] font-mono text-xs">+{l.puntos}xp</span>
                            <button
                              className="ml-1 text-[var(--neon-pink)] opacity-0 group-hover:opacity-100 text-xs"
                              onClick={() => handleDeleteLogro(player._id, l._id)}
                            >✕</button>
                          </div>
                        ))}
                        {player.logros.length > 4 && (
                          <span className="font-mono text-xs text-slate-500">+{player.logros.length - 4} más</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button className="btn-cyber btn-cyber-pink text-xs" onClick={() => openEdit(player)}>EDITAR</button>
                  <button
                    className="btn-cyber btn-cyber-green text-xs"
                    onClick={() => { setSelectedPlayer(player); setShowLogroModal(true); setLogroForm({ nombre: "", descripcion: "", puntos: 10 }); }}
                  >LOGRO</button>
                  <button className="btn-cyber text-xs" onClick={() => setConfirm({ open: true, id: player._id })}>ELIMINAR</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Player */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editPlayer ? "EDITAR JUGADOR" : "NUEVO JUGADOR"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-cyber">Username *</label>
              <input className="input-cyber" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>

            <div>
              <label className="label-cyber">Email *</label>
              <input className="input-cyber" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div>
              <label className="label-cyber">Nombre *</label>
              <input className="input-cyber" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>

            <div>
              <label className="label-cyber">Apellido *</label>
              <input className="input-cyber" required value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
            </div>

            <div>
              <label className="label-cyber">País</label>
              <input className="input-cyber" value={form.pais || ""} onChange={(e) => setForm({ ...form, pais: e.target.value })} />
            </div>
            <div>
              <label className="label-cyber">Plataforma Favorita</label>
              <select className="input-cyber" value={form.plataformaFavorita || ""} onChange={(e) => setForm({ ...form, plataformaFavorita: e.target.value })}>
                <option value="">Seleccionar...</option>
                {PLATAFORMAS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="label-cyber">Rango Competitivo</label>
              <select className="input-cyber" value={form.rangoCompetitivo} onChange={(e) => setForm({ ...form, rangoCompetitivo: e.target.value })}>
                {RANGOS.map((r) => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="label-cyber">Nivel</label>
              <input className="input-cyber" type="number" min="1" value={form.nivel} onChange={(e) => setForm({ ...form, nivel: +e.target.value })} />
            </div>
          </div>
          <div>
            <label className="label-cyber">Biografía</label>
            <textarea className="input-cyber min-h-[70px] resize-none" value={form.biografia || ""} onChange={(e) => setForm({ ...form, biografia: e.target.value })} />
          </div>
          <div className="flex items-center gap-3">
            <input type="checkbox" id="activo" checked={form.activo} onChange={(e) => setForm({ ...form, activo: e.target.checked })} className="accent-[var(--neon-cyan)]" />
            <label htmlFor="activo" className="font-mono text-xs text-slate-400">Jugador activo</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-cyber btn-cyber-pink" onClick={() => setShowModal(false)}>CANCELAR</button>
            <button type="submit" className="btn-cyber">{editPlayer ? "ACTUALIZAR" : "CREAR"}</button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
