import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../Services/api';

function Treinos() {
  const [alunos, setAlunos] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = useState(true);
  
  // Estado para controlar a renderização do conteúdo após a carga de dados
  const [contentReady, setContentReady] = useState(false);

  const [selectedAluno, setSelectedAluno] = useState('');
  const [tituloTreino, setTituloTreino] = useState('');
  const [statusAtivo, setStatusAtivo] = useState(true);

  // Lista de templates estáticos para seleção rápida
  const treinosPreFeitos = [
    { id: 'p1', titulo: 'Hipertrofia ABC - Avançado' },
    { id: 'p2', titulo: 'Emagrecimento & Definição' },
    { id: 'p3', titulo: 'Adaptação Geral - Iniciante' },
    { id: 'p4', titulo: 'Treino de Força (Powerlifting)' },
    { id: 'p5', titulo: 'Cardio de Alta Intensidade (HIIT)' },
  ];

  useEffect(() => {
    carregarAlunos();
  }, []);

  // Busca os usuários cadastrados no backend
  const carregarAlunos = async () => {
    setLoading(true);
    try {
      const resAlunos = await api.get('/users');
      setAlunos(Array.isArray(resAlunos.data) ? resAlunos.data : []);
    } catch (error) {
      console.error("Erro ao carregar alunos:", error);
    } finally {
      setLoading(false);
      // Sinaliza que a interface pode ser exibida com os dados prontos
      setContentReady(true);
    }
  };

  // Envia a requisição para vincular o treino ao aluno selecionado
  const handleVincularTreino = async (e) => {
    e.preventDefault();
    
    const usuarioLogado = JSON.parse(localStorage.getItem('user'));
    const instrutorId = usuarioLogado?.id;

    if (!selectedAluno || !tituloTreino) {
      alert("Selecione um aluno e defina o título.");
      return;
    }

    if (!instrutorId) {
      alert("Erro: ID do instrutor não encontrado. Faça login novamente.");
      return;
    }

    try {
      const dadosEnvio = {
        aluno_id: selectedAluno,
        instrutor_id: instrutorId,
        titulo: tituloTreino,
        itens: [] 
      };

      await api.post('/treino', dadosEnvio);

      alert("Treino vinculado com sucesso!");
      setTituloTreino('');
      setSelectedAluno('');
    } catch (error) {
      console.error("Erro ao salvar:", error.response?.data);
      alert("Erro ao salvar: " + (error.response?.data?.message || "Verifique o console"));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-12 font-sans antialiased">
      <div className="max-w-5xl mx-auto">
        
        {/* Container com efeito de transição controlado pelo estado de carregamento */}
        <div className={`transition-all duration-300 ease-in-out ${
          contentReady ? 'opacity-100 transform-none' : 'opacity-0 scale-[0.99]'
        }`}>
          
          <header className="mb-8">
            <Link 
              to="/home" 
              className="text-red-600 hover:text-red-500 text-xs font-bold uppercase tracking-wider transition-colors block mb-2"
            >
              ← Voltar ao Dashboard
            </Link>
            <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase text-zinc-100">
              GERENCIAMENTO DE <span className="text-red-600">TREINOS</span>
            </h1>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Seção de modelos de treino pré-definidos */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-6 rounded-2xl shadow-xl">
              <h2 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-5 border-b border-zinc-800 pb-3">
                Modelos Pré-definidos
              </h2>
              <div className="space-y-2.5">
                {treinosPreFeitos.map((m) => (
                  <button 
                    key={m.id} 
                    type="button"
                    onClick={() => setTituloTreino(m.titulo)} 
                    className="w-full bg-zinc-950/40 border border-zinc-800 text-zinc-300 p-3.5 rounded-xl text-left text-sm hover:border-red-600/50 hover:bg-zinc-900/80 transition-all duration-200 font-medium flex items-center gap-3 group active:scale-[0.99]"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform">💪</span>
                    <span className="group-hover:text-white transition-colors">{m.titulo}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Formulário de vinculação de treino ao aluno */}
            <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 p-6 rounded-2xl shadow-xl">
              <h2 className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-5 border-b border-zinc-800 pb-3">
                Vincular a um Aluno
              </h2>
              
              <form onSubmit={handleVincularTreino} className="space-y-5">
                <div>
                  <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                    Selecionar Aluno
                  </label>
                  <select 
                    className="w-full bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl text-sm text-zinc-300 focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition-all cursor-pointer"
                    value={selectedAluno} 
                    onChange={(e) => setSelectedAluno(e.target.value)} 
                    required
                  >
                    <option value="">-- Escolha o aluno --</option>
                    {alunos.map((a) => (
                      <option key={a.id || a._id} value={a.id || a._id} className="bg-zinc-950 text-white">
                        {a.nome} {a.email ? `(${a.email})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                    Título da Ficha
                  </label>
                  <input 
                    type="text" 
                    placeholder="Digite ou selecione um modelo ao lado" 
                    className="w-full bg-zinc-950 border border-zinc-800 p-3.5 rounded-xl text-sm text-white focus:border-red-600 focus:ring-1 focus:ring-red-600 focus:outline-none transition-all placeholder:text-zinc-700" 
                    value={tituloTreino} 
                    onChange={(e) => setTituloTreino(e.target.value)} 
                    required 
                  />
                </div>

                {/* Controle de ativação imediata da ficha */}
                <div className="flex items-center gap-3 pt-1">
                  <input 
                    type="checkbox" 
                    id="statusAtivo"
                    checked={statusAtivo}
                    onChange={(e) => setStatusAtivo(e.target.checked)}
                    className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-red-600 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-red-600"
                  />
                  <label htmlFor="statusAtivo" className="text-zinc-500 text-xs select-none cursor-pointer hover:text-zinc-400 transition-colors">
                    Definir treino como Ativo imediatamente
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black uppercase text-xs tracking-widest transition-all duration-200 active:scale-[0.98] mt-2 shadow-lg shadow-red-600/10"
                >
                  Salvar Vínculo no Banco
                </button>
              </form>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Treinos;