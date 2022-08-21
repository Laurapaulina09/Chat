var express = require('express');
var bcrypt=require('bcrypt')
const { body, validationResult } = require('express-validator');
const path = require('path');
var router = express.Router();
const crud = require('../models/index')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.get('/crearUsuario', function (req, res, next) {
  res.sendFile(path.join(__dirname, '..', 'views', 'Registro.html'))
})
router.get('/inicio', function (req, res, next) {
  res.sendFile(path.join(__dirname, '..', 'views', 'iniciar.html'))
})
router.post('/crearUsuario',
  body('correo').isEmail().withMessage('correo no valido'),
  body('contrasena').isLength({min:4,max:16}).withMessage('La contraseña no cumple con los requisitos minimos '),
  body('nombre').isLength({min:3,max:30}),
  body('avatar').isLength({min:3}),
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
      avatar: req.body.avatar
    }
    crud.crearUsuario(datosUsuario, (response) => {
      res.send(response)
    })
  })

  router.post('/inicio',
  body('correo').isEmail().withMessage('correo no valido'),
  body('contrasena').isLength({min:4,max:16}).withMessage('La contraseña no cumple con los requisitos minimos '),
  function (req, res) {
    //console.log(req.contrasena)
    const error=validationResult(req)
    if(!error.isEmpty()){
      return res.status(400).send({error:error.array()})
    }
    let datosUsuario = {
      correo: req.body.correo,
      contrasena: req.body.contrasena,
    }
    crud.buscarUsuario(datosUsuario.correo,(err,data)=>{
      if (err){
        return res.status(500).send("no se pudo realizar la búsqueda")
      }
      if(data==null){
        return res.status(404).send("no se encontró el usuario,por favor registrese")
      }
      bcrypt.compare(datosUsuario.contrasena, data.contrasena, (err, result)=>{
        if(result){
          return res.send(data)
        }
        return res.status(401).send('Usuario no autorizado')
      })
      //res.send(data)
    })

  })


router.get('/usuarios', function (req, res) {
  crud.buscarUsuarios((data) => {
    res.send(data)
  })
})


module.exports = router;
