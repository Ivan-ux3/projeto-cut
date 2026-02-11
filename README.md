# CUT!

Plataforma web que integra funcionalidades de streaming de filmes e séries com elementos de rede social, permitindo que usuários interajam a partir de seus interesses cinematográficos.

O sistema possibilita visualizar conteúdos, publicar resenhas, avaliar títulos, curtir comentários e acompanhar um feed social personalizado.

Projeto desenvolvido como trabalho acadêmico em grupo e incluído no meu portfólio como aplicação full stack orientada a objetos.

---

## Visão Geral

O CUT! combina:

* Catálogo de filmes e séries
* Sistema de avaliações e comentários
* Feed social baseado em interações
* Curtidas em comentários
* Listas personalizadas
* Histórico de consumo
* Upload de imagens
* Persistência em banco NoSQL (Firebase)

A aplicação foi estruturada utilizando princípios de Programação Orientada a Objetos, separação de responsabilidades e organização em camadas (models, services, database).

---

## Arquitetura

O projeto segue uma organização modular:

* Models → Representação das entidades do domínio
* Services → Regras de negócio e comunicação com o banco
* DataBase → Configuração e integração com Firebase
* Frontend (React + Vite) → Interface do usuário
* Backend (Node.js / Express) → Servidor da aplicação

### Modelagem Orientada a Objetos

Exemplo de hierarquia:

* Video (classe base)

  * Film
  * Series
* Episode
* User

As classes Film e Series herdam propriedades de Video, aplicando conceito de herança e reutilização de código.

---

## Regras de Negócio Implementadas

* Comentários vinculados a usuários e vídeos via referência no Firebase
* Sistema de curtidas com arrayUnion e arrayRemove
* Feed ordenado por data de criação
* Avaliações opcionais associadas ao comentário
* Listas personalizadas por usuário
* Upload de imagem associado ao comentário

---

## Integração com Firebase

O projeto utiliza:

* Firestore para armazenamento de usuários, vídeos e comentários
* Referências entre documentos
* Queries com filtros (where)
* Ordenação com orderBy
* Manipulação de arrays para sistema de likes

---

## Tecnologias Utilizadas

### Frontend

* React
* Vite
* HTML5
* CSS3
* JavaScript

### Backend

* Node.js
* Express

### Banco de Dados

* Firebase Firestore

### Versionamento

* Git
* GitHub

---

## Como Executar o Projeto

Clone o repositório:

```bash
git clone https://github.com/SEU_USUARIO/cut.git
cd cut
npm install
```

Execute o frontend:

```bash
npm run dev
```

Caso o backend seja executado separadamente:

```bash
node server.js
```

---

## Estrutura do Projeto

```
CUT/
│── server.js
│── package.json
│── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── models/
│   ├── DataBase/
│── public/
│── README.md
│── .gitignore
```

---

## Autores

Projeto desenvolvido em grupo como trabalho acadêmico na disciplina de
Análise e Projeto de Software Orientado a Objetos.

Ivan Francisco Santos da Silva

Estudante de Engenharia de Software – UFMS

Licenciando em Música - FABAT

Laryssa Bernardo Aderno

Giovanna Carla Andrade da Silva

Laura Santa Cruz Rodrigues

---

## Objetivo no Portfólio

Este projeto demonstra:

* Aplicação prática de Programação Orientada a Objetos em JavaScript
* Organização em camadas
* Integração com banco NoSQL
* Implementação de regras de negócio
* Desenvolvimento full stack
* Trabalho colaborativo
* Versionamento profissional