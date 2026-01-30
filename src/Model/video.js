// Classe para video
class Video {

    // Método construtor de video
    constructor(id_video, title, description, date, duration, classification, genre, link) {
        this.id_video = id_video;
        this.title = title;
        this.description = description;
        this.date = date;
        this.duration = duration;
        this.classification = classification;
        this.genre = genre;
        this.link = link;
    }

}

export default Video;
