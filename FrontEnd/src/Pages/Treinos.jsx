import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../Services/api';

function Treinos() {
  const [alunos, setAlunos] = useState([]);
  const [exercicios, setExercicios] = useState([]);
  
  const [nomeExercicio, setNomeExercicio] = useState('');
  const [grupoMuscular, setGrupoMuscular] = useState('Peito');
  const [gifUrl, setGifUrl] = useState('');

  const [alunoSelecionado, setAlunoSelecionado] = useState('');
  const [nomeTreino, setNomeTreino] = useState('');

  const carregarDadosInicial = async () => {
    try {
      // Puxa os usuários da rota /users do seu backend
      const responseAlunos = await api.get('/users');
      setAlunos(Array.isArray(responseAlunos.data) ? responseAlunos.data : []);

      // Puxa os exercícios usando a rota correta: /exercicio
      const responseExercicios = await api.get('/exercicio');
      setExercicios(Array.isArray(responseExercicios.data) ? responseExercicios.data : []);
    } catch (error) {
      console.error("Erro ao carregar dados da aba treinos", error);
    }
  };

  useEffect(() => {
    carregarDadosInicial();
  }, []);

  const handleCadastrarExercicio = async (e) => {
    e.preventDefault();
    try {
      // Post batendo na rota certa: /exercicio
      await api.post('/exercicio', {
        nome: nomeExercicio,
        grupoMuscular: grupoMuscular,
        gifUrl: gifUrl
      });
      alert("Exercício registrado com sucesso!");
      setNomeExercicio('');
      setGifUrl('');
      carregarDadosInicial();
    } catch (error) {
      console.error("Erro ao salvar exercício", error);
      alert("Erro ao salvar exercício. Verifique os parâmetros exigidos no ExercicioController.");
    }
  };

  const handleVincularTreino = async (e) => {
    e.preventDefault();
    if (!alunoSelecionado) {
      alert("Selecione um aluno primeiro!");
      return;
    }
    try {
      // Post batendo na rota certa: /treino
      await api.post('/treino', {
        usuarioId: alunoSelecionado,
        nome: nomeTreino
      });
      alert("Planilha de treino vinculada ao aluno!");
      setNomeTreino('');
      setAlunoSelecionado('');
    } catch (error) {
      console.error("Erro ao vincular treino", error);
      alert("Erro ao vincular treino. Verifique os campos da rota /treino.");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <header className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
        <div>
          <Link to="/home" className="text-red-600 hover:text-red-500 text-xs font-bold uppercase mb-2 block transition-colors">
            ← Dashboard
          </Link>
          <h1 className="text-4xl font-black italic tracking-tighter">PLANILHAS / TREINOS</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl">
          <h2 className="text-xl font-black italic mb-6 text-red-600 uppercase">+ Novo Exercício com GIF</h2>
          <form onSubmit={handleCadastrarExercicio} className="space-y-4">
            <div>
              <label className="text-zinc-500 text-xs font-bold uppercase block mb-2">Nome do Exercício</label>
              <input 
                type="text"
                value={nomeExercicio}
                onChange={(e) => setNomeExercicio(e.target.value)}
                placeholder="Ex: Supino Reto"
                className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
            <div>
              <label className="text-zinc-500 text-xs font-bold uppercase block mb-2">Grupo Muscular</label>
              <select
                value={grupoMuscular}
                onChange={(e) => setGrupoMuscular(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="Peito">Peito</option>
                <option value="Costas">Costas</option>
                <option value="Pernas">Pernas</option>
                <option value="Bíceps">Bíceps</option>
                <option value="Tríceps">Tríceps</option>
                <option value="Ombros">Ombros</option>
              </select>
            </div>
            <div>
              <label className="text-zinc-500 text-xs font-bold uppercase block mb-2">Link do GIF Demonstrativo</label>
              <input 
                type="url"
                value={gifUrl}
                onChange={(e) => setGifUrl(e.target.value)}
                placeholder="https://exemplo.com/demonstracao.gif"
                className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-600/20">
              Salvar Exercício
            </button>
          </form>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl shadow-2xl">
          <h2 className="text-xl font-black italic mb-6 text-red-600 uppercase">Vincular Planilha a Aluno</h2>
          <form onSubmit={handleVincularTreino} className="space-y-4">
            <div>
              <label className="text-zinc-500 text-xs font-bold uppercase block mb-2">Selecione o Aluno</label>
              <select
                value={alunoSelecionado}
                onChange={(e) => setAlunoSelecionado(e.target.value)}
                className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-600"
                required
              >
                <option value="">Escolha um Aluno...</option>
                {alunos.map(aluno => (
                  <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-zinc-500 text-xs font-bold uppercase block mb-2">Nome do Treino</label>
              <input 
                type="text"
                value={nomeTreino}
                onChange={(e) => setNomeTreino(e.target.value)}
                placeholder="Ex: Treino A - Hipertrofia Peito"
                className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg outline-none focus:ring-2 focus:ring-red-600"
                required
              />
            </div>
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-red-600/20">
              Vincular Treino
            </button>
          </form>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-black italic mb-6 text-zinc-400 uppercase">Exercícios Cadastrados</h2>
        {exercicios.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {exercicios.map((ex) => (
              <div key={ex.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg text-white truncate">{ex.nome}</h3>
                  <span className="text-xs font-semibold uppercase bg-red-600/10 text-red-500 px-2 py-1 rounded-md inline-block mt-1 mb-4">
                    {ex.grupoMuscular || ex.grupo_muscular}
                  </span>
                </div>
                <div className="w-full h-40 bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 flex items-center justify-center">
                  {ex.gifUrl || ex.gif_url ? (
                    <img src={ex.gifUrl || ex.gif_url} alt={ex.nome} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-zinc-600 italic">Sem GIF disponível</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-zinc-600 italic mt-4">Nenhum exercício retornado do banco.</p>
        )}
      </div>
    </div>
  );
}

export default Treinos;