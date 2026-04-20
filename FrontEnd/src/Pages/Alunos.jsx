import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Alunos() {
  // Estado para simular uma lista de alunos (depois virá de um banco de dados)
  const [busca, setBusca] = useState('');

  const alunosData = [
    { id: 1, nome: 'João Pedro', plano: 'Musculação', status: 'Ativo', vencimento: '15/05' },
    { id: 2, nome: 'Maria Silva', plano: 'Crossfit', status: 'Inativo', vencimento: '10/04' },
    { id: 3, nome: 'Carlos Andrade', plano: 'Natação', status: 'Ativo', vencimento: '22/05' },
    { id: 4, nome: 'Ana Souza', plano: 'Musculação', status: 'Atrasado', vencimento: '02/05' },
  ];

  // Filtra a lista conforme o que você digita na busca
  const alunosFiltrados = alunosData.filter(aluno => 
    aluno.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 md:p-10">
      
      {/* Header com Navegação e Ação */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 border-b border-zinc-800 pb-8">
        <div>
          <Link to="/home" className="text-red-600 hover:text-red-500 text-xs font-bold uppercase tracking-widest mb-2 block transition-colors">
            ← Dashboard
          </Link>
          <h1 className="text-4xl font-black italic tracking-tighter">
            ALUNOS<span className="text-zinc-600 ml-2 text-xl font-normal not-italic">/ Gestão</span>
          </h1>
        </div>
        
        <button className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all transform active:scale-95 shadow-lg shadow-red-600/20">
          + Cadastrar Novo
        </button>
      </header>

      {/* Barra de Ferramentas: Busca e Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input 
            type="text" 
            placeholder="Buscar aluno pelo nome..."
            className="w-full bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600 transition-all pl-12"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">🔍</span>
        </div>
        
        <select className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl outline-none focus:ring-2 focus:ring-red-600 appearance-none cursor-pointer pr-10">
          <option>Todos os Planos</option>
          <option>Musculação</option>
          <option>Crossfit</option>
          <option>Natação</option>
        </select>
      </div>

      {/* Tabela de Alunos */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-zinc-800/50 text-zinc-400 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="p-5">Nome do Aluno</th>
                <th className="p-5">Plano Atual</th>
                <th className="p-5">Próximo Venc.</th>
                <th className="p-5">Status</th>
                <th className="p-5 text-right">Ações</th>
              </tr>
            </thead>
                        <tbody className="divide-y divide-zinc-800">
                          {alunosFiltrados.length > 0 ? (
                            alunosFiltrados.map((aluno) => (
                              <tr key={aluno.id} className="hover:bg-zinc-800/30 transition-colors group">
                                <td className="p-5 font-semibold text-zinc-200">{aluno.nome}</td>
                                <td className="p-5 text-zinc-400">{aluno.plano}</td>
                                <td className="p-5 text-zinc-400">{aluno.vencimento}</td>
                                <td className="p-5">
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      aluno.status === 'Ativo'
                                        ? 'bg-emerald-500/15 text-emerald-300'
                                        : aluno.status === 'Atrasado'
                                        ? 'bg-amber-500/15 text-amber-300'
                                        : 'bg-zinc-700 text-zinc-400'
                                    }`}
                                  >
                                    {aluno.status}
                                  </span>
                                </td>
                                <td className="p-5 text-right">
                                  <button className="text-red-500 hover:text-red-400 font-semibold transition-colors">
                                    Ver
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="p-8 text-center text-zinc-500">
                                Nenhum aluno encontrado.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            }
            
            export default Alunos;