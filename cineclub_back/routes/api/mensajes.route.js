const router = require('express').Router();
const mensajeModel = require('../../models/mensaje.model');
const { checkToken } = require('../../helpers/middlewares');



router.get('/recibidos', checkToken, async (req, res) => {
    try {
        const [result] = await mensajeModel.getByDestinatarioId(req.user.id);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});



router.get('/emitidos', checkToken, async (req, res) => {
    try {
        const [result] = await mensajeModel.getByEmisorId(req.user.id);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

router.post('/create', async (req, res) => {
    try {
        const [result] = await mensajeModel.create(req.body);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

router.delete('/:mensajeId', async (req, res) => {
    try {
        const [result] = await mensajeModel.deleteById(req.params.mensajeId);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

module.exports = router;