import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { gamesAPI, playersAPI, sessionsAPI } from "../utils/api";
import { Spinner, StatCard } from "../components/UI";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [gamesRes, playersRes, sessionsRes, statsRes] = await Promise.all([
          gamesAPI.getAll(),
          playersAPI.getAll(),
          sessionsAPI.getAll(),
          sessionsAPI.getStats(),
        ]);
        setStats({
          totalGames: gamesRes.data.total,
          totalPlayers: playersRes.data.total,
          totalSessions: sessionsRes.data.total,
          totalHoras: Math.round((statsRes.data.data.totalHoras || 0) / 60),
          recentGames: gamesRes.data.data.slice(0, 3),
          recentPlayers: playersRes.data.data.slice(0, 3),
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="space-y-10 animate-in">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-none border border-[rgba(0,245,255,0.1)] p-10 bg-[var(--dark-800)]">
        <div className="absolute inset-0 bg-grid opacity-50" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--neon-cyan)] opacity-[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[var(--neon-pink)] opacity-[0.03] rounded-full blur-3xl" />
        <div className="relative">
          <h1 className="font-display font-black text-4xl text-white mb-1">
            GAME<span className="text-neon-cyan">STACK</span>
          </h1>
          <p className="font-body text-slate-400 text-sm max-w-md mt-3">
            Sistema para gestión de videojuegos, jugadores y estadisticas.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="section-title text-lg text-white mb-6">
          Estadísticas Globales
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Juegos" value={stats?.totalGames ?? 0} color="cyan" icon="◆" />
          <StatCard label="Jugadores" value={stats?.totalPlayers ?? 0} color="pink" icon="◉" />
          <StatCard label="Horas Jugadas" value={`${stats?.totalHoras ?? 0}h`} color="yellow" icon="◈" />
        </div>
      </div>

      {/* Modules */}
      <div>
        <h2 className="section-title text-lg text-white mb-6">Módulos</h2>
        <div className="flex justify-between gap-4">
          {[
            {
              to: "/games",
              label: "Juegos",
              icon: "◆",
              desc: "Gestiona el catálogo de videojuegos. Agrega géneros, plataformas, precios y reviews de usuarios.",
              color: "cyan",
              count: stats?.totalGames,
            },
            {
              to: "/players",
              label: "Jugadores",
              icon: "◉",
              desc: "Administra perfiles de jugadores, logros desbloqueados, XP y rangos competitivos.",
              color: "pink",
              count: stats?.totalPlayers,
            },
          ].map((mod) => (
            <Link
              key={mod.to}
              to={mod.to}
              className={`card-cyber corner-tl corner-br p-6 flex-1 flex flex-col justify-between group transition-all duration-300 hover:scale-[1.01]`}
            >
              <div className={`text-3xl mb-3 text-neon-${mod.color}`}>{mod.icon}</div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display font-bold text-sm tracking-widest uppercase text-white">
                  {mod.label}
                </h3>
                <span className={`font-mono text-sm text-neon-${mod.color}`}>{mod.count}</span>
              </div>
              <p className="font-body text-slate-400 text-xs leading-relaxed">{mod.desc}</p>
              <div className={`mt-4 font-mono text-xs text-neon-${mod.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                ACCEDER →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
