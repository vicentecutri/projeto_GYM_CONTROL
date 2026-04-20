import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <header className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
        <h1 className="text-2xl font-black italic text-red-600">GYM<span className="text-white">CONTROL</span></h1>
        <div className="flex items-center gap-4">
          <span className="text-zinc-400">Olá, Treinador</span>
          <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center font-bold">F</div>
        </div>
      </header>

      <section className="mb-12">
        <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">Gerenciamento Principal</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MenuButton title="Alunos" icon="👥" subtitle="Gestão de matrículas" to="/alunos" />
          <MenuButton title="Produtos" icon="🥤" subtitle="Venda de suplementos" to="/produtos" />
          <MenuButton title="Treinos" icon="🏋️‍♂️" subtitle="Planilhas e exercícios" to="/treinos" />
        </div>
      </section>

      <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-6">Visão Geral</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total de Alunos" value="128" color="text-blue-500" />
        <StatCard title="Ativos Agora" value="24" color="text-green-500" />
        <StatCard title="Atrasados" value="7" color="text-red-500" />
      </div>
    </div>
  );
}

function MenuButton({ title, icon, subtitle, to }) {
  return (
    <Link to={to} className="block">
      <button className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-xl text-left hover:border-red-600 transition-all group active:scale-95">
        <div className="text-3xl mb-3">{icon}</div>
        <h3 className="text-lg font-bold group-hover:text-red-500 transition-colors">{title}</h3>
        <p className="text-zinc-500 text-sm">{subtitle}</p>
      </button>
    </Link>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl shadow-lg">
      <h3 className="text-zinc-400 text-xs uppercase font-semibold">{title}</h3>
      <p className={`text-4xl font-black mt-2 ${color}`}>{value}</p>
    </div>
  );
}

export default Home;