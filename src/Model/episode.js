// Classe para episodio
class Episode {

    // Método construtor de episodio
    constructor(id_episode, id_series, episode, season, next_ep, prev_ep, link) {
        this.id_episode = id_episode;
        this.id_series = id_series;
        this.episode = episode;
        this.season = season;
        this.next_ep = next_ep;
        this.prev_ep = prev_ep;
        this.link = link;
    }

}

export default Episode;