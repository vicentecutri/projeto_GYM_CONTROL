import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEntrar = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-white">
      <h1 className="text-5xl font-black text-red-600 mb-10 tracking-tighter italic">
        GYM<span className="text-white">CONTROL</span>
      </h1>

      <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-8 text-center">Acesse sua conta</h2>

        <form onSubmit={handleEntrar} className="space-y-5">
          <div>
            <label className="text-zinc-400 text-xs font-semibold uppercase mb-2 block text-left">E-mail</label>
            <input 
              type="email" 
              placeholder="admin@gymcontrol.com" 
              className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-zinc-400 text-xs font-semibold uppercase mb-2 block text-left">Senha</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg focus:ring-2 focus:ring-red-600 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 uppercase tracking-wider"
          >
            Entrar no Painel
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;