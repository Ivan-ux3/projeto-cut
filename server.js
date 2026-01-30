import express from 'express';
import cors from 'cors';

import { getAllSeries, getSeriesById } from './Service/seriesService.js';
import { getAllEpisodesBySerieId, getEpisodeById } from './Service/episodeService.js';
import { getAllFilms, getFilmById } from './Service/filmService.js';
import { registerUser, loginUser, logout, addGenre, getAllUsers, getUserById } from './Service/userService.js';
import { getAllVideos, getVideoById, getVideosByTitle, getVideosByGenre } from "./Service/videoService.js";
import { addComment, getCommentsByVideoId, getFeedComments, likeComment } from "./Service/commentService.js";
import { followUser, unfollowUser, getFollowingList } from "./Service/followersService.js";

const server = express();
const PORT = 3000;

server.use(cors());
server.use(express.json());


// VIDEOS

server.get('/api/videos/:id', async (req, res) => {
    try{
        const video = await getVideoById(req.params.id);

        if (video)
            return res.status(200).json(video);
        else
            return res.status(404).json({ msg: "Vídeo não encontrado" });
    }catch(error){
        return res.status(500).json({ msg: "Erro ao buscar vídeo" });
    }
});

server.get('/api/videos', async (req, res) => {
    const genre = req.query.genre;
    const title = req.query.title;

    let videos;

    try{
        if (genre)
            videos = await getVideosByGenre(genre);
        else if (title)
            videos = await getVideosByTitle(title);
        else
            videos = await getAllVideos();

        return res.status(200).json(videos);
    }catch(error){
        return res.status(500).json({ msg: "Erro ao buscar vídeos" });
    }
});

// FILMES

server.get('/api/films', async (req, res) => {
    try{
        const films = await getAllFilms();
        return res.status(200).json(films);
    }catch(error){
        return res.status(500).json({ msg: "Erro ao buscar filmes" });
    }
});

server.get('/api/films/:id', async (req, res) => {
    try{
        const film = await getFilmById(req.params.id);

        if (film)
            return res.status(200).json(film);
        else
            return res.status(404).json({ msg: "Filme não encontrado" })
    }catch(error){
        return res.status(500).json({ msg: "Erro ao buscar filme" });
    }
});

// SERIES

server.get('/api/series', async (req, res) => {
    try{
        const series = await getAllSeries();
        return res.status(200).json(series);
    }catch(error){
        return res.status(500).json({ msg: "Erro ao buscar séries" });
    }
});

server.get('/api/series/:id', async (req, res) => {
    try{
        const serie = await getSeriesById(req.params.id);
        
        if (serie)
            return res.status(200).json(serie);
        else
            return res.status(404).json({ msg: "Série não encontrada" });
    }catch(error){
        return res.status(500).json({ msg: "Erro ao buscar série" });
    }
});

// EPISODES

server.get('/api/series/:id_serie/episodes', async (req, res) => {
    try{
        const episodes = await getAllEpisodesBySerieId(req.params.id_serie);

        if (episodes)
            return res.status(200).json(episodes);
        else
            return res.status(404).json({ msg: "Episódios não encontrados" });
    }catch(error){
        return res.status(500).json({ msg: "Erro ao buscar episódios" });
    }
});

server.get('/api/episodes/:id', async (req, res) => {
    try{
        const episode = await getEpisodeById(req.params.id);

        if (episode)
            return res.status(200).json(episode);
        else
            return res.status(404).json({ msg: "Episódio não encontrado" });
    }catch(error){
        return res.status(500).json({ msg: "Erro ao buscar episódio" });
    }
} );

// USERS

server.get('/api/users', async (req, res) => {
    try{
        const users = await getAllUsers();
        return res.status(200).json(users);
    }catch(error){
        return res.status(500).json({ msg: "Erro ao buscar usuários" });
    }
});

server.get('/api/users/:id', async (req, res) => {
    try{
        const user = await getUserById(req.params.id);

        if (user)
            return res.status(200).json(user);
        else
            return res.status(404).json({ msg: "Usuário não encontrado" });
    }catch(error){
        return res.status(500).json({ msg: "Erro ao buscar usuário" });
    }
});

server.post('/api/users/register', async (req, res) => {
    const { name, email, password } = req.body;

    try{
        const result = await registerUser(name, email, password);

        if (typeof result === 'string')
            return res.status(400).json({ success: false, msg: result });
        else
            return res.status(201).json({ success: true, user: result });
    }catch(error){
        return res.status(500).json({ msg: "Erro ao cadastrar usuário" });
    }
});

server.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    
    try{
        const result = await loginUser(email, password);

        if (typeof result === 'string')
            return res.status(401).json({ success: false, msg: result });
        else
            return res.status(200).json({ success: true, user: result });
    }catch(error){
        return res.status(500).json({ msg: "Erro ao realizar o login" });
    }
});

server.post('/api/users/logout', async (req, res) => {
    await logout();
    return res.status(200).json({ msg: "Usuário deslogado com sucesso" });
});

server.post('/api/users/addGenre', async (req, res) => {
    const { id_user, genres } = req.body;

    if (!Array.isArray(genres)) 
        return res.status(400).json({ msg: "Dados inválidos" });
    
    try{
        await addGenre(id_user, genres);
        return res.status(200).json({ msg: "Gêneros preferidos atualizados com sucesso." });
    }catch(error){
        return res.status(500).json({ msg: "Erro ao atualizar gêneros preferidos" });
    }
})

// FOLLOWERS

server.get('/api/followers/:id', async (req, res) => {
    try{
        const followers = await getFollowingList(req.params.id);

        if (followers)
            return res.status(200).json(followers);
        else
            return res.status(404).json({ msg: "Lista de usuários não encontrada" });
    }catch(error){
        return res.status(500).json({ msg: "Erro ao buscar lista de usuários que estão sendo seguidos" });
    }
});

server.post('/api/followers/follow', async (req, res) => {
    const { userId, targetId } = req.body;

    if(!userId || !targetId) 
       return  res.status(400).json({ msg: "Dados inválidos" });
    
    try{
        await followUser(userId, targetId);
        return res.status(200).json({ msg: "Usuário seguido com sucesso" });
    }catch(error){
        return res.status(500).json({ msg: "Erro ao seguir usuário" });
    }
});

server.post('/api/followers/unfollow', async (req, res) => {
    const { userId, targetId } = req.body;

    if(!userId || !targetId) 
        return res.status(400).json({ msg: "Dados inválidos" });

    try{
        await unfollowUser(userId, targetId);
        return res.status(200).json({ msg: "Usuário deixou de ser seguido com sucesso" });
    }catch(error){
        return res.status(500).json({ msg: "Erro ao deixar de seguir usuário" });
    }
});

// COMMENT

server.get('/api/comments/:id_video', async (req, res) => {
    try{
        const comments = await getCommentsByVideoId(req.params.id_video);

        if (comments)
            return res.status(200).json(comments);
        else
            return res.status(404).json({ msg: "Comentários não encontrados" });
    }catch(error){
        return res.status(500).json({ msg: "Erro ao buscar comentários" });
    }
});

server.get('/api/feed/comments/:id_user', async (req, res) => {
    const id_user = req.params.id_user;

    if (!id_user)
        return res.status(400).json({ msg: "Dados inválidos" });
    
    try{
        const followingIds = await getFollowingList(id_user);
        const feed = await getFeedComments(followingIds);

        return res.status(200).json(feed);
    }catch(error){
        return res.status(500).json({ msg: "Erro ao buscar feed de comentários" });
    }
    
});

server.post('/api/comments/add', async (req, res) => {
    const { id_user, id_video, text, picture_link } = req.body;

    if (!id_user || !id_video || !text)
        return res.status(400).json({ msg: "Dados inválidos" });

    try{
        await addComment(id_user, id_video, text, picture_link);
        return res.status(200).json({ msg: "Comentário publicado com sucesso!" });
    }catch(error){
        return res.status(500).json({ msg: "Erro ao publicar comentário" });
    }
});

server.post('/api/comments/like', async (req, res) => {
    const { id_comment, id_user } = req.body;

    if (!id_comment || !id_user)
        return res.status(400).json({ success: false, msg: "Dados inválidos" });

    try{
        await likeComment(id_comment, id_user);
        return res.status(200).json({ success: true, msg: "Comentário curtido com sucesso" });
    }catch(error){
        return res.status(500).json({ success: false, msg: "Erro ao curtir comentário" });
    }
});

server.listen(PORT, () => { console.log(`Servidor rodando na porta ${PORT}. Acesse: http://localhost:${PORT}`); });