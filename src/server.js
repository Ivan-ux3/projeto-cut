import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

import { getAllSeries, getSeriesById } from './Service/seriesService.js';
import { getAllEpisodesBySerieId } from './Service/episodeService.js';
import { getAllFilms, getFilmById } from './Service/filmService.js';
import { registerUser, loginUser, logout } from './Service/userService.js';
import { getAllVideos, getVideoById, getVideosByTitle, getVideosByGenre } from "./Service/videoService.js";

const server = express();
const PORT = 3000;

server.use(cors());
server.use(express.json());

const DIRETORIO_IMG = './uploads/';

if (!fs.existsSync(DIRETORIO_IMG)) {
    fs.mkdirSync(DIRETORIO_IMG, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, DIRETORIO_IMG); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const upload = multer({ storage: storage });

server.post('/upload-imagem', upload.single('file_input_name'), (req, res) => {
  
  if (req.file) {
    console.log('Arquivo salvo com sucesso:', req.file.path);
    const target_file = req.file.path; 

    res.send({
        message: 'Upload realizado com sucesso!',
        filePath: target_file
    });

  } else {
    res.status(400).send('Nenhum arquivo enviado.');
  }
});

// VIDEOS

server.get('/api/videos/:id', async (req, res) => {
    try{
        const video = await getVideoById(req.params.id);

        if (video)
            res.status(200).json(video);
        else
            res.status(404).json({ msg: "Vídeo não encontrado" });
    }catch(error){
        res.status(500).json({ msg: "Erro ao buscar vídeo" });
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

        res.status(200).json(videos);
    }catch(error){
        res.status(500).json({ msg: "Erro ao buscar vídeos" });
    }
});

// FILMES

server.get('/api/films', async (req, res) => {
    try{
        const films = await getAllFilms();
        res.status(200).json(films);
    }catch(error){
        res.status(500).json({ msg: "Erro ao buscar filmes" });
    }
});

server.get('/api/films/:id', async (req, res) => {
    try{
        const film = await getFilmById(req.params.id);

        if (film)
            res.status(200).json(film);
        else
            res.status(404).json({ msg: "Filme não encontrado" })
    }catch(error){
        res.status(500).json({ msg: "Erro ao buscar filme" });
    }
});

// SERIES

server.get('/api/series', async (req, res) => {
    try{
        const series = await getAllSeries();
        res.status(200).json(series);
    }catch(error){
        res.status(500).json({ msg: "Erro ao buscar séries" });
    }
});

server.get('api/series/:id', async (req, res) => {
    try{
        const serie = await getSeriesById(req.params.id);
        
        if (serie)
            res.status(200).json(serie);
        else
            res.status(404).json({ msg: "Série não encontrada" });
    }catch(error){
        res.status(500).json({ msg: "Erro ao buscar série" });
    }
});

// EPISODES

server.get('/api/episodes/:id_serie', async (req, res) => {
    try{
        const episodes = await getAllEpisodesBySerieId(req.params.id_serie);

        if (episodes)
            res.status(200).json(episodes);
        else
            res.status(404).json({ msg: "Episódios não encontrados" });
    }catch(error){
        res.status(500).json({ msg: "Erro ao buscar episódios" });
    }
});

// USERS

server.post('/api/users/register', async (req, res) => {
    const { name, email, password } = req.body;
    const result = await registerUser(name, email, password);

    if (typeof result === 'string')
        res.status(400).json({ success: false, msg: result });
    else
        res.status(201).json({ success: true, user: result });
});

server.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;
    const result = await loginUser(email, password);

    if (typeof result === 'string')
        res.status(401).json({ success: false, msg: result });
    else
        res.status(200).json({ success: true, user: result });
});

server.post('/api/users/logout', async (req, res) => {
    await logout();
    res.status(200).json({ msg: "Usuário deslogado com sucesso" });
});

server.listen(PORT, () => { console.log(`Servidor rodando na porta ${PORT}. Acesse: http://localhost:${PORT}`); });