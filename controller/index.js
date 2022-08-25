var express = require('express');
var router = express.Router();
const {join} = require('path');
const io = require('../app');
const crud = require('../models/service');
const {buscarUsuarios} = require('../models/service');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(join(__dirname, '..','views','index.html'));
});
router.post('/addMensajeNew', (req,res)=>{
  let datosMensaje={
    usuario1:req.body.usuario1,
    usuario2:req.body.usuario2,
    mensaje:req.body.mensaje,
  }
  crud.agregarNuevoMensaje(datosMensaje, (resp)=>{
    if(resp.status == 'error'){
      return res.status(500).send('Error agregando el mensaje')
    }
    return res.status(200).send(resp)
  })
})
router.post('/addMensaje', (req,res)=>{
  let datosMensaje = {
    usuarios:req.body.usuarios,
    mensaje:req.body.mensaje,
    usuario1:req.body.usuario1
  }
  crud.agregarMensaje(datosMensaje, (resp)=>{
    if(resp.status === 'error') return res.status(500).send('Error agregando el mensaje')
    io.emit(datosMensaje.usuarios, resp)
    return res.status(200).send('Mensaje creado con exito')
  })
})
router.get('/mensajesUsuario/:usuario', (req,res)=>{
  crud.consultarMensajes(req.params.usuario, (resp)=>{
    if(resp.status==='error') return res.status(500).json(resp)
    return res.status(200).send(resp)
  })
})
router.get('/mensajesUsuarioOne', (req,res)=>{
  crud.consultaMensajeUsuario('630306c3d46ba84891bb96b9', (resp)=>{
    console.log(resp)
    res.send(resp)
  })
})
router.get('/mensajes', (req,res)=>{
  crud.consultaGeneral((resp)=>{
    if(resp.status==='error') return res.status(500).json(resp)
    return res.status(200).send(resp)
  })
})
router.get('/usuario/:id', (req,res)=>{
  crud.buscarUsuarioId(req.params.id, (err, resp)=>{
    if(err){
      return res.status(500).send('Error en el servidor')
    }
    res.status(200).send({
      nombre:resp.nombre,
      avatar:resp.avatar,
      online:resp.online
    })
  })
})
router.get('/consultaMensajes/:usuarios', (req,res)=>{
  crud.consultarMensajesChatEspecifico(req.params.usuarios, (resp)=>{
    if(res.status != 'error'){
      return res.status(200).send(resp)
    }
    res.status(400).send(resp)
  })
})


module.exports = router;
