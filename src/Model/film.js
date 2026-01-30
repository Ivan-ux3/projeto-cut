import Video from './video.js';

// Classe para Filme (herda as propriedades da classe Video)
class Film extends Video {
    
    // Método construtor de Filme
    constructor(id_film, id_video, title, description, date, duration, classification, genre, link, director) {
        super(id_video, title, description, date, duration, classification, genre, link); // Chama o construtor do método mãe
        this.id_film = id_film;
        this.director = director;
    }
    
}

export default Film;