export const Spinner = () => (
  <div className="flex items-center justify-center p-12">
    <div className="relative w-12 h-12">
      <div className="absolute inset-0 border-2 border-transparent border-t-[var(--neon-cyan)] rounded-full animate-spin" />
      <div className="absolute inset-2 border-2 border-transparent border-b-[var(--neon-pink)] rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.6s" }} />
    </div>
  </div>
);

import { createPortal } from "react-dom";

export const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
      
      <div
        className="relative card-cyber corner-tl corner-br w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[rgba(0,245,255,0.1)]">
          <h2 className="font-display font-bold text-sm tracking-widest uppercase text-neon-cyan">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-[var(--neon-pink)] transition-colors font-mono text-lg"
          >
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export const Toast = ({ message, type = "success", onClose }) => {
  const colors = {
    success: "border-[var(--neon-green)] text-neon-green",
    error: "border-[var(--neon-pink)] text-neon-pink",
    info: "border-[var(--neon-cyan)] text-neon-cyan",
  };
  return (
    <div className={`fixed top-6 right-6 z-[100] card-cyber p-4 min-w-[280px] ${colors[type]} animate-in`}>
      <div className="flex items-center justify-between gap-4">
        <span className="font-mono text-sm">{message}</span>
        <button onClick={onClose} className="opacity-60 hover:opacity-100">✕</button>
      </div>
    </div>
  );
};

export const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/90" onClick={onCancel} />
      <div className="relative card-cyber corner-tl corner-br p-6 max-w-sm w-full animate-in">
        <p className="font-mono text-sm text-slate-300 mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button className="btn-cyber" onClick={onCancel}>Cancelar</button>
          <button className="btn-cyber btn-cyber-pink" onClick={onConfirm}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export const StatCard = ({ label, value, color = "cyan", icon }) => {
  const colors = {
    cyan: "text-neon-cyan border-[rgba(0,245,255,0.2)]",
    pink: "text-neon-pink border-[rgba(255,0,110,0.2)]",
    green: "text-neon-green border-[rgba(57,255,20,0.2)]",
    yellow: "text-[var(--neon-yellow)] border-[rgba(255,190,11,0.2)]",
  };
  return (
    <div className={`card-cyber p-4 border ${colors[color]}`}>
      <div className="font-mono text-xs opacity-60 mb-1 uppercase tracking-widest">{label}</div>
      <div className={`font-display font-bold text-2xl ${colors[color].split(" ")[0]}`}>
        {icon && <span className="mr-2">{icon}</span>}
        {value}
      </div>
    </div>
  );
};

export const Badge = ({ text, color = "cyan" }) => {
  const styles = {
    cyan: "border-[var(--neon-cyan)] text-[var(--neon-cyan)]",
    pink: "border-[var(--neon-pink)] text-[var(--neon-pink)]",
    green: "border-[var(--neon-green)] text-[var(--neon-green)]",
    yellow: "border-[var(--neon-yellow)] text-[var(--neon-yellow)]",
    gray: "border-slate-600 text-slate-400",
  };
  return (
    <span className={`badge-cyber ${styles[color]}`}>{text}</span>
  );
};

export const EmptyState = ({ message = "No hay datos" }) => (
  <div className="text-center py-16 opacity-40">
    <div className="font-display text-4xl mb-3">◈</div>
    <p className="font-mono text-sm">{message}</p>
  </div>
);
