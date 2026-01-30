import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFilmById } from './Service/filmService.js';
import './style-player.css';

function Player() {
    const { id } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                const data = await getFilmById(id);
                setMovie(data);
            } catch (error) {
                console.error("Erro ao carregar filme:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    // LÓGICA PARA ESCOLHER O ARQUIVO DE VÍDEO
    const getVideoSource = (titulo) => {
        if (!titulo) return "";
        
        const tituloNormalizado = titulo.toLowerCase();
        
        // Se o título contiver "interstellar" ou "interestelar", toca o arquivo real
        if (tituloNormalizado.includes('interstellar') || tituloNormalizado.includes('interestelar')) {
            // ATENÇÃO: Certifique-se que o arquivo Interestelar.mp4 está na pasta public/videos
            return "/videos/Interestelar.mp4"; 
        }
        
        // Para TODOS os outros filmes, toca o vídeo da Universal
        return "/videos/Universal.mp4";
    };

    if (loading) return <div className="loading-player">Carregando player...</div>;
    if (!movie) return <div className="error-player">Vídeo não encontrado.</div>;

    return (
        <div className="player-container">
            {/* Botão de Voltar */}
            <button className="back-button" onClick={() => navigate(-1)}>
                ✕ Voltar
            </button>

            <div className="video-wrapper">
                <video 
                    ref={videoRef}
                    controls 
                    autoPlay 
                    className="main-video"
                    // A 'key' força o React a recarregar o player se você trocar de filme
                    key={movie.id_film || id} 
                >
                    <source src={getVideoSource(movie.title)} type="video/mp4" />
                    Seu navegador não suporta a tag de vídeo.
                </video>
            </div>

            <div className="player-info">
                <h1>{movie.title}</h1>
                <p>
                    {getVideoSource(movie.title).includes('Interestelar') 
                        ? 'Reproduzindo Filme Completo' 
                        : 'Visualização de Exemplo (Trailer Genérico)'}
                </p>
            </div>
        </div>
    );
}

export default Player;