import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './style-perfil.css';

// Firebase e Serviços
import { auth, db } from './DataBase/database.js';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { followUser, unfollowUser, getFollowingList } from './Service/followersService.js';

// Ícones
const CalendarIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const BackIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>;
const EditIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>;

// Componente Avatar (Reutilizável)
const AvatarProfile = ({ nome, img, tamanho = 100 }) => {
    if (img) return <img src={img} alt={nome} className="profile-avatar" style={{ width: tamanho, height: tamanho }} />;
    return (
        <div className="profile-avatar-placeholder" style={{ width: tamanho, height: tamanho, fontSize: tamanho * 0.4 }}>
            {nome ? nome.charAt(0).toUpperCase() : "U"}
        </div>
    );
};

function Perfil() {
    const { id } = useParams(); // ID do usuário que estamos visitando
    const navigate = useNavigate();

    const [perfil, setPerfil] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    // Estados de Seguidores
    const [isFollowing, setIsFollowing] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);

    // Estados de Edição
    const [isEditing, setIsEditing] = useState(false);
    const [bioText, setBioText] = useState("");

    useEffect(() => {
        const carregarPerfil = async () => {
            const currentUser = auth.currentUser;
            // Se não tiver ID na URL, assume que é o perfil do próprio usuário logado
            const targetId = id || currentUser?.uid;

            if (!targetId) {
                navigate('/');
                return;
            }

            // 1. Verificar se é o meu próprio perfil
            const souEu = currentUser && currentUser.uid === targetId;
            setIsOwnProfile(souEu);

            try {
                // 2. Buscar dados do usuário
                const userDoc = await getDoc(doc(db, "users", targetId));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setPerfil({ id: targetId, ...data });
                    setBioText(data.biography || ""); // Carrega a bio atual
                } else {
                    console.log("Usuário não encontrado");
                }

                // 3. Buscar contagem de Seguindo
                const following = await getFollowingList(targetId);
                setFollowingCount(following.length);

                // 4. Buscar contagem de Seguidores (Query no banco)
                const followersQry = query(collection(db, "followers"), where("following", "array-contains", targetId));
                const followersSnap = await getDocs(followersQry);
                setFollowersCount(followersSnap.size);

                // 5. Verificar se EU sigo esse perfil (apenas se não for eu mesmo)
                if (!souEu && currentUser) {
                    const myFollowing = await getFollowingList(currentUser.uid);
                    setIsFollowing(myFollowing.includes(targetId));
                }

            } catch (error) {
                console.error("Erro ao carregar perfil:", error);
            } finally {
                setLoading(false);
            }
        };

        carregarPerfil();
    }, [id, navigate]);

    // Ação do Botão (Seguir/Deixar de Seguir ou Editar/Salvar)
    const handleMainAction = async () => {
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        if (isOwnProfile) {
            // Lógica de Editar
            if (isEditing) {
                // Salvar alterações
                try {
                    await updateDoc(doc(db, "users", currentUser.uid), {
                        biography: bioText
                    });
                    setIsEditing(false);
                    // Atualiza o estado local
                    setPerfil(prev => ({ ...prev, biography: bioText }));
                } catch (e) {
                    alert("Erro ao salvar perfil");
                }
            } else {
                // Ativar modo edição
                setIsEditing(true);
            }
        } else {
            // Lógica de Seguir
            if (isFollowing) {
                const success = await unfollowUser(currentUser.uid, perfil.id);
                if (success) {
                    setIsFollowing(false);
                    setFollowersCount(prev => prev - 1);
                }
            } else {
                const success = await followUser(currentUser.uid, perfil.id);
                if (success) {
                    setIsFollowing(true);
                    setFollowersCount(prev => prev + 1);
                }
            }
        }
    };

    if (loading) return <div className="loading-screen">Carregando perfil...</div>;
    if (!perfil) return <div className="error-screen">Usuário não encontrado.</div>;

    // Formatação da Data de Ingresso
    const dataIngresso = perfil.entry_date
        ? new Date(perfil.entry_date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
        : "Data desconhecida";

    return (
        <div className="perfil-container">
            {/* Botão Voltar */}
            <button className="back-btn" onClick={() => navigate(-1)}>
                <BackIcon />
            </button>

            {/* BANNER (Imagem de filmes desfocada no topo) */}
            <div className="profile-banner">
                <div className="banner-overlay"></div>
                <img src="Fundo-filmes.png" alt="Banner" className="banner-img" />
            </div>

            <div className="profile-content">
                {/* CABEÇALHO DO PERFIL */}
                <div className="profile-header">
                    <AvatarProfile nome={perfil.name} img={perfil.picture_link} tamanho={120} />

                    <div className="header-info">
                        <h1 className="profile-name">{perfil.name}</h1>
                        <span className="profile-username">@{perfil.name.split(' ')[0].toLowerCase()}</span>

                        <div className="profile-stats">
                            <span><strong>{followingCount}</strong> Seguindo</span>
                            <span className="dot">•</span>
                            <span><strong>{followersCount}</strong> Seguidores</span>
                        </div>
                    </div>
                </div>

                {/* BIO */}
                <div className="profile-bio">
                    {isEditing ? (
                        <textarea
                            className="bio-input"
                            value={bioText}
                            onChange={(e) => setBioText(e.target.value)}
                            placeholder="Escreva algo sobre você..."
                            maxLength={300}
                        />
                    ) : (
                        <div className="bio-text">
                            {perfil.biography ? (
                                perfil.biography.split('\n').map((line, i) => <p key={i}>{line}</p>)
                            ) : (
                                <p style={{ color: '#aaa', fontStyle: 'italic' }}>Sem biografia.</p>
                            )}
                        </div>
                    )}

                    <div className="joined-date">
                        <CalendarIcon /> Ingressou em {dataIngresso}
                    </div>
                </div>

                {/* BOTÃO DE AÇÃO (Seguir ou Editar) */}
                <button
                    className={`action-button ${isOwnProfile ? 'btn-edit' : (isFollowing ? 'btn-unfollow' : 'btn-follow')}`}
                    onClick={handleMainAction}
                >
                    {isOwnProfile ? (
                        isEditing ? "Salvar Alterações" : <><EditIcon /> Editar Perfil</>
                    ) : (
                        isFollowing ? "Deixar de Seguir" : "Seguir"
                    )}
                </button>
            </div>
        </div>
    );
}

export default Perfil;