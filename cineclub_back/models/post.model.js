const getAll = () => {
    return db.query('SELECT * FROM posts');
}

const getByPubId = (publicacionId) => {
    return db.query("SELECT t.*, u.* FROM posts AS t JOIN usuarios AS u ON t.usuario_id=u.id WHERE publicacion_id=?;",
        [publicacionId]);
}

const getById = (postId) => {
    return db.query("SELECT * FROM posts WHERE id=?;",
        [postId]);
}

const getByUserId = (usuarioId) => {
    return db.query("SELECT t.*, p.pelicula_id FROM posts AS t JOIN publicaciones AS p ON t.publicacion_id=p.idPublicacion WHERE usuario_id=?;",
        [usuarioId]);
}

const create = ({ publicacionId, usuarioId, titulo, texto, rating }) => {
    return db.query('INSERT INTO posts (publicacion_id, usuario_id, titulo, texto, rating) VALUES (?,?,?,?,?);',
        [publicacionId, usuarioId, titulo, texto, rating]);
}

const updateById = (postId, { titulo, texto }) => {
    return db.query('UPDATE posts SET titulo=?, texto=? WHERE id=?;',
        [titulo, texto, postId]);
}

const deleteById = (postId) => {
    return db.query('DELETE FROM posts WHERE id=?;',
        [postId]);
}


module.exports = {
    getAll,
    getById,
    create,
    getByPubId,
    getByUserId,
    deleteById,
    updateById
}