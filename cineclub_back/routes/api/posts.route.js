const router = require('express').Router();
const { checkToken } = require('../../helpers/middlewares');
const postModel = require('../../models/post.model');

router.get('/', async (req, res) => {
    try {
        const [result] = await postModel.getAll(req.body);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

router.get('/:publicacionId', async (req, res) => {
    try {
        const [result] = await postModel.getByPubId(req.params.publicacionId);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

router.get('/id/:postId', async (req, res) => {
    try {
        const [result] = await postModel.getById(req.params.postId);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

router.get('/byuser/:userId', async (req, res) => {
    try {
        const [result] = await postModel.getByUserId(req.params.userId);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});


router.post('/create', checkToken, async (req, res) => {
    console.log('id', req.user.id)
    console.log('body', req.body)
    req.body.usuarioId = req.user.id;
    try {
        const [result] = await postModel.create(req.body);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

router.put('/:postId', async (req, res) => {
    try {
        const [result] = await postModel.updateById(req.params.postId, req.body);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

router.delete('/:postId', async (req, res) => {
    try {
        const [result] = await postModel.deleteById(req.params.postId);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});




module.exports = router;