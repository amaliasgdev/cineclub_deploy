const jwt = require('jsonwebtoken');

const getAll = () => {
    return db.query('SELECT * FROM usuarios');
}

const create = ({ email, username, password, imagen }) => {
    return db.query('INSERT INTO usuarios (email, username, password, imagen) VALUES (?,?,?,?);',
        [email, username, password, imagen]);
}

const getByEmail = (pEmail) => {
    return db.query('SELECT * FROM usuarios WHERE email=?;',
        [pEmail]);
}

const getById = (pUsuarioId) => {
    return db.query('SELECT * FROM usuarios WHERE id=?;',
        [pUsuarioId]);
}

const updateById = (userId, { username, email, password }) => {
    return db.query('UPDATE usuarios SET username=?, email=?, password=? WHERE id=?;',
        [username, email, password, userId]);
}

const updateImagenById = (userId, { imagen }) => {
    return db.query('UPDATE usuarios SET imagen=? WHERE id=?;',
        [imagen, userId]);
}

const updateRolById = (userId, { rol }) => {
    return db.query('UPDATE usuarios SET rol=? WHERE id=?;',
        [rol, userId]);
}

//desde la ruta router.get('/username') usamos este metodo y devolvemos el nombre del username
const getUserByToken = (pToken) => {
    return jwt.decode(pToken);
}

const deleteById = (userId) => {
    return db.query('DELETE FROM usuarios WHERE id=?;',
        [userId]);
}

module.exports = {
    getAll,
    create,
    getByEmail,
    getById,
    updateById,
    updateImagenById,
    updateRolById,
    getUserByToken,
    deleteById
}