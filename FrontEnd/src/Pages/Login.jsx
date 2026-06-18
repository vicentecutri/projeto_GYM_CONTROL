import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Services/api';

function Login() {
  const navigate = useNavigate();
  
  // Estado para gerenciar a animação de entrada dos elementos da interface
  const [contentReady, setContentReady] = useState(false);
  
  // Inicialização dos estados lógicos utilizando dados persistidos no localStorage
  const [email, setEmail] = useState(() => localStorage.getItem('rememberedEmail') || '');
  const [password, setPassword] = useState(() => localStorage.getItem('rememberedPassword') || '');
  const [rememberMe, setRememberMe] = useState(() => {
    return Boolean(localStorage.getItem('rememberedEmail') && localStorage.getItem('rememberedPassword'));
  });

  // Gatilho executado imediatamente após a montagem do componente no DOM
  useEffect(() => {
    const frame = requestAnimationFrame(() => setContentReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Processamento do formulário de autenticação e comunicação com a API
  const handleEntrar = async (e) => {
    e.preventDefault();

    try {
      // Requisição HTTP POST enviando as credenciais de acesso
      const response = await api.post('/login', {
        email: email,
        senha: password 
      });

      // Extração do token de autenticação JWT retornado pelo servidor
      const { token } = response.data;

      // Tratamento dinâmico do payload de usuário do backend com fallbacks seguros
      const userData = response.data.usuario || response.data.user || response.data;
      const userName = userData.nome || email.split('@')[0]; 
      const userRole = userData.role || userData.tipo || 'Aluno'; 

      // Armazenamento das variáveis de sessão no Storage do navegador
      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userRole', userRole);

      // Gerenciamento da persistência de credenciais com base na escolha do usuário
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberedPassword', password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }

      // Redirecionamento programático para a rota principal do dashboard
      navigate('/home');

    } catch (error) {
      console.error("Erro ao tentar logar:", error.response?.data);
      alert("Erro ao acessar: " + (error.response?.data?.message || error.response?.data?.error || "E-mail ou senha inválidos."));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-white font-sans antialiased">
      
      {/* Container estrutural animado via propriedades css controladas pelo estado do React */}
      <div className={`flex flex-col items-center justify-center w-full transition-all duration-300 ease-in-out ${
        contentReady ? 'opacity-100 transform-none' : 'opacity-0 scale-[0.99]'
      }`}>
        
        {/* Cabeçalho de identificação visual do sistema */}
        <header className="mb-8 text-center select-none">
          <h1 className="text-5xl font-black text-red-600 tracking-tighter italic uppercase">
            GYM<span className="text-white">CONTROL</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">
            Management System
          </p>
        </header>

        {/* Formulário de autenticação corporativo */}
        <div className="bg-zinc-900 border border-zinc-800/80 p-8 rounded-2xl shadow-2xl w-full max-w-sm transition-all">
          <div className="mb-6">
            <h2 className="text-xl font-black tracking-tight text-zinc-100">Acesse sua conta</h2>
            <p className="text-zinc-500 text-xs mt-1">Informe suas credenciais operacionais</p>
          </div>

          <form onSubmit={handleEntrar} className="space-y-5">
            {/* Campo de entrada: Identificador do Usuário */}
            <div>
              <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">
                E-mail corporativo
              </label>
              <input 
                type="email" 
                placeholder="Ex: admin@gymcontrol.com" 
                className="w-full bg-zinc-950 border border-zinc-800 text-white p-3.5 rounded-xl text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition-all placeholder:text-zinc-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Campo de entrada: Credencial de Segurança */}
            <div>
              <label className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-2 block">
                Senha de acesso
              </label>
              <input 
                type="password" 
                placeholder="••••••••••••" 
                className="w-full bg-zinc-950 border border-zinc-800 text-white p-3.5 rounded-xl text-sm focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition-all placeholder:text-zinc-700 tracking-widest"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Componente checkbox de persistência local de credenciais */}
            <div className="flex items-center text-sm text-zinc-400 pt-1 pb-1">
              <label className="flex items-center gap-3 cursor-pointer select-none hover:text-zinc-300 text-xs font-medium transition-colors">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-red-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-red-600"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Lembrar meus dados neste dispositivo
              </label>
            </div>

            {/* Mecanismo de disparo de submissão de dados */}
            <button 
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all duration-200 active:scale-[0.99] mt-2 shadow-lg shadow-red-600/10"
            >
              Entrar no Painel
            </button>
          </form>
        </div>

        {/* Rodapé com declaração de direitos autorais e escopo institucional */}
        <footer className="mt-8 text-zinc-600 text-[10px] font-bold uppercase tracking-widest select-none">
          &copy; {new Date().getFullYear()} GymControl S.A.
        </footer>

      </div>
    </div>
  );
}

export default Login;