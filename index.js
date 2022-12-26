'use strict'
const http = require('http')
const servers = require('./servers.json')
const RouteMaker = require('./route-maker')


const app = new RouteMaker(servers)

const server = http.createServer(app.createRoute()); 
server.listen(3001);
console.log("Servidor escutando na porta 3000...")