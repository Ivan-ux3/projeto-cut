import * as fire from '../DataBase/database.js';
import User from "../Model/user.js";

async function registerUser(name, email, password){
    try{
        const userCredential = await fire.createUserWithEmailAndPassword(fire.getAuth(), email, password);
        const user = userCredential.user;
        const id = user.uid;

        const newUser = new User(id, name, email, user.metadata.creationTime, "", "", []);

        await fire.setDoc(fire.doc(fire.db, "users", id), {
            name: newUser.name,
            email: newUser.email,
            biography: newUser.biography,
            picture_link: newUser.picture_link,
            preferred_genres: newUser.preferred_genres
        });

        return newUser;

    }catch(error){
        let msg = '';

        switch (error.code) {
            case 'auth/invalid-email':
                msg = "Formato de e-mail inválido";
            break;

            case 'auth/weak-password':
                msg = "Senha fraca, é necessário ter no mínimo 6 caracteres";
            break;

            default:
                msg = "Erro ao cadastrar usuário - " + error.message;
                break;
        }

        return msg;
    }
}

async function loginUser(email, password) {
    try{
        const userCredential = await fire.signInWithEmailAndPassword(fire.getAuth(), email, password);
        const user = userCredential.user;
        const id = user.uid;

        let user_db = await fire.getDoc(fire.doc(fire.db, "users", id));

        if (user_db.exists()) {
            user_db = user_db.data();
            const newUser = new User(id, user_db.name, email, user.metadata.creationTime, user_db.biography, user_db.picture_link, user_db.preferred_genres);

            return newUser;
        }
        else {
            return user;
        }

    }catch(error){
        let msg = '';
        
        switch (error.code) {
            case 'auth/invalid-credential':
                msg = "E-mail ou senha incorretos";
            break;

            case 'auth/invalid-email':
                msg = "Formato de e-mail inválido";
            break;

            default:
                msg = "Erro ao realizar login - " + error.message;
                break;
        }

        return msg;
    }
}

async function logout() {
    try{
        fire.signOut(fire.getAuth());
        console.log("Usuário deslogado com sucesso");
        return true;
    }catch(error){
        console.log("Erro ao fazer logout - ", error);
        throw error;
    }
    
}

async function addGenre(id_user, genres) {
    try{
        genres = genres.map(genre => genre.toString().toLowerCase());

        const user = fire.doc(fire.db, "users", id_user);
        const updateData = { preferred_genres: genres };

        await fire.updateDoc(user, updateData);
    }catch(error){
        console.log("Erro ao atualizar gêneros preferidos do usuário -", error);
        throw error;
    }
}

async function getAllUsers() {
    try {
        const data = await fire.getDocs(fire.collection(fire.db, "users"));
        const users = [];

        if (data && data.docs && data.docs.length > 0) {
            data.forEach(doc => {
                const id = doc.id;
                const u = doc.data();

                users.push({
                    id: id,
                    name: u.name,
                    email: u.email,
                    biography: u.biography,
                    picture_link: u.picture_link
                });
            });

            return users;
        } else {
            return null;
        }

    } catch (error) {
        console.log("Erro ao buscar todos os usuários -", error);
    }
}

async function getUserById(id) {
    try {
        let docSnap = await fire.getDoc(fire.doc(fire.db, "users", id));

        if (docSnap.exists()) {
            const data = docSnap.data();

            return {
                id: id,
                name: data.name,
                email: data.email,
                biography: data.biography,
                picture_link: data.picture_link
            };
        } else {
            return null;
        }

    } catch (error) {
        console.log("Erro ao buscar usuário pelo id ", id, " -", error);
    }
}

export { registerUser, loginUser, logout, addGenre, getAllUsers, getUserById };