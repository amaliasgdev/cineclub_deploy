//Configuracion del servidor
const http = require('http');
const app = require('../app');

//Configuracion .env => datos del fichero de entorno (dato basico)
require('dotenv').config();

//configuracion base de datos => luego se conecta a la base de datos (dato basico)
require('../config/db.config');

//Creacion servidor
const server = http.createServer(app);

let PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor escuchando al puerto ${PORT}`);
});
