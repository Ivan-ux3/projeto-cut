class User {

    // Método construtor de user
    constructor(id_user, name, email, entry_date, biography, picture_link, preferred_genres) {
        this.id_user = id_user;
        this.name = name;
        this.email = email;
        this.entry_date = entry_date;
        this.biography = biography;
        this.picture_link = picture_link;
        this.preferred_genres = preferred_genres;
    }
}

export default User;