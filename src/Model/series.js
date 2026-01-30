import Video from './video.js';

// Classe para Serie
class Series extends Video{

    // Método construtor de serie
    constructor(id_serie, id_video, title, description, date, duration, classification, genre, link) {
        super(id_video, title, description, date, duration, classification, genre, link); // Chama o construtor do método mãe
        this.id_serie = id_serie;
    }

}

export default Series;