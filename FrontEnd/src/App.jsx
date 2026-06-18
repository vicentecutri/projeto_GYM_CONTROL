import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login'; 
import Home from './Pages/Home';
import Alunos from './Pages/Alunos';
import Treinos from './pages/Treinos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        
        {/* Rotas temporárias para evitar tela branca */}
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/treinos" element={<Treinos />} />
      </Routes>
    </Router>
  );
}

export default App;