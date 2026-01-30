import * as fire from '../DataBase/database.js';
import Film from '../Model/film.js';
import { getVideoById } from './videoService.js';

async function getAllFilms() {
    try {
        const data = await fire.getDocs(fire.collection(fire.db, "films"));

        if (data && data.docs && data.docs.length > 0) {
            const films = await Promise.all(data.docs.map(async (element) => {
                const id = element.id;
                const filmData = element.data();
                
                // Objeto padrão atualizado com score
                let video = { id_video: "erro", title: "...", description: "", date: "", duration: "", classification: "L", genre: [], link: "", scene: "", score: "N/A" };
                
                if (filmData.id_video) {
                    try {
                        const videoData = await getVideoById(filmData.id_video.id);
                        if (videoData) video = videoData;
                    } catch (err) { console.error(err); }
                }

                const film = new Film(id, video.id_video, video.title, video.description, video.date, video.duration, video.classification, video.genre, video.link, filmData.director);
                
                // ADIÇÃO: Repassa scene e score
                film.scene = video.scene;
                film.score = video.score;
                
                return film;
            }));
            return films;
        } else return [];

    } catch (error) {
        console.log("Erro ao buscar filmes -", error);
        return [];
    }
}

async function getFilmById(id) {
    try {
        const docRef = fire.doc(fire.db, "films", id);
        const docSnap = await fire.getDoc(docRef);

        if (docSnap.exists()) {
            const filmId = docSnap.id;
            const filmData = docSnap.data();

            let video = { id_video: "erro", title: "...", description: "", date: "", duration: "", classification: "L", genre: [], link: "", scene: "", score: "N/A" };

            if (filmData.id_video) {
                 const videoData = await getVideoById(filmData.id_video.id);
                 if(videoData) video = videoData;
            }

            const film = new Film(filmId, video.id_video, video.title, video.description, video.date, video.duration, video.classification, video.genre, video.link, filmData.director);
            
            // ADIÇÃO: Repassa scene e score
            film.scene = video.scene;
            film.score = video.score;
            
            return film;
        } else return null;

    } catch (error) {
        console.log("Erro ao buscar filme pelo id ", id, " -", error);
        return null;
    }
}

export { getAllFilms, getFilmById };