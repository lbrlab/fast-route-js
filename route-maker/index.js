'use strict'

/**
 * Created by: Daniel Proença
 * License: MIT
 * Email(personal): devillabdeveloper@gmail.com || danielproenca89@gmail.com
 * Email(professional): daniel.proenca@lbrtelecom.com.br
 * 
 */

const Connection = require('./conn')
const http = require('http'); 
const express = require('express'); 
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));
require("dotenv-safe").config();
const jwt = require('jsonwebtoken'); 
const config = require('../config/config.json')
const md5 = require('md5')

module.exports = class RouteMaker{

    constructor(routes){

        this.routes = routes
        this.app = app
        this.auth = false
        this.verify = false
        
    }




    
    verifyJWT(req, res, next){
        const token = req.headers['x-access-token'];
        if (!token) return res.status(401).json({ auth: false, message: 'No token provided.' });       
        jwt.verify(token, process.env.SECRET, function(err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: 'Failed to authenticate token.' });
        req.userId = decoded.id;
        next();
    });
    }


    pass(req,res, next){

        next()

    }

    createRoute(){

        this.routes.forEach((e,i)=>{
            
            if(e.method === 'GET'){
             app.get('/'+e.path, process.env.AUTH==1?this.verifyJWT:this.pass, async (req, res, next) => { 
                
      
                const conn = new Connection(config[e.name])
                conn.connect()
                const query = await conn.get_result(e.query, req.query)

                return res.json(query)

            })
            }



            if(e.method === 'POST'){
                app.post('/'+e.path, process.env.AUTH==1?this.verifyJWT:this.pass,(req, res, next) => { 
                
                    
                    const conn = new Connection(config[e.name])
                    conn.connect()
                    const query = conn.insert(e.table, req.body)
    
                    return res.json(query)
    
                })
          
            }

            if(e.method === 'PUT'){
                app.post('/'+e.path, process.env.AUTH==1?this.verifyJWT:this.pass,(req, res, next) => { 
                
                    
                    const conn = new Connection(config[e.name])
                    conn.connect()
                    const query = conn.update(e.table, req.body.data, req.body.where)
    
                    return res.json(query)
    
                })
          
            }

            if(e.method === 'DELETE'){
                app.post('/'+e.path, process.env.AUTH==1?this.verifyJWT:this.pass,(req, res, next) => { 
                
                    
                    const conn = new Connection(config[e.name])
                    conn.connect()
                    const query = conn.delete(e.table, req.body.data)
    
                    return res.json(query)
    
                })
          
            }
            
            if(e.method === 'login'){
                app.post('/'+e.path, async (req, res, next) => { 
                
                    const conn = new Connection(config[e.name])
                    conn.connect()
    
                    const body =  Object.values(req.body)

                    const query = await conn.get_result(e.query, {username:body[0], password:md5(body[1])})
             
                    if(query[0].id){ 
                    const id = query[0].id; 
                    const token = jwt.sign({ id }, process.env.SECRET, {
                      expiresIn: 300
                    });

                    return res.json({ auth: true, token: token });

                    }else{
                    return res.status(500).json({message: 'Invalid Login!'});
                    }
                 
    
                })
          
            }
          

          
            })

            return app

    }


}