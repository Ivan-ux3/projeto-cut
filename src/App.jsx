import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Importe seus componentes
import Inicio from './Inicio';
import Cadastro from './Cadastro';
import Catalogo from './Catalogo';
import FilmeDetalhes from './FilmeDetalhes'; 
import Interesses from './Interesses';
import Player from './Player';
import Feed from './Feed';
import Perfil from './Perfil';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota inicial (Login) */}
        <Route path="/" element={<Inicio />} />
        
        {/* Cadastro e Onboarding */}
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/interesses" element={<Interesses />} />
        
        {/* Áreas Principais */}
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/feed" element={<Feed />} />
        
        {/* Telas de Conteúdo */}
        <Route path="/filme/:id" element={<FilmeDetalhes />} />
        <Route path="/player/:id" element={<Player />} />
        
        {/* Rota de Perfil 
            :id? significa que o parâmetro é opcional.
            Se acessar /perfil -> mostra o usuário logado (modo edição)
            Se acessar /perfil/123 -> mostra o usuário 123 (modo visitante)
        */}
        <Route path="/perfil/:id?" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;