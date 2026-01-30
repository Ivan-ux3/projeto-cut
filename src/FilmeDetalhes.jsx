import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './style-detalhes.css';
import { getFilmById } from './Service/filmService.js';

// --- COMPONENTES DE ÍCONES SVG ---
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{color:'#ccc'}}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="#FFD700" stroke="#FFD700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="#E1007A" stroke="none">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

// --- COMPONENTE PRINCIPAL ---
function FilmeDetalhes() {
  const { id } = useParams(); // Pega o ID da URL
  const navigate = useNavigate(); // Para navegar para o Player
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca os dados do filme ao carregar a página
  useEffect(() => {
    const fetchMovie = async () => {
        try {
            const data = await getFilmById(id);
            setMovie(data);
        } catch (error) {
            console.error("Erro ao carregar detalhes do filme:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchMovie();
    window.scrollTo(0, 0); // Rola para o topo
  }, [id]);

  // Exibe telas de carregamento ou erro enquanto busca
  if (loading) return <div className="loading-screen">Carregando...</div>;
  if (!movie) return <div className="error-screen">Filme não encontrado.</div>;

  // --- FUNÇÕES AUXILIARES DE FORMATAÇÃO ---
  
  // Extrai apenas o ano de qualquer formato de data (ex: "20/07/2023" -> "2023")
  const getYear = (dateString) => {
      if (!dateString) return "";
      const match = dateString.match(/\d{4}/);
      return match ? match[0] : dateString;
  };
  
  // Formata a lista de gêneros para string separada por vírgula
  const formatGenre = (genre) => {
      if (Array.isArray(genre)) return genre.join(', ');
      return genre;
  };

  // Lógica da Imagem de Fundo:
  // Se existir 'scene' no banco, usa ela. Se não, usa o 'link' (poster).
  const bgImage = movie.scene || movie.link; 
  // Flag para saber se estamos usando o poster como fundo (para aplicar blur no CSS se necessário)
  const isPosterAsBg = !movie.scene; 

  return (
    <div className="details-page">
      {/* HEADER DE NAVEGAÇÃO */}
      <header className="header-detalhes">
        <Link to="/catalogo">
             <img src='/horizontal.png' alt="CUT!" className="logo-img" />
        </Link>
        <div className="search-wrapper">
          <input type="text" placeholder="Pesquisar" />
          <div className="icon-right"><SearchIcon /></div>
        </div>
      </header>

      {/* ÁREA DE FUNDO (BACKDROP) */}
      <div className="backdrop-container">
        <div className="backdrop-gradient"></div>
        <img 
            src={bgImage} 
            alt="Background Scene" 
            className={`backdrop-img ${isPosterAsBg ? 'poster-mode' : 'scene-mode'}`} 
        />
      </div>

      {/* CONTEÚDO DA PÁGINA */}
      <div className="content-container">
        <div className="content-grid">
          
          {/* COLUNA ESQUERDA: PÔSTER E PLAY */}
          <div className="poster-col">
            <div className="poster-wrapper">
                <img 
                    src={movie.link} 
                    alt={`Poster de ${movie.title}`} 
                    className="main-poster" 
                />
                
                {/* Botão que leva para o Player */}
                <button 
                    className="play-button"
                    onClick={() => navigate(`/player/${id}`)}
                    aria-label="Assistir Filme"
                >
                    <PlayIcon />
                </button>
            </div>
          </div>

          {/* COLUNA DIREITA: INFORMAÇÕES DO FILME */}
          <div className="info-col">
            <h1 className="movie-hero-title">
                {movie.title ? movie.title.toUpperCase() : "TÍTULO INDISPONÍVEL"} 
                <span className="movie-year"> ({getYear(movie.date)})</span>
            </h1>

            {/* Metadados: Duração • Gênero */}
            <div className="meta-row">
                {movie.duration && <span className="meta-tag">{movie.duration}</span>}
                {movie.duration && movie.genre && <span className="meta-separator">•</span>}
                {movie.genre && <span className="meta-tag">{formatGenre(movie.genre)}</span>}
            </div>
            
            {/* Sinopse */}
            <div className="synopsis-area">
              <h3 className="label-synopsis">SINOPSE</h3>
              <p className="text-synopsis">
                {movie.description || "Descrição não disponível para este título."}
              </p>
            </div>

            {/* Classificação e Nota */}
            <div className="bottom-stats">
                {/* Badge de Idade */}
                <div className={`age-badge age-${movie.classification}`}>
                    {movie.classification || "L"}
                </div>
                
                {/* Nota IMDb */}
                <div className="rating-container">
                    <span className="label-imdb">Avaliação IMDb</span>
                    <div className="stars-row">
                        <div className="star-box"><StarIcon /></div>
                        {/* Valor vindo do banco de dados */}
                        <span className="rating-number">{movie.score || "N/A"}</span>
                    </div>
                </div>
            </div>
            
            {/* Diretor (Opcional) */}
            {movie.director && (
                <div style={{marginTop: '30px', color: '#ccc', fontSize: '0.9rem'}}>
                    <strong>Direção:</strong> {movie.director}
                </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default FilmeDetalhes;