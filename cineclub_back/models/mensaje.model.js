
const getByDestinatarioId = (destinatarioId) => {
    return db.query("SELECT m.*, u.username AS emisor FROM mensajes AS m JOIN usuarios AS u ON u.id=m.emisor_id WHERE receptor_id=?;",
        [destinatarioId]);
}

const getByEmisorId = (emisorId) => {
    return db.query("SELECT m.*, u.username AS receptor FROM mensajes AS m JOIN usuarios AS u ON u.id=m.receptor_id WHERE emisor_id=?;",
        [emisorId]);
}

const create = ({ emisorId, receptorId, titulo, mensaje }) => {
    return db.query('INSERT INTO mensajes (emisor_id, receptor_id, titulo, mensaje) VALUES (?,?,?,?);',
        [emisorId, receptorId, titulo, mensaje]);
}


const deleteById = (mensajeId) => {
    return db.query('DELETE FROM mensajes WHERE id=?;',
        [mensajeId]);
}

module.exports = {
    create,
    getByDestinatarioId,
    getByEmisorId,
    deleteById
}