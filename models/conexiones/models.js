const config= require('./config')
const mongoose = require('mongoose')
const schema = require('./schemas')
//const uri = config.url+':'+config.port+'/'+config.db;
const uri = "mongodb+srv://laurapaulina09:laurapaulina1039@cluster0.qribmzb.mongodb.net/?retryWrites=true&w=majority"
const Schema = mongoose.Schema
//let usuarioConect;

class Schemas {
    usuarioConect = null
    chatConect=null
    horarioConect=null
    constructor(){
        this.usuarios()
        this.chats()
        this.horario()
    }
    async conectar(){
        await mongoose.connect(uri)
    }
    desconectar(){
        mongoose.disconnect()
    }
    usuarios(){
        let usuario = new Schema(schema.usuarios,{collection:'usuarios'})
        this.usuarioConect = mongoose.model('usuarios', usuario)
    }
    chats(){
        let chat =new Schema(schema.chats,{collection:'chats'})
        this.chatConect=mongoose.model('chats',chat)
    }
    horario(){
        let horario = new Schema(schema.horario, {collection:'horario'})
        this.horarioConect=mongoose.model('horario', horario)
    }
}

module.exports = Schemas
