const router = require('express').Router();
const bcrypt = require('bcryptjs/dist/bcrypt');
const usuarioModel = require('../../models/usuario.model');
const utils = require('../../helpers/utils');
const { checkToken } = require('../../helpers/middlewares');


const path = require('path');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'public/image' });


router.get('/', async (req, res) => {
    try {
        const [result] = await usuarioModel.getAll();
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

//recuperar la info de otros usuarios
router.get('/info/:userId', checkToken, async (req, res) => {
    try {
        const [result] = await usuarioModel.getById(req.params.userId);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

router.post('/registro', upload.single('imagen'), async (req, res) => {
    //PASO 1. MODIFICAR PATH IMAGEN PARA GUARDAR EN SERVIDOR
    //Información de REQ.FILE: /*  */
    /*  fieldname: 'imagen',
     originalname: 'sillon.png',
     encoding: '7bit',
     mimetype: 'image/png',
     destination: 'public/image',
     filename: '8150fce9948c3873eca201f6968a6492',
     path: 'public\\image\\8150fce9948c3873eca201f6968a6492',
     size: 336193 */
    // Antes de guardar el producto en la base de datos, modificamos la imagen para situarla donde nos interesa 
    const extension = '.' + req.file.mimetype.split('/')[1]; //EXTENSION: .png    
    // Obtengo el nombre de la nueva imagen
    const newName = req.file.filename + extension; //NEW NAME 8150fce9948c3873eca201f6968a6492.png
    // Obtengo la ruta donde estará, adjuntándole la extensión
    const newPath = req.file.path + extension; //NEW PATH: public\image\8150fce9948c3873eca201f6968a6492.png 
    // Muevo la imagen para que resiba la extensión
    fs.renameSync(req.file.path, newPath);
    // Modifico el BODY para poder incluir el nombre de la imagen en la BD
    req.body.imagen = newName;

    //PASO 2. ENCRIPTACION DE LA PASSWORD
    //Encriptar la password con la libreria bcrypt. Configurado en helpers/utils 
    const hash = bcrypt.hashSync(req.body.password, 12);
    req.body.password = hash;
    try {
        const [result] = await usuarioModel.create(req.body);
        //console.log(result)
        res.json(result);
    } catch (error) {
        console.log(error)
        res.json(error);
    }
});

//Cambiar la imagen del usuario
router.put('/imagen/:userId', upload.single('imagen'), async (req, res) => {
    const extension = '.' + req.file.mimetype.split('/')[1];
    const newName = req.file.filename + extension;
    const newPath = req.file.path + extension;
    fs.renameSync(req.file.path, newPath);
    req.body.imagen = newName;
    try {
        const [result] = await usuarioModel.updateImagenById(req.params.userId, req.body);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

//Cambiar el rol del usuario
router.put('/rol/:userId', async (req, res) => {
    console.log(req.body)
    try {
        const [result] = await usuarioModel.updateRolById(req.params.userId, req.body);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

//PONER CHECKTOKEN
//router.put('/:userId', checkToken, async (req, res) => {
router.put('/:userId', async (req, res) => {
    //Encriptar la password con la libreria bcrypt. Configurado en helpers/utils 
    const hash = bcrypt.hashSync(req.body.password, 12);
    req.body.password = hash;
    try {
        const [result] = await usuarioModel.updateById(req.params.userId, req.body);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

//Necesarias 2 endpoints (rutas)
//ENDPOINT NUMBER 1. El primero recibe user y password. En caso exitoso devuelve un JWT
router.post('/login', async (req, res) => {
    // ¿Existe el email en la BD?   
    const [result] = await usuarioModel.getByEmail(req.body.email);
    // Compruebo si el usuario existe a partir de su email
    if (result.length === 0) {
        return res.json({ error: 'El email no existe' }
        );
    }
    // En la variable user coloco el objeto con el usuario
    const user = result[0];
    //este iguales devuelve true si las password son iguales (el bcrypt desencripta)
    //Compruebo si la password del usuario es la que recibo a traves del body
    const iguales = bcrypt.compareSync(req.body.password, user.password);
    // Si no coinciden devuelvo un error
    if (!iguales) {
        return res.json({ error: 'Email y/o contraseña incorrectos' });
    }
    //Si esta correcto, a parte del mensajito le paso el token
    res.json({
        success: 'Login correcto',
        token: utils.createToken(user)
    });
    //createToken esta devolviendo un JWT=> return jwt.sign(obj, 'marra es marra');
});

//ENDPOINT NUMBER 2. El segundo recibe un token, comprueba si es válido y:
router.get('/isTokenExpired', async (req, res) => {
    const token = req.headers['authentication'];
    console.log(token)
    const respuesta = utils.isTokenExpired(token);
    res.json(respuesta);
});

router.get('/username', async (req, res) => {
    try {
        const token = req.headers['authentication'];
        const user = usuarioModel.getUserByToken(token);
        const [result] = await usuarioModel.getById(user.usuarioId);
        res.json(result[0]);
    } catch (error) {
        res.json(error);
    }
});


router.get('/profile', checkToken, async (req, res) => {
    try {
        const [result] = await usuarioModel.getById(req.user.id);
        res.json(result[0]);
    } catch (error) {
        res.json(error);
    }
});

router.delete('/:usuarioId', async (req, res) => {
    try {
        const [result] = await usuarioModel.deleteById(req.params.usuarioId);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

module.exports = router;

