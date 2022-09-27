var createError = require('http-errors');
var express = require('express');
var path = require('path');
var debug = require('debug')('mychat:server');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./controller/index');
var usersRouter = require('./controller/users');
const apiRouter = require('./controller/api')
const cors = require('cors')
const verificar = require('./middleware/middleware');
var http = require('http');
const { Server } = require("socket.io");
const crud = require('./models/service');
var app = express();
var bcrypt=require('bcrypt')
const { body, validationResult } = require('express-validator');
const token = require('./middleware/token');
require('dotenv').config()

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//app.use('/users', verificar, usersRouter);
//app.use('/',verificar,indexRouter);
app.use('/users', usersRouter);
app.use('/api', apiRouter)
//app.use('/',indexRouter);

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


var server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8000",
    methods: ["GET", "POST"]
  }
});


app.get('/', verificar, function(req, res, next) {
  console.log('entro')
  res.sendFile(path.join(__dirname,'views','index.html'));
});
app.post('/addMensajeNew', verificar, (req,res)=>{
  let datosMensaje={
    usuario1:req.body.usuario1,
    usuario2:req.body.usuario2,
    mensaje:req.body.mensaje,
  }
  crud.agregarNuevoMensaje(datosMensaje, (resp)=>{
    if(resp.status == 'error'){
      return res.status(500).send('Error agregando el mensaje')
    }
    io.emit(datosMensaje.usuario1, resp)
    io.emit(datosMensaje.usuario2, resp)
    return res.status(200).send(resp)
  })
})
app.post('/addMensaje', verificar, (req,res)=>{
  let datosMensaje = {
    usuarios:req.body.usuarios,
    mensaje:req.body.mensaje,
    usuario1:req.body.usuario1
  }
  crud.agregarMensaje(datosMensaje, (resp)=>{
    if(resp.status === 'error') return res.status(500).send('Error agregando el mensaje')
    resp.usuarios=datosMensaje.usuarios
    io.emit(datosMensaje.usuarios, resp)
    io.emit(datosMensaje.usuarios.split('_')[0], resp)
    io.emit(datosMensaje.usuarios.split('_')[1], resp)
    return res.status(200).send('Mensaje creado con exito')
  })
})
app.get('/mensajesUsuario/:usuario', verificar, (req,res)=>{
  crud.consultarMensajes(req.params.usuario, (resp)=>{
    if(resp.status==='error') return res.status(500).json(resp)
    return res.status(200).send(resp)
  })
})
app.get('/mensajesUsuarioOne', verificar, (req,res)=>{
  crud.consultaMensajeUsuario(req.token.data.data._id, (resp)=>{
    console.log(resp)
    res.send(resp)
  })
})
app.get('/mensajes', verificar, (req,res)=>{
  crud.consultaGeneral((resp)=>{
    if(resp.status==='error') return res.status(500).json(resp)
    return res.status(200).send(resp)
  })
})
app.get('/usuario/:id', verificar, (req,res)=>{
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
app.get('/consultaMensajes/:usuarios', verificar, (req,res)=>{
  crud.consultarMensajesChatEspecifico(req.params.usuarios, (resp)=>{
    if(res.status != 'error'){
      return res.status(200).send(resp)
    }
    res.status(400).send(resp)
  })
})

app.get('/cerrar/:id', (req,res)=>{
  crud.actualizarEstado(req.params.id, false, ()=> res.send('sesión cerrada'))
})


server.listen(process.env.PORT || 3000);
server.on('error', onError);
server.on('listening', onListening);


function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}


function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}


function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}

module.exports=io