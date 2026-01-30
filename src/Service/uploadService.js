import { storage } from '../DataBase/database.js';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadImage(file) {
    if (!file) return null;

    try {
        const fileName = `posts/${Date.now()}_${file.name}`;
        
        const storageRef = ref(storage, fileName);

        const snapshot = await uploadBytes(storageRef, file);

        const downloadURL = await getDownloadURL(snapshot.ref);
        
        return downloadURL;

    } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        throw error;
    }
}