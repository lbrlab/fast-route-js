'use strict'

const config = require('./config.json')
const mysql = require('mysql2')

class Connection{

    constructor(server){
    this.server = server
    this.name = this.server.name
    this.errors = []
    this.config = {
        host: this.server.host,
        user: this.server.user,
        database: this.server.db,
        password: this.server.password,
        connectionLimit: 1
        }
    }

    connect(){
    
    try{
        this.pool = mysql.createConnection(this.config).promise();
        return true
    }catch(err){
        console.log(err)
        this.errors.push(err)
        return false
    }
    }



    async get_result(query, params=null){

    try{
        const rows = await this.pool.query(query, params);
        return rows;

    }catch(err){
        
        this.errors.push(err);
        return err;
    }

    }

    async insert(table,obj){

        if(typeof(obj) == 'object'){0

            if(!Array.isArray(obj)){

            const colums = Object.keys(obj)
            const values = Object.values(obj)
            const req = await this.pool.query(`REPLACE INTO ${table} (${colums.join(',')}) values (${values.map(e=>`'${e}'`).join(',')})`)
            
            }else{

            obj.forEach(async o=>{

            try{
                const colums = Object.keys(o)
                const values = Object.values(o)
                const req = await this.pool.query(`REPLACE INTO ${table} (${colums.join(',')}) values (${values.map(e=>`'${e}'`).join(',')})`)        
                }
            catch(err){
                console.log(err)
                this.errors.push(err)
            }
            })
            }
        }

    }

}

async function teste(){
    const conn = new Connection(config.servers[0])

    conn.connect()

    const res = await conn.insert({char:"teste"})

    console.log(res)
}

teste()
