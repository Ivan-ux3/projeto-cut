import React, { useState } from 'react'; // Importe useState
import { useNavigate } from 'react-router-dom';
import './style-interesses.css'; // O CSS para esta página

function Interesses() {
    const navigate = useNavigate();
    // Estado para armazenar os interesses selecionados
    const [interessesSelecionados, setInteressesSelecionados] = useState([]);

    // Lista de todos os interesses disponíveis
    const todosInteresses = [
        'Ação', 'Drama', 'Aventura', 'Faroeste', 'Comédia', 'Fantasia', 
        'Sci-Fi', 'Musical', 'Terror', 'Romance', 'Documentário', 'Animação'
    ];

    // Função para adicionar ou remover um interesse da lista de selecionados
    const toggleInteresse = (interesse) => {
        setInteressesSelecionados(prevInteresses => {
            if (prevInteresses.includes(interesse)) {
                return prevInteresses.filter(item => item !== interesse);
            } else {
                return [...prevInteresses, interesse];
            }
        });
    };

    const handleSubmitInteresses = () => {
        if (interessesSelecionados.length > 0) {
            console.log('Interesses selecionados:', interessesSelecionados);
            // Aqui enviaria os interesses para o backend ou para outra página
            // Por exemplo: navigate('/home', { state: { interesses: interessesSelecionados } });
            alert(`Interesses selecionados: ${interessesSelecionados.join(', ')}`);
            // Por agora só um alert para mostrar que funcionou.
            // adicionar a navegação para a próxima página aqui.
            navigate('/catalogo');
        } else {
            alert('Por favor, selecione pelo menos um interesse.');
        }
    };

    return (
        <section className='interesses-container'>
            {/* 1. Logo "Cut!" no topo */}
            <img 
                src='horizontal.png' 
                alt="Cut! Logo" 
                className="interesses-logo"
            />
            
            <h2>Escolha seus interesses</h2>

            <div className='interesses-grid'>
                {todosInteresses.map((interesse, index) => (
                    <button
                        key={index}
                        className={`interesse-btn ${interessesSelecionados.includes(interesse) ? 'selected' : ''}`}
                        onClick={() => toggleInteresse(interesse)}
                    >
                        {interesse}
                    </button>
                ))}
            </div>

            <button 
                className="submit-interesses-btn"
                onClick={handleSubmitInteresses}
                disabled={interessesSelecionados.length === 0} // Desabilita se nada for selecionado
            >
                Continuar
            </button>
        </section>
    );
}

export default Interesses;