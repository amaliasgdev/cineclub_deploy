//Fichero que contiene todos los manejadores de la aplicacion
const express = require('express');
const cors = require('cors');

const path = require('path');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));


//2 configuraciones basicas de express: 
//Configuracion de App Express
//la 1.-poder recibir objetos a traves del rec body
//la 2.3para poder pasar partes dinamicas en la URL
//la 3 para poder usar la libreria cors() y que la app se comunique bien con localhost
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Configuracion de los manejadores
app.use(require('./routes'));

module.exports = app;