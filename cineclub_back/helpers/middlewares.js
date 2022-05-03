const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const usuarioModel = require('../models/usuario.model');
// vamos a crear un metodo para gestionar la creacion del token

//MIDDLEWARE: Todos=> Recordatorio: hago comprobaciones, miro cosas, y si todo va bien hago next
//O sea, 3 parametros (req, res, next)
const checkToken = async (req, res, next) => {
    //1.- Comprobar si el TOKEN viene incluido dentro de las cabeceras
    //Si no existe esta cabecera te vas para fuera
    //console.log(localStorage.getItem("token"))

    //console.log('CAPTURA TOKEN DESDE MIDDLEWARE', req.headers['authentication'])

    if (!req.headers['authentication']) {
        return res.json({ error: 'Debes incluir la cabecera de autenticación' });
    }
    //2.- Comprobar si el token es corrector. Para ello la tenemos que descodificar con jwt, que es la libreria con la que la hemos codificado
    const token = req.headers['authentication'];
    let obj;
    try {
        obj = jwt.verify(token, 'marra es marra');
    } catch (error) {
        return res.json({ error: 'El token es incorrecto' });
    }
    //console.log(obj)//Imprime en el terminal { usuarioId: 6, expira: 1648800085, iat: 1648799785 }
    //que es lo mismo que codificamos
    //3.- Comprobar si el token no esta caducado
    const currentDate = dayjs().unix();
    if (currentDate > obj.expira) {
        return res.json({ error: 'El token está caducado. Pide otro' });
    }
    // A partir del id del usuario resuperar todos los datos del mismo
    // Metodo dentro del modelo de usuario que me permita recuperar los datos de un usuario por ID
    const [result] = await usuarioModel.getById(obj.usuarioId)
    //IMPORTANTISIMO PARA CUALQUIER ACCION SOBRE USUARIOS CON LOGIN
    //EN LA VARIABLE req.user LE METEMOS LOS DATOS DEL USUARIO QUE HA HECHO LOGIN
    req.user = result[0];
    next();
}

const checkAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.json({ error: 'No tienes acceso a los datos de la API' });
    }
    next();
}

module.exports = {
    checkToken,
    checkAdmin
}