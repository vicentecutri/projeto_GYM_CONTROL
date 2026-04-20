import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../Services/api'; 

function Alunos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alunos, setAlunos] = useState([]);
  
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  const buscarAlunos = async () => {
    try {
      const response = await api.get('/usuarios'); 
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao carregar alunos", error);
    }
  };

  useEffect(() => {
    const carregarAlunos = async () => {
      await buscarAlunos();
    };

    carregarAlunos();
  }, []);

  const handleCadastrar = async (e) => {
    e.preventDefault();
    try {
      await api.post('/usuarios', {
        nome: nome,
        email: email,
        senha_hash: "senha_padrao_123", 
        tipo: "aluno"
      });
      
      alert("Aluno registrado com sucesso!");
      setIsModalOpen(false); 
      setNome(''); 
      setEmail('');
      buscarAlunos(); 
    } catch (error) {
      alert("Erro ao cadastrar: " + (error.response?.data?.error || "Verifique o servidor"));
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <header className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
        <div>
          <Link to="/home" className="text-red-600 hover:text-red-500 text-xs font-bold uppercase mb-2 block transition-colors">
            ← Dashboard
          </Link>
          <h1 className="text-4xl font-black italic tracking-tighter">ALUNOS</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-red-600/20"
        >
          + Cadastrar Novo
        </button>
      </header>

      {/* Tabela de Alunos */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-zinc-800/50 text-zinc-400 text-xs font-bold uppercase">
            <tr>
              <th className="p-5">Nome</th>
              <th className="p-5">E-mail</th>
              <th className="p-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {alunos.length > 0 ? (
              alunos.map((aluno) => (
                <tr key={aluno.id} className="hover:bg-zinc-800/30 transition-colors">
                  <td className="p-5 font-semibold">{aluno.nome}</td>
                  <td className="p-5 text-zinc-400">{aluno.email}</td>
                  <td className="p-5 text-green-500 font-bold">● Ativo</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-10 text-center text-zinc-600 italic">Nenhum aluno cadastrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Cadastro */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-black italic mb-6 text-red-600 uppercase">Novo Aluno</h2>
            <form onSubmit={handleCadastrar} className="space-y-4">
              <div>
                <label className="text-zinc-500 text-xs font-bold uppercase block mb-2">Nome Completo</label>
                <input 
                  type="text" 
                  value={nome} 
                  onChange={(e) => setNome(e.target.value)} 
                  className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg outline-none text-white focus:ring-2 focus:ring-red-600" 
                  required 
                />
              </div>
              <div>
                <label className="text-zinc-500 text-xs font-bold uppercase block mb-2">E-mail</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg outline-none text-white focus:ring-2 focus:ring-red-600" 
                  required 
                />
              </div>
              <div className="flex gap-3 mt-8">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 font-bold py-3 rounded-xl transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 font-bold py-3 rounded-xl transition-colors">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Alunos;