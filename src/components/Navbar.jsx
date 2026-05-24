import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Dashboard", icon: "◈" },
  { to: "/games", label: "Juegos", icon: "◆" },
  { to: "/players", label: "Jugadores", icon: "◉" },
  { to: "/sessions", label: "Sesiones", icon: "◎" },
];

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-[var(--dark-950)]/90 backdrop-blur-md border-b border-[rgba(0,245,255,0.1)]">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border border-[var(--neon-cyan)] flex items-center justify-center">
            <div className="w-2 h-2 bg-[var(--neon-cyan)]" style={{ boxShadow: "0 0 8px var(--neon-cyan)" }} />
          </div>
          <span className="font-display font-black text-sm tracking-[0.2em] text-neon-cyan">
            GAME<span className="text-[var(--neon-pink)]">STACK</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-1.5 font-display text-xs tracking-widest uppercase transition-all duration-200 ${
                  isActive
                    ? "text-[var(--neon-cyan)] border-b border-[var(--neon-cyan)]"
                    : "text-slate-500 hover:text-slate-200"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>

        {/* Indicador de estado */}
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[var(--neon-green)] animate-pulse" />
          <span className="font-mono text-xs text-slate-500">ONLINE</span>
        </div>
      </div>
    </nav>
  );
}
