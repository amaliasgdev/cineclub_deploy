const router = require('express').Router();
const publicacionModel = require('../../models/publicacion.model');


router.get('/', async (req, res) => {
    try {
        const [result] = await publicacionModel.getAll(req.body);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

router.get('/order', async (req, res) => {
    // /api/publicaciones/dates?page=1
    // req.query.page    
    try {
        const [result] = await publicacionModel.getAllPaginated(10, req.query.page);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

router.get('/rating/:publicacionId', async (req, res) => {
    try {
        const [result] = await publicacionModel.getRating(req.params.publicacionId);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

/* router.get('/dates', async (req, res) => {
    try {
        const [result] = await publicacionModel.getDateOrder(req.body);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});
 */
router.get('/:publicacionId', async (req, res) => {
    try {
        const [result] = await publicacionModel.getIdPelicula(req.params.publicacionId);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});


router.post('/', async (req, res) => {
    try {
        const [result] = await publicacionModel.create(req.body);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

router.delete('/:publicacionId', async (req, res) => {
    try {
        const [result] = await publicacionModel.deleteById(req.params.publicacionId);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

router.get('/search/:title', async (req, res) => {
    try {
        const [result] = await publicacionModel.getByTitle(req.params.title);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

module.exports = router;