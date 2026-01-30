import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './style-inicio.css';

// Importando o serviço das suas amigas
import { loginUser } from './Service/userService.js';

function Inicio() {
  const navigate = useNavigate();

  // Estados do formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setErro('');
    setCarregando(true);

    // 1. Chama a função de login do backend das suas amigas
    const resultado = await loginUser(email, senha);
    
    setCarregando(false);

    // 2. Verifica o retorno
    // O userService.js retorna uma STRING se der erro.
    if (typeof resultado === 'string') {
        setErro(resultado);
    } else {
        // Se retornou um objeto, é o usuário logado com sucesso
        // Podemos salvar no localStorage se quiser manter logado, ou só navegar
        console.log("Usuário logado:", resultado);
        navigate('/catalogo'); 
    }
  };

  return (
    <>
      {/* SEÇÃO 1: TELA DE LOGIN */}
      <div className="login-container">
        <div className="login-box">
          <img 
            src='quadrada.png' 
            alt="Cut! Logo" 
            className="login-logo"
            style={{ height: '130px'}} 
          />
          
          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              placeholder="email@exemplo.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="senha">Senha</label>
            <input 
              type="password" 
              id="senha" 
              placeholder="********" 
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            
            {erro && <p style={{color: '#ff4444', marginTop: '10px'}}>{erro}</p>}

            <button type="submit" className="login-button" disabled={carregando}>
              {carregando ? "Entrando..." : "Entrar"}
            </button>
          </form>

          <p className="login-link">
            Não tem uma conta? 
            <Link to="/cadastro">Cadastre-se</Link>
          </p>
        </div>
      </div>

      {/* SEÇÃO 2: CONTEÚDO EXTRA (Feed) - O resto do arquivo continua igual... */}
      <div className="extra-content">
        <div className="feature-banner">
          <img src="pipoca.png" alt="Ícone de Pipoca" className="popcorn-icon" />
          <div className="feature-banner-text">
            <h3>Seus filmes favoritos estão aqui</h3>
            <p>Seus melhores amigos também!</p>
          </div>
        </div>
        
        {/* ... Restante do código do Feed que já estava funcionando ... */}
        {/* Apenas para economizar espaço na resposta, mantenha o restante do seu código aqui */}
        <div className="cta-section">
            <h2>Assista filmes e saiba o que seus amigos estão achando!</h2>
            <button type="button" className="start-button" onClick={() => navigate('/cadastro')}>
                Começar
            </button>
        </div>
      </div>
    </>
  );
}

export default Inicio;