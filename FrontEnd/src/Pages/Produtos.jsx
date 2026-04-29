import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../Services/api'; 

function Produtos() {
  const listaProdutos = [
    { id: 1, nome: "Whey Protein", preco: 150.00 },
    { id: 2, nome: "Creatina", preco: 90.00 },
    { id: 3, nome: "Pré-Treino", preco: 120.00 },
    { id: 4, nome: "Água 500ml", preco: 3.00 },
    { id: 5, nome: "Barra de Proteína", preco: 12.00 }
  ];

  const [vendas, setVendas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados do formulário de venda
  const [produtoNome, setProdutoNome] = useState('');
  const [quantidade, setQuantidade] = useState(1);
  const [pagamento, setPagamento] = useState('Pix');

  const buscarVendas = async () => {
    try {
      const response = await api.get('/vendas'); 
      setVendas(response.data);
    } catch (error) {
      console.error("Erro ao carregar vendas", error);
    }
  };

  useEffect(() => {
    const carregarVendas = async () => {
      try {
        const response = await api.get('/vendas');
        setVendas(response.data);
      } catch (error) {
        console.error("Erro ao carregar vendas", error);
      }
    };

    carregarVendas();
  }, []);

  const handleVenda = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vendas', {
        produto: produtoNome,
        quantidade: Number(quantidade),
        forma_pagamento: pagamento,
        data: new Date()
      });
      alert("Venda registrada!");
      setIsModalOpen(false);
      setProdutoNome(''); // Limpa o campo após salvar
      buscarVendas();
    } catch (error) {
      console.error("Erro ao registrar venda", error);
      alert("Erro ao registrar venda");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <header className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
        <div>
          <Link to="/home" className="text-red-600 hover:text-red-500 text-xs font-bold uppercase mb-2 block">
            ← Dashboard
          </Link>
          <h1 className="text-4xl font-black italic tracking-tighter">PRODUTOS / VENDAS</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-bold transition-all"
        >
          + Registrar Venda
        </button>
      </header>

      {/* Tabela de Histórico de Vendas */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-zinc-800/50 text-zinc-400 text-xs font-bold uppercase">
            <tr>
              <th className="p-5">Produto</th>
              <th className="p-5">Qtd</th>
              <th className="p-5">Pagamento</th>
              <th className="p-5">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {vendas.length > 0 ? (
              vendas.map((venda) => (
                <tr key={venda.id} className="hover:bg-zinc-800/30">
                  <td className="p-5 font-semibold">{venda.produto}</td>
                  <td className="p-5">{venda.quantidade}</td>
                  <td className="p-5">{venda.forma_pagamento}</td>
                  <td className="p-5 text-green-500 font-bold">Concluída</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="p-10 text-center text-zinc-600 italic">Nenhuma venda registrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Venda */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-2xl p-8 relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>

            <h2 className="text-2xl font-black italic mb-6 text-red-600 uppercase">Nova Venda</h2>
            
            <form onSubmit={handleVenda} className="space-y-4">
              <div>
                <label className="text-zinc-500 text-xs font-bold uppercase block mb-2">Selecione o Produto</label>
                <select 
                  value={produtoNome} 
                  onChange={(e) => setProdutoNome(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-red-600"
                  required
                >
                  <option value="">Escolha um item...</option>
                  {listaProdutos.map((p) => (
                    <option key={p.id} value={p.nome}>
                      {p.nome} - R$ {p.preco.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-zinc-500 text-xs font-bold uppercase block mb-2">Quantidade</label>
                <input 
                  type="number" 
                  min="1"
                  value={quantidade}
                  className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-red-600"
                  onChange={(e) => setQuantidade(e.target.value)}
                  required 
                />
              </div>

              <div>
                <label className="text-zinc-500 text-xs font-bold uppercase block mb-2">Forma de Pagamento</label>
                <select 
                  className="w-full bg-zinc-800 border border-zinc-700 p-3 rounded-lg text-white outline-none focus:ring-2 focus:ring-red-600"
                  onChange={(e) => setPagamento(e.target.value)}
                  value={pagamento}
                >
                  <option value="Pix">Pix</option>
                  <option value="Cartão">Cartão</option>
                  <option value="Dinheiro">Dinheiro</option>
                </select>
              </div>

              <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl transition-all mt-4 shadow-lg shadow-red-600/20">
                Finalizar Venda
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Produtos;