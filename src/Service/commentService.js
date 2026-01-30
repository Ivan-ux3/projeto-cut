import * as fire from '../DataBase/database.js';

async function addComment(id_user, id_video, text, rating = 0, picture_link) {
    try {
        const userRef = fire.doc(fire.db, "users", id_user);
        const videoRef = fire.doc(fire.db, "films", id_video); 

        const data = {
            id_user: userRef,
            id_video: videoRef,
            text: text,
            rating: rating, 
            created_at: new Date(),
            picture_link: picture_link || null, // Garantindo que salva o link do Storage
            likes: []
        };

        const newDoc = await fire.addDoc(fire.collection(fire.db, "comments"), data);
        return newDoc.id;

    } catch (error) {
        console.log("Erro ao criar comentário -", error);
    }
}

async function deleteComment(id_comment) {
    try {
        await fire.deleteDoc(fire.doc(fire.db, "comments", id_comment));
        return true;
    } catch (error) {
        console.error("Erro ao deletar comentário:", error);
        return false;
    }
}

async function getCommentsByVideoId(id_video) {
    try {
        const videoRef = fire.doc(fire.db, "films", id_video);
        const qry = fire.query(
            fire.collection(fire.db, "comments"),
            fire.where("id_video", "==", videoRef)
        );

        const snap = await fire.getDocs(qry);
        const comments = [];

        snap.forEach(doc => {
            const data = doc.data();
            comments.push({
                id: doc.id,
                id_user: data.id_user.id,
                id_video: id_video,
                text: data.text,
                rating: data.rating || 0,
                created_at: data.created_at,
                picture_link: data.picture_link || null,
                likes: data.likes || []
            });
        });
        return comments;
    } catch (error) {
        console.log("Erro ao buscar comentários do vídeo -", error);
    }
}

async function getFeedComments(followingIds) {
    try {
        let feed = [];
        for (const id of followingIds) {
            const userRef = fire.doc(fire.db, "users", id);
            const qry = fire.query(
                fire.collection(fire.db, "comments"),
                fire.where("id_user", "==", userRef)
            );
            const snap = await fire.getDocs(qry);
            snap.forEach(doc => {
                const data = doc.data();
                let videoId = null;
                if (data.id_video) {
                    videoId = data.id_video.id ? data.id_video.id : data.id_video;
                }
                feed.push({
                    id: doc.id,
                    id_user: id,
                    id_video: videoId, 
                    text: data.text,
                    rating: data.rating || 0, 
                    created_at: data.created_at, 
                    picture_link: data.picture_link || null,
                    likes: data.likes || []
                });
            });
        }
        feed.sort((a, b) => {
            const dateA = a.created_at?.toDate ? a.created_at.toDate() : new Date(a.created_at);
            const dateB = b.created_at?.toDate ? b.created_at.toDate() : new Date(b.created_at);
            return dateB - dateA;
        });
        return feed;
    } catch (error) {
        console.log("Erro ao buscar feed de comentários -", error);
        return [];
    }
}

async function likeComment(id_comment, id_user) {
    try {
        const ref = fire.doc(fire.db, "comments", id_comment);
        const docSnap = await fire.getDoc(ref);
        if (docSnap.exists()) {
            const likes = docSnap.data().likes || [];
            if (likes.includes(id_user)) {
                await fire.updateDoc(ref, { likes: fire.arrayRemove(id_user) });
            } else {
                await fire.updateDoc(ref, { likes: fire.arrayUnion(id_user) });
            }
        }
        return true;
    } catch (error) {
        console.log("Erro ao dar like no comentário -", error);
    }
}

async function getAllFeedComments() {
    try {
        const qry = fire.query(
            fire.collection(fire.db, "comments"),
            fire.orderBy("created_at", "desc")
        );

        const snap = await fire.getDocs(qry);
        const feed = [];

        snap.forEach(doc => {
            const data = doc.data();
            let videoId = null;
            
            if (data.id_video) {
                videoId = data.id_video.id ? data.id_video.id : data.id_video;
            }
            
            let userId = null;
            if (data.id_user) {
                userId = data.id_user.id ? data.id_user.id : data.id_user;
            }

            feed.push({
                id: doc.id,
                id_user: userId,
                id_video: videoId, 
                text: data.text,
                rating: data.rating || 0, 
                created_at: data.created_at, 
                picture_link: data.picture_link || null,
                likes: data.likes || []
            });
        });

        return feed;
    } catch (error) {
        console.log("Erro ao buscar Feed Global -", error);
        return [];
    }
}

export { addComment, deleteComment, getCommentsByVideoId, getFeedComments, likeComment, getAllFeedComments };