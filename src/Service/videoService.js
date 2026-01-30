import * as fire from '../DataBase/database.js';
import Video from '../Model/video.js';

async function getAllVideos() {
    try {
        const data = await fire.getDocs(fire.collection(fire.db, "videos"));
        const videos = [];
        if (data && data.docs && data.docs.length > 0) {
            data.forEach(element => {
                const id = element.id;
                const elData = element.data();
                const video = new Video(id, elData.title, elData.description, elData.date, elData.duration, elData.classification, elData.genre, elData.link);
                
                // ADIÇÃO: Pega a scene e o score
                video.scene = elData.scene || ""; 
                video.score = elData.score || "N/A"; // Se não tiver nota, fica N/A
                
                videos.push(video);
            });
            return videos;
        } else return null;
    } catch (error) {
        console.log("Erro ao buscar vídeos -", error);
    }
}

async function getVideoById(id) {
    try {
        let data = await fire.getDoc(fire.doc(fire.db, "videos", id));
        if (data.exists()) {
            const idDoc = data.id;
            const elData = data.data();
            const video = new Video(idDoc, elData.title, elData.description, elData.date, elData.duration, elData.classification, elData.genre, elData.link);
            
            // ADIÇÃO: Pega a scene e o score
            video.scene = elData.scene || "";
            video.score = elData.score || "N/A";
            
            return video;
        } else return null;
    } catch (error) {
        console.log("Erro ao buscar vídeo de id ", id, " -", error);
    }
}

// Funções auxiliares que você já tinha (mantidas para não quebrar)
async function getVideosByTitle(title) {
    try{
        const videos = await fire.getDocs(fire.collection(fire.db, "videos"));
        const result = [];
        if (videos && videos.docs && videos.docs.length > 0) {
            videos.forEach(element => {
                const id = element.id;
                const elData = element.data();
                if (elData.title && elData.title.toString().toLowerCase().includes(title.toString().toLowerCase())) {
                    const video = new Video(id, elData.title, elData.description, elData.date, elData.duration, elData.classification, elData.genre, elData.link);
                    video.scene = elData.scene || "";
                    video.score = elData.score || "N/A";
                    result.push(video)
                }
            });
            return result;
        } else return null;
    }catch(error){ console.log("Erro ao buscar vídeos pelo nome ", title, " -", error); return null; }
}

async function getVideosByGenre(genre) {
    try{
        const qry = await fire.query(fire.collection(fire.db, "videos"), fire.where("genre", "array-contains", genre));
        const data = await fire.getDocs(qry);
        const videos = []
        if (data && data.docs && data.docs.length > 0){
            data.forEach(element => {
                const id = element.id;
                const elData = element.data();
                const video = new Video(id, elData.title, elData.description, elData.date, elData.duration, elData.classification, elData.genre, elData.link);
                video.scene = elData.scene || "";
                video.score = elData.score || "N/A";
                videos.push(video);
            });
            return videos;
        } else return null;
    }catch(error){ console.log("Erro ao buscar vídeos pelo gênero -", error); }
}

export { getAllVideos, getVideoById, getVideosByTitle, getVideosByGenre };