import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Games from "./pages/Games";
import Players from "./pages/Players";
import Sessions from "./pages/Sessions";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[var(--dark-950)]">
        <div className="bg-grid fixed inset-0 pointer-events-none" />
        <Navbar />
        <main className="relative max-w-7xl mx-auto px-6 pt-20 pb-12">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/games" element={<Games />} />
            <Route path="/players" element={<Players />} />
            <Route path="/sessions" element={<Sessions />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
