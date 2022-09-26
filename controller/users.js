var express = require('express');
var bcrypt=require('bcrypt')
const { body, validationResult } = require('express-validator');
const path = require('path');
var router = express.Router();
const crud = require('../models/service');
const token = require('../middleware/token');
const verificar = require('../middleware/middleware');

/* GET users listing. */

router.get('/crearUsuario', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'Registro.html'))
})
router.get('/inicio', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'views', 'iniciar.html'))
})
router.post('/crearUsuario',
  body('correo').isEmail().withMessage('correo no valido'),
  body('contrasena').isLength({min:6,max:16}).withMessage('La contraseña no cumple con los requisitos minimos '),
  body('nombre').isLength({min:3,max:48}),
  body('avatar').isLength({min:10}),
  function (req, res) {
    const error=validationResult(req)
    if(!error.isEmpty()){
      return res.status(400).send({error:error.array()})
    }

    let hash = bcrypt.hashSync(req.body.contrasena, 10)
    let datosUsuario = {
      correo: req.body.correo,
      nombre: req.body.nombre,
      contrasena: hash,
      online: false,
      avatar: req.body.avatar,
      rfid:req.body.rfid
    }

    crud.crearUsuario(datosUsuario, (response) => {
      if(response.status == 'exitoso') return res.send(response)
      return res.status(404).send(response)
    })

  })

  router.post('/inicio',
  body('correo').isEmail().withMessage('correo no valido'),
  body('contrasena').isLength({min:4,max:16}).withMessage('La contraseña no cumple con los requisitos minimos '),
  function (req, res) {
    const error=validationResult(req)
    if(!error.isEmpty()){
      return res.status(400).send({error:error.array()})
    }
    let datosUsuario = {
      correo: req.body.correo,
      contrasena: req.body.contrasena,
    }
    console.log(datosUsuario)
    crud.buscarUsuario(datosUsuario.correo,(err,data)=>{
      console.log(data)
      if (err){
        return res.status(500).send("no se pudo realizar la búsqueda")
      }
      if(data==null){
        return res.status(404).send("no se encontró el usuario,por favor registrese")
      }
      bcrypt.compare(datosUsuario.contrasena, data.contrasena, (err, result)=>{
        if(result){
          //return res.redirect(')
          let tokenGenerado = token.generar({
            _id:data._id,
            nombre:data.nombre,
            correo:data.correo,
            avatar:data.avatar
          })
          crud.actualizarEstado(data._id, true, (resp)=>{
            console.log(resp)
          })
          return res.cookie('access_token',tokenGenerado,{
            sameSite: 'strict',
            path: '/',
            expires: new Date(Date.now() + (1000 * 3600)),
            httpOnly: true
          }).status(200).send({
            _id:data._id,
            nombre:data.nombre,
            correo:data.correo,
            avatar:data.avatar,
            rfid:data.rfid
          })
        }
        return res.status(401).send('Usuario no autorizado')
      })
    })

  })

  router.post('/inicioRFID', (req,res)=>{
    let rfid = req.body.rfid
    crud.buscarUsuarioRfid(rfid, (err, data)=>{
      if (err){
        return res.status(500).send({
          mensaje:"Error interno en el servidor, por favor intentelo más tarde"
        })
      }
      if(data==null){
        console.log('usuarios no encontrado')
        return res.status(404).send({
          mensaje:"No se encontró el usuario,por favor registrese"
        })
      }
      let tokenGenerado = token.generar({
        _id:data._id,
        nombre:data.nombre,
        correo:data.correo,
        avatar:data.avatar
      })
      crud.actualizarEstado(data._id, true, (resp)=>{
        console.log(resp)
      })
      return res.cookie('access_token',tokenGenerado,{
        sameSite: 'strict',
        path: '/',
        expires: new Date(Date.now() + (1000 * 3600)),
        httpOnly: true
      }).status(200).send({
        _id:data._id,
        nombre:data.nombre,
        correo:data.correo,
        avatar:data.avatar,
        rfid:data.rfid
      })
    })
  })
  router.post('/verificaToken', (req,res)=>{
    let verifica =token.decodificar(req.body.token)
    console.log(verifica)
    if(verifica){
      return res.status(200).send('Ok')
    }else{
      return res.redirect('/users/inicio')
    }
  })

router.get('/usuarios', function (req, res) {
  crud.buscarUsuarios((data) => {
    res.send(data)
  })
})


module.exports = router;
