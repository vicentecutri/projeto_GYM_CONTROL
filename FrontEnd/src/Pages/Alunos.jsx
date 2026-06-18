import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../Services/api'; 

function Alunos() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false); 
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null); 
  const [dadosFinanceiros, setDadosFinanceiros] = useState(null); 
  
  // Controla a aparição confortável do conteúdo na tela
  const [contentReady, setContentReady] = useState(false);

  // Estado para controlar qual opção está ativa dentro do painel do aluno
  const [opcaoAtiva, setOpcaoAtiva] = useState('consultar_matricula'); 

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [planoSelecionado, setPlanoSelecionado] = useState('');

  const getDetalhesPlano = (input) => {
    if (!input) return { nome: "Nenhum", valor: 0.00 };
    const val = String(input).trim().toLowerCase();

    if (val === '1' || val === 'plano mensal' || val === 'mensal' || val.includes('mensal')) {
      return { nome: "Plano Mensal", valor: 100.00 };
    }
    
    if (val === '2' || val === 'plano trimestral' || val === 'trimestral' || val.includes('trimestral')) {
      return { nome: "Plano Trimestral", valor: 300.00 };
    }
    
    if (val === '3' || val === 'plano anual' || val === 'anual' || val.includes('anual')) {
      return { nome: "Plano Anual", valor: 1000.00 };
    }

    if (val === 'nenhum' || val === 'inexistente' || val === 'null' || val === 'undefined') {
      return { nome: "Nenhum", valor: 0.00 };
    }
    
    return { nome: "Plano Mensal", valor: 100.00 };
  };

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
      } finally {
        // Ativa o conteúdo suavemente na tela, independente de ter vindo com dados ou erro
        if (isMounted) setContentReady(true);
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
      
      if (!token) {
        alert("Erro ao cadastrar: Você não está autenticado. Por favor, faça login novamente.");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      await api.post('/users', 
        { 
          nome, 
          email, 
          senha: senha, 
          senha_hash: senha,
          role: 'aluno',  
          tipo: 'aluno'   
        },
        { headers }
      );

      alert("Aluno criado com sucesso! Agora, selecione-o na lista abaixo para vincular um plano.");
      setNome('');
      setEmail('');
      setSenha('');
      setIsModalOpen(false);
      buscarAlunos();
    } catch (error) {
      console.error("Erro no fluxo de cadastro:", error);
      
      const mensagemServidor = error.response?.data?.mensagem 
        || error.response?.data?.error 
        || error.response?.data?.message 
        || error.message;

      alert("Erro ao cadastrar: " + mensagemServidor);
    }
  };

  const removerAluno = async (id) => {
    const confirmar = window.confirm("Atenção! Deseja realmente remover este aluno? Esta ação apagará o cadastro no banco de dados e ele perderá o acesso ao sistema.");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Você não está autenticado. Faça o login novamente.");
        return;
      }

      await api.delete(`/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Aluno removido com sucesso!");
      buscarAlunos(); 
    } catch (error) {
      console.error("Erro ao remover aluno:", error);
      const mensagemErro = error.response?.data?.mensagem || error.response?.data?.error || "Erro interno ao tentar excluir.";
      alert("Erro ao remover aluno: " + mensagemErro);
    }
  };

  const abrirDetalhesAluno = async (aluno) => {
    setAlunoSelecionado(aluno);
    setIsDetalhesOpen(true);
    setOpcaoAtiva('consultar_matricula'); 
    setDadosFinanceiros(null); 
    
    try {
      const token = localStorage.getItem('token');
      const alunoId = aluno.id || aluno._id;

      const response = await api.get(`/matricula/status/${alunoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDadosFinanceiros(response.data);

      const status = response.data?.status_matricula?.toLowerCase() || response.data?.status?.toLowerCase();
      if (status === 'inexistente' || !status) {
        setOpcaoAtiva('matricular');
      }
    } catch (error) {
      console.error("Erro ao buscar dados financeiros reais:", error);
      if (error.response?.data) {
        setDadosFinanceiros(error.response.data);
      }
      setOpcaoAtiva('matricular');
    }
  };

  const handleMatricular = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const alunoId = alunoSelecionado.id || alunoSelecionado._id; 
      
      let planoId = 1;
      if (planoSelecionado === "Plano Trimestral") planoId = 2;
      if (planoSelecionado === "Plano Anual") planoId = 3;

      await api.post('/matricula', {
        aluno_id: alunoId,
        plano_id: planoId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Aluno matriculado com sucesso!");
      setPlanoSelecionado('');
      abrirDetalhesAluno(alunoSelecionado); 
    } catch (error) {
      alert("Erro ao matricular: " + (error.response?.data?.error || "O aluno já possui uma matrícula ativa"));
    }
  };

  const obterEstiloStatus = (status) => {
    if (!status) return 'bg-zinc-800 text-zinc-500 border-zinc-700';
    
    switch (status.toLowerCase()) {
      case 'ativa':
      case 'ativo':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'pendente':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'expirada':
      case 'cancelada':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'inexistente':
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  };

  const renderizarTipoMatricula = () => {
    if (!dadosFinanceiros) return 'Buscando...';

    const status = dadosFinanceiros.status_matricula?.toLowerCase() || dadosFinanceiros.status?.toLowerCase();
    if (status === 'inexistente') {
      return 'Nenhum';
    }

    const planoId = 
      dadosFinanceiros.plano_id || 
      dadosFinanceiros.plano?.id || 
      dadosFinanceiros.matricula?.plano_id ||
      dadosFinanceiros.planoId;

    if (planoId && String(planoId) !== 'undefined' && String(planoId) !== 'null') {
      const p = getDetalhesPlano(planoId);
      if (p.nome !== "Nenhum") return p.nome;
    }

    const escopoPlano = dadosFinanceiros.plano || dadosFinanceiros.matricula?.plano;
    if (typeof escopoPlano === 'string' && escopoPlano.trim() !== '') {
      const p = getDetalhesPlano(escopoPlano);
      if (p.nome !== "Nenhum") return p.nome;
    }
    if (escopoPlano?.nome) {
      const p = getDetalhesPlano(escopoPlano.nome);
      if (p.nome !== "Nenhum") return p.nome;
    }

    const dataInicio = dadosFinanceiros.data_inicio || dadosFinanceiros.matricula?.data_inicio;
    const dataFim = dadosFinanceiros.data_fim || dadosFinanceiros.matricula?.data_fim;

    if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      
      if (!isNaN(inicio.getTime()) && !isNaN(fim.getTime())) {
        const diffTempo = Math.abs(fim - inicio);
        const diffDias = Math.ceil(diffTempo / (1000 * 60 * 60 * 24));

        if (diffDias >= 80 && diffDias <= 100) return 'Plano Trimestral';
        if (diffDias >= 350 && diffDias <= 375) return 'Plano Anual';
        if (diffDias >= 25 && diffDias <= 33) return 'Plano Mensal';

        const diferencaMeses = (fim.getFullYear() - inicio.getFullYear()) * 12 + (fim.getMonth() - inicio.getMonth());
        if (diferencaMeses === 3) return 'Plano Trimestral';
        if (diferencaMeses === 12) return 'Plano Anual';
        if (diferencaMeses === 1) return 'Plano Mensal';
      }
    }

    if (dadosFinanceiros.data_fim || dadosFinanceiros.matricula?.data_fim) {
      return 'Plano Mensal'; 
    }

    return 'Nenhum'; 
  };

  return (
    /* O container de fundo nunca se move nem pisca */
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      
      {/* Todo o miolo do painel de alunos surge de forma fluida e confortável */}
      <div className={`transition-all duration-300 ease-in-out ${
        contentReady ? 'opacity-100 transform-none' : 'opacity-0 scale-[0.99]'
      }`}>
        
        <header className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
          <div>
            <Link to="/home" className="text-red-600 hover:text-red-500 text-xs font-bold uppercase mb-2 block transition-colors">
              ← Dashboard
            </Link>
            <h1 className="text-4xl font-black italic tracking-tighter">ALUNOS</h1>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-95"
          >
            + Cadastrar Novo
          </button>
        </header>

        {/* LISTA DE ALUNOS */}
        <div className="grid gap-4">
          {alunos.length > 0 ? (
            alunos.map((aluno) => (
              <div
                key={aluno.id || aluno._id}
                className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl p-4 flex justify-between items-center hover:border-red-600/60 hover:bg-zinc-900 transition duration-200 cursor-pointer shadow-md"
                onClick={() => abrirDetalhesAluno(aluno)}
              >
                <div>
                  <p className="font-semibold text-zinc-200">{aluno.nome}</p>
                  <p className="text-zinc-500 text-sm">{aluno.email}</p>
                </div>
                <button
                  className="text-zinc-600 hover:text-red-500 font-bold p-2 transition-colors active:scale-90 text-sm"
                  onClick={(e) => {
                    e.stopPropagation(); 
                    removerAluno(aluno.id || aluno._id); 
                  }}
                >
                  ✕
                </button>
              </div>
            ))
          ) : (
            <p className="text-zinc-500 text-center py-12 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/10">
              Nenhum aluno cadastrado no sistema.
            </p>
          )}
        </div>

      </div>

      {/* MODAL DE CADASTRO (Animação suave de fade no background) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity duration-200 animate-fadeIn">
          <div className="w-full max-w-lg rounded-3xl bg-zinc-950 border border-zinc-800 p-8 shadow-2xl animate-scaleIn">
            <h2 className="text-2xl font-bold mb-6 tracking-tight">Cadastrar Novo Aluno</h2>
            <form onSubmit={cadastrarAluno} className="space-y-4">
              <input
                type="text"
                placeholder="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-sm placeholder:text-zinc-600"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-sm placeholder:text-zinc-600"
              />
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all text-sm placeholder:text-zinc-600"
              />
              <div className="flex gap-4 pt-2">
                <button type="submit" className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-red-600/10 active:scale-[0.98]">
                  Cadastrar
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold py-3 rounded-xl transition active:scale-[0.98]">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PRINCIPAL DO ALUNO (DETALHES) */}
      {isDetalhesOpen && alunoSelecionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 transition-opacity duration-200 animate-fadeIn">
          <div className="w-full max-w-xl rounded-3xl bg-zinc-950 border border-zinc-800 p-8 shadow-2xl animate-scaleIn">
            
            {/* Cabeçalho */}
            <div className="flex items-center justify-between mb-6 border-b border-zinc-800 pb-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
                  {dadosFinanceiros?.aluno_nome || alunoSelecionado.nome}
                </h2>
                <p className="text-sm text-zinc-500 mt-0.5">{alunoSelecionado.email}</p>
              </div>
              <button 
                type="button" 
                onClick={() => { setIsDetalhesOpen(false); setAlunoSelecionado(null); }} 
                className="text-zinc-400 hover:text-white bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Fechar
              </button>
            </div>

            {/* Menu de Opções (Abas) */}
            <div className="flex gap-2 mb-6 bg-zinc-900 p-1 rounded-xl border border-zinc-800/60">
              <button
                onClick={() => setOpcaoAtiva('matricular')}
                className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all ${opcaoAtiva === 'matricular' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
              >
                Matricular Aluno
              </button>
              <button
                onClick={() => setOpcaoAtiva('consultar_matricula')}
                className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all ${opcaoAtiva === 'consultar_matricula' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
              >
                Consultar Matrícula
              </button>
              <button
                onClick={() => setOpcaoAtiva('consultar_pagamento')}
                className={`flex-1 text-xs font-bold py-2.5 rounded-lg transition-all ${opcaoAtiva === 'consultar_pagamento' ? 'bg-red-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'}`}
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
                    <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 block mb-2">Selecione o Plano de Treino</label>
                    <select 
                      value={planoSelecionado}
                      onChange={(e) => setPlanoSelecionado(e.target.value)}
                      required
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-red-600 text-sm cursor-pointer"
                    >
                      <option value="">-- Escolha um Plano --</option>
                      <option value="Plano Mensal">Plano Mensal - R$ 100,00</option>
                      <option value="Plano Trimestral">Plano Trimestral - R$ 300,00</option>
                      <option value="Plano Anual">Plano Anual - R$ 1000,00</option>
                    </select>
                  </div>
                  <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-xl transition uppercase tracking-widest text-xs shadow-lg shadow-emerald-600/10 active:scale-[0.99] mt-2">
                    Confirmar Nova Matrícula
                  </button>
                </form>
              )}

              {/* Conteúdo: Consultar Matrícula */}
              {opcaoAtiva === 'consultar_matricula' && (
                <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start border-b border-zinc-800/80 pb-3">
                    <div>
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Status da Matrícula</p>
                      <span className={`inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black uppercase border tracking-widest ${obterEstiloStatus(dadosFinanceiros?.status_matricula || (dadosFinanceiros?.data_fim ? 'ativa' : 'inexistente'))}`}>
                        {dadosFinanceiros?.status_matricula || (dadosFinanceiros?.data_fim ? 'ATIVA' : 'INEXISTENTE')}
                      </span>
                    </div>
                  </div>

                  <div className="border-b border-zinc-800/80 pb-3">
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Tipo de matrícula</p>
                    <p className="text-zinc-200 font-bold text-sm mt-1 uppercase tracking-wide">
                      {renderizarTipoMatricula()}
                    </p>
                  </div>

                  {(dadosFinanceiros?.data_inicio || dadosFinanceiros?.matricula?.data_inicio) && (
                    <div className="grid grid-cols-2 gap-4 text-sm pt-1">
                      <div>
                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Data de Início</p>
                        <p className="text-zinc-300 font-semibold mt-1">
                          {new Date(dadosFinanceiros.data_inicio || dadosFinanceiros.matricula.data_inicio).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Data de Término</p>
                        <p className="text-zinc-300 font-semibold mt-1">
                          {new Date(dadosFinanceiros.data_fim || dadosFinanceiros.matricula.data_fim).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  )}

                  {dadosFinanceiros?.message && !dadosFinanceiros?.data_fim && !dadosFinanceiros?.matricula?.data_fim && (
                    <p className="text-zinc-500 text-xs italic bg-zinc-950/50 p-3 rounded-xl border border-zinc-800 text-center">
                      {dadosFinanceiros.message}
                    </p>
                  )}
                </div>
              )}

              {/* Conteúdo: Consultar Pagamento */}
              {opcaoAtiva === 'consultar_pagamento' && (
                <div className="bg-zinc-900/60 border border-zinc-800 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-800/80 pb-3">
                    <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold">Resumo Financeiro</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Plano Atual</p>
                      <p className="text-zinc-200 font-bold text-sm mt-1">
                        {renderizarTipoMatricula()}
                      </p>
                    </div>
                    <div>
                      <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Valor do Plano</p>
                      <p className="text-emerald-400 font-black text-sm mt-1">
                        {(() => {
                          const nomePlanoAtivo = renderizarTipoMatricula();
                          const detalhes = getDetalhesPlano(nomePlanoAtivo);
                          return detalhes.valor > 0 
                            ? `R$ ${detalhes.valor.toFixed(2).replace('.', ',')}` 
                            : "R$ 0,00";
                        })()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-zinc-950/50 p-3.5 rounded-xl border border-zinc-800 mt-2">
                    <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Próxima Renovação</p>
                    <p className="text-zinc-200 font-bold text-sm mt-1">
                      {(() => {
                        const dataFinal = dadosFinanceiros?.data_fim || dadosFinanceiros?.matricula?.data_fim;
                        return dataFinal 
                          ? new Date(dataFinal).toLocaleDateString('pt-BR', { 
                              day: '2-digit', 
                              month: 'long', 
                              year: 'numeric' 
                            }) 
                          : "Data não definida";
                      })()}
                    </p>
                  </div>

                  {!(dadosFinanceiros?.data_fim || dadosFinanceiros?.matricula?.data_fim) && (
                    <p className="text-red-400/80 text-[10px] font-bold uppercase tracking-wider text-center pt-2">
                      Matrícula inativa. Nenhuma renovação programada.
                    </p>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Alunos;