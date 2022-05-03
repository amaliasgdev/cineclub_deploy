const dayjs = require('dayjs');
const jwt = require('jsonwebtoken');

//jwt -> tiene 3 metodos: decode, verify, sing

const createToken = (pUser) => {
    const obj = {
        usuarioId: pUser.id,
        //añade minutos a la fecha actual       
        expira: dayjs().add(60, 'minutes').unix()
    }
    //1 parametro: payload: obejto que vamos a meter dentro del token
    //2 parametro: puede ser un string, una frase o cualquer cosa para firmar este token
    //sing(): retorna un string que es el TOKEN
    return jwt.sign(obj, 'marra es marra');
}

const isTokenExpired = (token) => {
    //console.log('ENTRADA DEL TOKEN IS EXPIRED', token)
    var respuesta = 'correcto'

    //CASO 1. NO HAY TOKEN 
    if (!token) {
        respuesta = 'no hay token';
    }

    //CASO 2. CAPTURAMOS EL TOKEN Y COMPROBAMOS SU CADUCIDAD
    //Decodificamos el token con la informacion del usuario
    //Si la fecha de expiracion es anterior a la actual, el token ha expirado
    var payload = jwt.decode(token, "marra es marra");
    /* console.log('PAYLOAD EXPIRA', payload.expira)
    console.log('AHORA', dayjs().unix())
    console.log(payload.expira - dayjs().unix()) */
    if (payload.expira <= dayjs().unix()) {
        //console.log('Esta caducado')
        respuesta = 'expirado';
    }

    //console.log('RESPUESTA IS EXPIRED', respuesta)
    return respuesta;
}

module.exports = {
    createToken,
    isTokenExpired
} 