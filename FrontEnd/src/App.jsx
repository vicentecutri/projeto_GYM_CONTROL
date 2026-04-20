import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login'; 
import Home from './Pages/Home';
import Alunos from './Pages/Alunos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        
        {/* Rotas temporárias para evitar tela branca */}
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/produtos" element={<div className="bg-zinc-950 min-h-screen text-white p-10 text-2xl">Página Produtos</div>} />
        <Route path="/treinos" element={<div className="bg-zinc-950 min-h-screen text-white p-10 text-2xl">Página Treinos</div>} />
      </Routes>
    </Router>
  );
}

export default App;