import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './cadastro.css'; 

// Importando o serviço das suas amigas
// ATENÇÃO: Ajuste o caminho '../Service' se seus arquivos estiverem em pastas diferentes
import { registerUser } from './Service/userService.js'; 

function Cadastro() {
    const navigate = useNavigate();

    // Estados para pegar os dados do formulário
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const handleCadastro = async (event) => {
        event.preventDefault();
        setErro('');

        // 1. Validação básica de senha no Frontend
        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem!");
            return;
        }

        setCarregando(true);

        // 2. Chama a função do backend das suas amigas
        const resultado = await registerUser(nome, email, senha);

        setCarregando(false);

        // 3. Verifica o retorno do userService.js
        // O código delas retorna uma STRING se der erro, ou um OBJETO (User) se der certo.
        if (typeof resultado === 'string') {
            // Deu erro (ex: "Email já existe", "Senha fraca")
            setErro(resultado);
        } else {
            // Deu certo (retornou o objeto newUser)
            alert(`Bem-vindo(a), ${resultado.name}!`);
            navigate('/interesses'); // Ou '/catalogo'
        }
    };

    return (
        <section className='cadastro-container'>

            <div className="cadastro-header">
                <span className="header-login-text">Já possui uma conta?</span>
                <Link to="/" className="header-login-button">Entrar</Link>
            </div>

            <img
                src='quadrada.png'
                alt="Cut! Logo"
                className="cadastro-logo"
                style={{ height: '130px' }}
            />
            <h2>Cadastro</h2>

            <form className='cadastro-form' onSubmit={handleCadastro}>
                <div className='campo-nome'>
                    <label htmlFor="nome">Nome Completo</label>
                    <input
                        type="text"
                        id="nome"
                        placeholder="Insira seu nome completo"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                    />
                </div>

                <div className='campo-email'>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id='email'
                        placeholder='Insira seu e-mail'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className='campo-senha'>
                    <label htmlFor="password">Crie uma senha</label>
                    <input
                        type="password"
                        id='password'
                        placeholder='Crie sua senha'
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                    />
                </div>

                <div className='campo-confirmarSenha'>
                    <label htmlFor="password-confirm">Confirme sua senha</label>
                    <input
                        type="password"
                        id='password-confirm'
                        placeholder='Confirme sua senha'
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        required
                    />
                </div>

                {/* Exibe mensagem de erro se houver */}
                {erro && <p style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>{erro}</p>}

                <input
                    className='cadastro-button'
                    type="submit"
                    value={carregando ? "Carregando..." : "Cadastrar"}
                    disabled={carregando}
                />
            </form>
        </section>
    );
}

export default Cadastro;