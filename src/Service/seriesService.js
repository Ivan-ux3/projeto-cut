import * as fire from '../DataBase/database.js';
import Series from '../Model/series.js';
import { getVideoById } from './videoService.js';

async function getAllSeries() {
    try{
        const data = await fire.getDocs(fire.collection(fire.db, "series"));

        const series = [];
        if (data && data.docs && data.docs.length > 0){
            data.forEach(async (element) => {
                const id = element.id;
                element = element.data();
                
                const video = await getVideoById(element.id_video.id);
                
                const s = new Series(id, video.id_video, video.title, video.description, video.date, video.duration, video.classification, video.genre, video.link);
                
                series.push(s);
            });
            
            return series;
        }
        else
            return null;

    }catch(error){
        console.log("Erro ao buscar séries -", error);
    }
}

async function getSeriesById(id) {
    try{
        let data = await fire.getDoc(fire.doc(fire.db, "series", id));

        if (data.exists()){
            const id = data.id;
            data = data.data();

            const video = await getVideoById(data.id_video.id);
            const series = new Series(id, video.id_video, video.title, video.description, video.date, video.duration, video.classification, video.genre, video.link);
            
            return series;
        }
        else
            return null;

    }catch(error){
        console.log("Erro ao buscar série pelo id ", id, " -", error);
    }
}

export { getAllSeries, getSeriesById };