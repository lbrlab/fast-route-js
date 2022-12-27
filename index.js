'use strict'

/**
 * Created by: Daniel Proença
 * License: MIT
 * Email(personal): devillabdeveloper@gmail.com || danielproenca89@gmail.com
 * Email(professional): daniel.proenca@lbrtelecom.com.br
 * 
 */

const http = require('http')
const servers = require('./config/end_point.json')
const RouteMaker = require('./route-maker')
require("dotenv-safe").config();

const app = new RouteMaker(servers)

const server = http.createServer(app.createRoute()); 
server.listen(process.env.PORT);
console.log(`Servidor escutando na porta ${process.env.PORT}...`)