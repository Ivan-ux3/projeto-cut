import * as fire from '../../back/DataBase/database.js';
import Episode from '../../back/Model/episode.js';

async function getAllEpisodesBySerieId(id_series) {
    try{
        const seriesDoc = await fire.doc(fire.db, "series", id_series);
        const qry = fire.query(fire.collection(fire.db, "episodes"), fire.where("id_series", "==", seriesDoc));
        const data = await fire.getDocs(qry);

        const episodes = [];

        if (data && data.docs && data.docs.length > 0){
            data.forEach(async (element) => {
                const id = element.id;
                element = element.data();

                const episode = new Episode(id, id_series, element.episode, element.season, element.next_ep, element.prev_ep, element.link);
                episodes.push(episode);
            });

            return episodes;
        }
        else
            return null;

    }catch(error){
        console.log("Erro ao buscar os episódios da série de id ", id_series, " -", error);
    }
}

export { getAllEpisodesBySerieId };