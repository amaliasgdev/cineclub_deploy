const getAll = () => {
    return db.query('SELECT * FROM publicaciones');
}

const getAllPaginated = (limit = 10, page = 1) => {
    return db.query("SELECT * FROM publicaciones ORDER BY fecha DESC LIMIT ? OFFSET ?;",
        [limit, (page - 1) * limit]);
}

const getByTitle = (titulo) => {
    console.log(titulo)
    return db.query("SELECT * FROM publicaciones WHERE LOWER(titulo) LIKE ? ORDER BY fecha DESC",
        [`%${titulo.toLowerCase()}%`]);
}

const getRating = (publicacionId) => {
    return db.query(`SELECT AVG(rating) AS rating FROM posts WHERE publicacion_id=?;`,
        [publicacionId]);
}

const getIdPelicula = (publicacionId) => {
    return db.query("SELECT pelicula_id FROM publicaciones WHERE idPublicacion=?;",
        [publicacionId]);
}

const create = ({ peliculaId, titulo }) => {
    return db.query('INSERT INTO publicaciones (pelicula_id, titulo) VALUES (?,?);',
        [peliculaId, titulo]);
}

const deleteById = (publicacionId) => {
    return db.query('DELETE FROM publicaciones WHERE idPublicacion=?;',
        [publicacionId]);
}


module.exports = {
    getAll,
    create,
    getAllPaginated,
    getByTitle,
    getRating,
    deleteById,
    getIdPelicula
}