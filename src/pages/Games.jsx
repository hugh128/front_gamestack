import { useEffect, useState } from "react";
import { gamesAPI } from "../utils/api";
import { Spinner, Modal, Toast, ConfirmDialog, Badge, EmptyState } from "../components/UI";

const GENEROS = ["Acción", "RPG", "Estrategia", "Deportes", "Aventura", "Terror", "Puzzle", "Simulación", "Plataformas", "FPS", "MOBA", "Battle Royale"];
const PLATAFORMAS = ["PC", "PS5", "PS4", "Xbox Series X", "Xbox One", "Nintendo Switch", "Mobile", "Mac"];
const ESTADOS = ["disponible", "agotado", "proximamente"];

const emptyGame = {
  titulo: "", desarrollador: "", publisher: "", anioLanzamiento: new Date().getFullYear(),
  generos: [], plataformas: [], descripcion: "", precio: 0, estado: "disponible", etiquetas: [],
};

export default function Games() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtroGenero, setFiltroGenero] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editGame, setEditGame] = useState(null);
  const [form, setForm] = useState(emptyGame);
  const [toast, setToast] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });
  const [selectedGame, setSelectedGame] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ autor: "", puntuacion: 8, comentario: "" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchGames = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (filtroGenero) params.genero = filtroGenero;
      const res = await gamesAPI.getAll(params);
      setGames(res.data.data);
    } catch {
      showToast("Error cargando juegos", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGames(); }, [search, filtroGenero]);

  const openCreate = () => { setForm(emptyGame); setEditGame(null); setShowModal(true); };
  const openEdit = (game) => {
    setForm({ ...game, generos: game.generos || [], plataformas: game.plataformas || [], etiquetas: game.etiquetas || [] });
    setEditGame(game._id);
    setShowModal(true);
  };

  const handleToggleArray = (field, value) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(value) ? f[field].filter((v) => v !== value) : [...f[field], value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editGame) {
        await gamesAPI.update(editGame, form);
        showToast("Juego actualizado correctamente");
      } else {
        await gamesAPI.create(form);
        showToast("Juego creado correctamente");
      }
      setShowModal(false);
      fetchGames();
    } catch {
      showToast("Error guardando el juego", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await gamesAPI.delete(confirm.id);
      showToast("Juego eliminado");
      setConfirm({ open: false, id: null });
      fetchGames();
    } catch {
      showToast("Error eliminando juego", "error");
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      await gamesAPI.addReview(selectedGame._id, reviewForm);
      showToast("Review agregada");
      setShowReviewModal(false);
      fetchGames();
    } catch {
      showToast("Error agregando review", "error");
    }
  };

  const handleDeleteReview = async (gameId, reviewId) => {
    try {
      await gamesAPI.deleteReview(gameId, reviewId);
      showToast("Review eliminada");
      fetchGames();
    } catch {
      showToast("Error eliminando review", "error");
    }
  };

  const estadoColor = { disponible: "green", agotado: "pink", proximamente: "yellow" };

  return (
    <div className="space-y-8 animate-in">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <ConfirmDialog
        isOpen={confirm.open}
        message="¿Eliminar este juego? Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, id: null })}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="section-title text-2xl text-white flex-1">
          <span className="text-neon-cyan mr-3">◆</span> Catálogo de Juegos
        </h1>
        <button className="btn-cyber" onClick={openCreate}>+ NUEVO JUEGO</button>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3">
        <input
          className="input-cyber max-w-xs"
          placeholder="Buscar por título..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input-cyber max-w-[180px]"
          value={filtroGenero}
          onChange={(e) => setFiltroGenero(e.target.value)}
        >
          <option value="">Todos los géneros</option>
          {GENEROS.map((g) => <option key={g}>{g}</option>)}
        </select>
        {(search || filtroGenero) && (
          <button className="btn-cyber btn-cyber-pink text-xs" onClick={() => { setSearch(""); setFiltroGenero(""); }}>
            LIMPIAR
          </button>
        )}
      </div>

      {/* Lista */}
      {loading ? <Spinner /> : games.length === 0 ? <EmptyState message="No hay juegos registrados" /> : (
        <div className="grid gap-4">
          {games.map((game) => (
            <div key={game._id} className="card-cyber p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="font-display font-bold text-white text-sm">{game.titulo}</h3>
                    <Badge text={game.estado} color={estadoColor[game.estado]} />
                    {game.puntuacionPromedio > 0 && (
                      <span className="font-mono text-xs text-[var(--neon-yellow)]">★ {game.puntuacionPromedio}</span>
                    )}
                  </div>
                  <div className="font-mono text-xs text-slate-500 mb-2">
                    {game.desarrollador} · {game.anioLanzamiento} · ${game.precio}
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {game.generos?.map((g) => <Badge key={g} text={g} color="cyan" />)}
                    {game.plataformas?.map((p) => <Badge key={p} text={p} color="gray" />)}
                  </div>
                  {game.descripcion && (
                    <p className="text-xs text-slate-400 font-body line-clamp-2">{game.descripcion}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button className="btn-cyber text-xs" onClick={() => openEdit(game)}>EDITAR</button>
                  <button
                    className="btn-cyber btn-cyber-green text-xs"
                    onClick={() => { setSelectedGame(game); setShowReviewModal(true); setReviewForm({ autor: "", puntuacion: 8, comentario: "" }); }}
                  >
                    REVIEW
                  </button>
                  <button
                    className="btn-cyber btn-cyber-pink text-xs"
                    onClick={() => setConfirm({ open: true, id: game._id })}
                  >
                    ELIMINAR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Juego */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editGame ? "EDITAR JUEGO" : "NUEVO JUEGO"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-cyber">Título *</label>
              <input className="input-cyber" required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} />
            </div>
            <div>
              <label className="label-cyber">Desarrollador *</label>
              <input className="input-cyber" required value={form.desarrollador} onChange={(e) => setForm({ ...form, desarrollador: e.target.value })} />
            </div>
            <div>
              <label className="label-cyber">Publisher</label>
              <input className="input-cyber" value={form.publisher} onChange={(e) => setForm({ ...form, publisher: e.target.value })} />
            </div>
            <div>
              <label className="label-cyber">Año *</label>
              <input className="input-cyber" type="number" required value={form.anioLanzamiento} onChange={(e) => setForm({ ...form, anioLanzamiento: +e.target.value })} />
            </div>
            <div>
              <label className="label-cyber">Precio (Q)</label>
              <input className="input-cyber" type="number" step="0.01" value={form.precio} onChange={(e) => setForm({ ...form, precio: +e.target.value })} />
            </div>
            <div>
              <label className="label-cyber">Estado</label>
              <select className="input-cyber" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                {ESTADOS.map((e) => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="label-cyber">Descripción</label>
            <textarea className="input-cyber min-h-[80px] resize-none" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          </div>
          <div>
            <label className="label-cyber mb-2">Géneros</label>
            <div className="flex flex-wrap gap-2">
              {GENEROS.map((g) => (
                <button type="button" key={g}
                  className={`badge-cyber cursor-pointer transition-all ${form.generos.includes(g) ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,245,255,0.08)]" : "border-slate-700 text-slate-500 hover:border-slate-500"}`}
                  onClick={() => handleToggleArray("generos", g)}
                >{g}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="label-cyber mb-2">Plataformas</label>
            <div className="flex flex-wrap gap-2">
              {PLATAFORMAS.map((p) => (
                <button type="button" key={p}
                  className={`badge-cyber cursor-pointer transition-all ${form.plataformas.includes(p) ? "border-[var(--neon-pink)] text-[var(--neon-pink)] bg-[rgba(255,0,110,0.08)]" : "border-slate-700 text-slate-500 hover:border-slate-500"}`}
                  onClick={() => handleToggleArray("plataformas", p)}
                >{p}</button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="btn-cyber btn-cyber-pink" onClick={() => setShowModal(false)}>CANCELAR</button>
            <button type="submit" className="btn-cyber">{editGame ? "ACTUALIZAR" : "CREAR"}</button>
          </div>
        </form>
      </Modal>

      {/* Modal Review */}
      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title={`REVIEW: ${selectedGame?.titulo}`}>
        <form onSubmit={handleAddReview} className="space-y-4">
          <div>
            <label className="label-cyber">Autor *</label>
            <input className="input-cyber" required value={reviewForm.autor} onChange={(e) => setReviewForm({ ...reviewForm, autor: e.target.value })} />
          </div>
          <div>
            <label className="label-cyber">Puntuación (1-10) *</label>
            <input className="input-cyber" type="number" min="1" max="10" required value={reviewForm.puntuacion}
              onChange={(e) => setReviewForm({ ...reviewForm, puntuacion: +e.target.value })} />
          </div>
          <div>
            <label className="label-cyber">Comentario</label>
            <textarea className="input-cyber min-h-[80px] resize-none" value={reviewForm.comentario}
              onChange={(e) => setReviewForm({ ...reviewForm, comentario: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" className="btn-cyber btn-cyber-pink" onClick={() => setShowReviewModal(false)}>CANCELAR</button>
            <button type="submit" className="btn-cyber btn-cyber-green">AGREGAR</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
