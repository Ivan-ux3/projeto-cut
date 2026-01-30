import * as fire from "../DataBase/database.js";

async function followUser(userId, targetId) {
    try {
        const ref = fire.doc(fire.db, "followers", userId);
        // Usa setDoc com merge para criar o documento se não existir
        await fire.setDoc(ref, { following: fire.arrayUnion(targetId) }, { merge: true });
        return true;
    } catch (error) {
        console.error("Erro ao seguir usuário:", error);
        return false;
    }
}

async function unfollowUser(userId, targetId) {
    try {
        const ref = fire.doc(fire.db, "followers", userId);
        await fire.updateDoc(ref, { following: fire.arrayRemove(targetId) });
        return true;
    } catch (error) {
        console.error("Erro ao deixar de seguir:", error);
        return false;
    }
}

async function getFollowingList(userId) {
    try {
        const ref = fire.doc(fire.db, "followers", userId);
        const snap = await fire.getDoc(ref);
        
        if (!snap.exists()) return [];
        
        const data = snap.data();
        return data.following || [];
    } catch (error) {
        console.error("Erro ao pegar lista de seguindo:", error);
        return []; // Retorna array vazio em caso de erro para não quebrar o map
    }
}

export {
    followUser,
    unfollowUser,
    getFollowingList
};