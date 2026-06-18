import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  
  // Estado responsável pelo controle de opacidade na montagem da interface
  const [contentReady, setContentReady] = useState(false);

  // Recuperação das variáveis de estado e sessão armazenadas localmente
  const nomeUsuario = localStorage.getItem('userName') || 'Usuário';
  const cargoUsuario = localStorage.getItem('userRole') || 'Aluno';
  const primeiraLetra = nomeUsuario.charAt(0).toUpperCase();

  // Lifecycle: Executado após a renderização inicial para gatilho da animação
  useEffect(() => {
    const animationId = requestAnimationFrame(() => setContentReady(true));
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Procedimento de encerramento de sessão e limpeza do LocalStorage
  const handleLogout = () => {
    const confirmar = window.confirm("Deseja realmente sair da sua conta?");
    if (!confirmar) return;

    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    
    navigate('/'); 
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12 font-sans antialiased">
      
      {/* Container estrutural condicionado à flag de animação pós-montagem */}
      <div className={`max-w-5xl mx-auto transition-all duration-300 ease-in-out ${
        contentReady ? 'opacity-100 transform-none' : 'opacity-0 scale-[0.99]'
      }`}>
        
        {/* Cabeçalho operacional com exibição de metadados do usuário logado */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 border-b border-zinc-900 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter text-red-600 uppercase">
              GYM<span className="text-white">CONTROL</span>
            </h1>
            <p className="text-zinc-500 text-xs mt-1 font-bold uppercase tracking-widest">Painel Operacional</p>
          </div>
          
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex items-center gap-3 border-r border-zinc-900 pr-4">
              <div className="text-right hidden sm:block">
                <span className="block text-zinc-200 text-sm font-semibold">{nomeUsuario}</span>
                <span className="block text-zinc-500 text-[10px] font-bold uppercase tracking-wider">{cargoUsuario}</span>
              </div>
              
              <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-red-700 rounded-xl flex items-center justify-center font-black text-white text-md shadow-lg shadow-red-600/10">
                {primeiraLetra}
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="bg-zinc-900/60 border border-zinc-800 hover:border-red-600/40 hover:text-red-500 text-zinc-400 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all duration-200 active:scale-95 flex items-center gap-2 hover:bg-zinc-900"
            >
              <span>Sair</span> 🚪
            </button>
          </div>
        </header>

        {/* Seção de navegação para os módulos principais do sistema */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-1 w-8 bg-red-600 rounded-full"></div>
            <h2 className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Gerenciamento Principal</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <MenuButton title="Alunos" icon="👥" subtitle="Gestão de matrículas e acessos de alunos" to="/alunos" />
            <MenuButton title="Treinos" icon="🏋️‍♂️" subtitle="Montagem de planilhas e rotinas de treinos" to="/treinos" />
          </div>
        </section>

        {/* Seção consolidada para exibição de indicadores (Dashboard) */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-1 w-8 bg-zinc-700 rounded-full"></div>
            <h2 className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Visão Geral da Unidade</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard title="Total de Alunos" value="128" color="text-blue-500" borderColor="hover:border-blue-500/20" />
            <StatCard title="Ativos Agora" value="24" color="text-green-500" borderColor="hover:border-green-500/20" />
            <StatCard title="Atrasados" value="7" color="text-red-500" borderColor="hover:border-red-500/20" />
          </div>
        </section>

      </div>
    </div>
  );
}

// Componente auxiliar para renderização dos botões de acesso aos módulos
function MenuButton({ title, icon, subtitle, to }) {
  return (
    <Link to={to} className="block group">
      <div className="w-full h-full bg-zinc-900/40 border border-zinc-800/80 p-6 rounded-2xl text-left hover:border-red-600/50 hover:bg-zinc-900/80 transition-all duration-300 shadow-xl hover:shadow-red-600/5 hover:-translate-y-1 flex flex-col justify-between">
        <div>
          <div className="text-2xl bg-zinc-950 w-12 h-12 flex items-center justify-center rounded-xl mb-4 border border-zinc-800 group-hover:border-red-600/30 group-hover:bg-red-600/10 transition-all duration-300">
            {icon}
          </div>
          <h3 className="text-lg font-black tracking-tight group-hover:text-red-500 transition-colors duration-200">
            {title}
          </h3>
          <p className="text-zinc-400 text-xs mt-1 font-medium leading-relaxed">
            {subtitle}
          </p>
        </div>
        <div className="text-zinc-600 group-hover:text-red-500 text-xs font-bold uppercase tracking-wider mt-5 flex items-center gap-1 transition-colors duration-200">
          Acessar módulo <span className="transform group-hover:translate-x-1 transition-transform inline-block">→</span>
        </div>
      </div>
    </Link>
  );
}

// Componente auxiliar para cards informativos e métricas
function StatCard({ title, value, color, borderColor }) {
  return (
    <div className={`bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-2xl shadow-xl transition-all duration-300 ${borderColor} hover:bg-zinc-900/60`}>
      <h3 className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">{title}</h3>
      <div className="flex items-baseline justify-between mt-2">
        <p className={`text-3xl font-black tracking-tighter ${color}`}>
          {value}
        </p>
        <span className="text-zinc-700 text-[10px] font-bold uppercase tracking-wider">Unidades</span>
      </div>
    </div>
  );
}

export default Home;