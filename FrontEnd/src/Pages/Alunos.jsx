import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../Services/api'; 

function Alunos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false); 
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null); 
  const [dadosFinanceiros, setDadosFinanceiros] = useState(null); 
  
  // Estado para controlar qual opção está ativa dentro do painel do aluno
  const [opcaoAtiva, setOpcaoAtiva] = useState('consultar_matricula'); 

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  // Estados para o formulário de Nova Matrícula
  const [planoSelecionado, setPlanoSelecionado] = useState('');

  const buscarAlunos = async () => {
    try {
      const response = await api.get('/users'); 
      setAlunos(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Erro ao carregar alunos do backend:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const response = await api.get('/users');
        if (isMounted) setAlunos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erro ao carregar alunos do backend:", error);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  const cadastrarAluno = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      // 1. Cria o usuário no backend
      const responseUsuario = await api.post('/users', 
        { nome, email, senha_hash: senha },
        { headers }
      );

      const alunoId = responseUsuario.data?.id || responseUsuario.data?.usuario?.id || responseUsuario.data?.aluno?.id;

      if (alunoId) {
        // 2. Cria a matrícula automaticamente vinculando o plano inicial
        const PLANO_PADRAO_ID = 1; 

        await api.post('/matricula', 
          { 
            aluno_id: alunoId, 
            plano_id: PLANO_PADRAO_ID 
          },
          { headers }
        );
      }

      alert("Aluno registrado e matrícula vinculada automaticamente com sucesso!");
      setNome('');
      setEmail('');
      setSenha('');
      setIsModalOpen(false);
      buscarAlunos();
    } catch (error) {
      console.error("Erro no fluxo de cadastro/matrícula:", error);
      alert("Erro ao cadastrar: " + (error.response?.data?.mensagem || error.response?.data?.error || "Token ausente ou inválido"));
    }
  };

  const abrirDetalhesAluno = async (aluno) => {
    setAlunoSelecionado(aluno);
    setIsDetalhesOpen(true);
    setOpcaoAtiva('consultar_matricula'); 
    setDadosFinanceiros(null); 
    
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/matricula`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Salva o retorno bruto vindo do banco de dados
      setDadosFinanceiros(response.data);
    } catch (error) {
      console.error("Erro ao buscar dados financeiros reais:", error);
    }
  };

  const handleMatricular = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      let planoId = 1;
      if (planoSelecionado === "Plano Trimestral") planoId = 2;
      if (planoSelecionado === "Plano Anual") planoId = 3;

      await api.post('/matricula', {
        aluno_id: alunoSelecionado.id,
        plano_id: planoId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Aluno matriculado com sucesso!");
      abrirDetalhesAluno(alunoSelecionado); 
    } catch (error) {
      alert("Erro ao matricular: " + (error.response?.data?.error || "O aluno já possui uma matrícula ativa"));
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

      {/* MODAL DE CADASTRO */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-8">
            <h2 className="text-2xl font-bold mb-6">Cadastrar Novo Aluno</h2>
            <form onSubmit={cadastrarAluno} className="space-y-4">
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-600"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-600"
              />
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-red-600"
              />
              <div className="flex gap-4">
                <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition">
                  Cadastrar
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-2 rounded-lg transition">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PRINCIPAL DO ALUNO */}
      {isDetalhesOpen && alunoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-xl rounded-3xl bg-zinc-950 border border-zinc-800 p-8 shadow-2xl">
            
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">{alunoSelecionado.nome}</h2>
                <p className="text-sm text-zinc-400">{alunoSelecionado.email}</p>
              </div>
              <button 
                type="button" 
                onClick={() => { setIsDetalhesOpen(false); setAlunoSelecionado(null); }} 
                className="text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-xl text-xs font-semibold"
              >
                Fechar
              </button>
            </div>

            {/* Menu de Opções (Abas) */}
            <div className="flex gap-2 mb-6 bg-zinc-900 p-1 rounded-xl border border-zinc-800">
              <button
                onClick={() => setOpcaoAtiva('matricular')}
                className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all ${opcaoAtiva === 'matricular' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                Matricular Aluno
              </button>
              <button
                onClick={() => setOpcaoAtiva('consultar_matricula')}
                className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all ${opcaoAtiva === 'consultar_matricula' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                Consultar Matrícula
              </button>
              <button
                onClick={() => setOpcaoAtiva('consultar_pagamento')}
                className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all ${opcaoAtiva === 'consultar_pagamento' ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}
              >
                Consultar Pagamento
              </button>
            </div>

            {/* Conteúdo Dinâmico */}
            <div className="space-y-4 min-h-[180px]">
              
              {/* Conteúdo: Matricular Aluno */}
              {opcaoAtiva === 'matricular' && (
                <form onSubmit={handleMatricular} className="space-y-4">
                  <div>
                    <label className="text-sm text-zinc-400 block mb-2">Selecione o Plano de Treino</label>
                    <select 
                      value={planoSelecionado}
                      onChange={(e) => setPlanoSelecionado(e.target.value)}
                      required
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-600"
                    >
                      <option value="">-- Escolha um Plano --</option>
                      <option value="Plano Mensal">Plano Mensal - R$ 100,00</option>
                      <option value="Plano Trimestral">Plano Trimestral - R$ 300,00</option>
                      <option value="Plano Anual">Plano Anual - R$ 1000,00</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition">
                    Confirmar Nova Matrícula
                  </button>
                </form>
              )}

              {/* CORRIGIDO: Puxa o ID real da matricula_id vindo das tabelas do banco */}
              {opcaoAtiva === 'consultar_matricula' && (
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                  <div>
                    <p className="text-zinc-400 text-xs">ID da Matrícula no Banco</p>
                    <p className="text-white font-mono text-sm font-semibold mt-1 break-all">
                      {dadosFinanceiros?.matricula_id || dadosFinanceiros?.id || 'Nenhum registro encontrado'}
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-xs">Status da Conta</p>
                    {/* Como sua tabela não possui string de status fixa, inferimos se está ativa se houver id de matrícula no banco */}
                    <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${(dadosFinanceiros?.matricula_id || dadosFinanceiros?.id) ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                      {(dadosFinanceiros?.matricula_id || dadosFinanceiros?.id) ? 'ATIVA' : 'INATIVA / PENDENTE'}
                    </span>
                  </div>
                </div>
              )}

              {/* CORRIGIDO: Mapeia estritamente as colunas valor_pago, metodo_pagamento e data_pagamento */}
              {opcaoAtiva === 'consultar_pagamento' && (
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-3">
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <div>
                      <p className="text-zinc-400 text-xs">Valor Recebido</p>
                      <p className="text-white font-bold mt-0.5">
                        {dadosFinanceiros?.valor_pago 
                          ? `R$ ${Number(dadosFinanceiros.valor_pago).toFixed(2)}` 
                          : 'R$ 0,00'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-zinc-400 text-xs">Forma Utilizada</p>
                      <p className="text-white font-semibold uppercase mt-0.5">
                        {dadosFinanceiros?.metodo_pagamento || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-zinc-400 text-xs">Data da Transação</p>
                    <p className="text-white text-sm font-semibold mt-0.5">
                      {dadosFinanceiros?.data_pagamento 
                        ? new Date(dadosFinanceiros.data_pagamento).toLocaleDateString('pt-BR') 
                        : '--/--/----'}
                    </p>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* LISTA DE ALUNOS */}
      <div className="grid gap-4">
        {alunos.length > 0 ? (
          alunos.map((aluno) => (
            <div
              key={aluno.id || aluno._id}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex justify-between items-center hover:border-red-600 transition cursor-pointer"
              onClick={() => abrirDetalhesAluno(aluno)}
            >
              <div>
                <p className="font-semibold">{aluno.nome}</p>
                <p className="text-zinc-400 text-sm">{aluno.email}</p>
              </div>
              <button
                className="text-red-600 hover:text-red-500 font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <p className="text-zinc-400 text-center py-8">Nenhum aluno cadastrado</p>
        )}
      </div>
    </div>
  );
}

export default Alunos;