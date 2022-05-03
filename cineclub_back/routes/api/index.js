const router = require('express').Router();
const { checkToken } = require('../../helpers/middlewares');

router.use('/usuarios', require('./usuarios.route'));
router.use('/publicaciones', require('./publicaciones.route'));
router.use('/posts', require('./posts.route'));
router.use('/mensajes', checkToken, require('./mensajes.route'));

module.exports = router;