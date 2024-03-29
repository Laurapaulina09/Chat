const Schema = require('./conexiones/models')
const esquema = new Schema()
esquema.conectar()
const crud = {
    buscarUsuarios(cb) {
        esquema.usuarioConect.find()
            .exec((err, data) => {
                err ? cb(err) : cb(data)
            })
    },
    buscarUsuario(correo, rfid, cb) {
        esquema.usuarioConect.findOne({
            $or: [
                {
                    correo
                },
                {
                    rfid
                }
            ]
        })
            .exec((err, data) => {
                cb(err, data)
            })
    },
    buscarUsuarioRfid(rfid, cb) {
        esquema.usuarioConect.findOne({ rfid })
            .exec((err, data) => {
                cb(err, data)
            })
    },
    buscarUsuarioId(idUser, cb) {
        esquema.usuarioConect.findOne({ _id: idUser })
            .exec((err, data) => {
                if (err) {
                    cb(true, false)
                }
                cb(false, data)
            })
    },
    crearUsuario(datosCrear, cb) {
        this.buscarUsuario(datosCrear.correo, datosCrear.rfid, (err, data) => {
            if (err) {
                cb({
                    status: 'error',
                    mensaje: 'Falló la busqueda del usuario'
                })
            } else if (data == null) {
                esquema.usuarioConect.create(datosCrear, (error, res) => {
                    if (error) {
                        cb({
                            status: 'error',
                            mensaje: 'Falló la creación del usuario'
                        })
                    } else {
                        cb({
                            status: 'exitoso',
                            mensaje: res
                        })
                    }
                })
            } else {
                cb({
                    status: 'alerta',
                    mensaje: 'El usuario que intenta crear ya existe'
                })
            }
        })
    },
    actualizarHorario(id, estaCreado, estado,  cb){
        if(estaCreado){
            esquema.horarioConect.update({usuario:id}, {
                $push:{
                    horario:{
                        $each:[
                            {
                                fecha: Date.now(),
                                isEntrada:estado
                            }
                        ]
                    }
                }
            })
            .exec(err=>{
                if(!err){
                    cb()
                }
                if(err) console.log('Error creando la actualización')

            })
        }else{
            esquema.horarioConect.create({
                usuario:id,
                horario:[
                    {
                        fecha: Date.now(),
                        isEntrada:estado
                    }
                ]
            },(err, resp)=>{
                if(resp) {
                    console.log(resp)
                    cb()
                }else{
                    console.log(err)
                }
            })
        }
    },
    actualizarEstado(id, estado, cb) {
        console.log(id)
        esquema.horarioConect.findOne({usuario:id})
        .exec((err, resp)=>{
            if(err) return {status:'error', mensaje:'No fue posible iniciar sesion'}
            estaCreado = resp === null ? false : true
            this.actualizarHorario(id, estaCreado, estado,()=>{
                esquema.usuarioConect.updateOne({ _id: id }, { $set: { online: estado } })
                .exec(err => {
                    if (err) {
                        cb({
                            status: 'error',
                            mensaje: 'Fallo la actualizacion'
                        })
                    } else {
                        cb({
                            status: 'exitoso'
                        })
                    }
                })
            })
        })
        
    },
    agregarMensaje(datosMensaje, cb) {
        let mensaje = {
            mensaje: datosMensaje.mensaje,
            remitente: datosMensaje.usuario1,
            fecha: Date.now(new Date())
        }
        esquema.chatConect.update({ usuarios: datosMensaje.usuarios }, {
            $push: {
                mensajes: {
                    $each: [
                        mensaje
                    ]
                }
            }
        })
            .exec(err => {
                if (err) cb({
                    status: 'error',
                    mensaje: 'Fallo la actualizacion'
                })
                cb({
                    status: 'exitoso',
                    mensaje: mensaje
                })
            })
    },
    agregarNuevoMensaje(datosMensaje, cb) {
        esquema.chatConect.create({
            usuarios: datosMensaje.usuario1 + '_' + datosMensaje.usuario2,
            usuario1: datosMensaje.usuario1,
            usuario2: datosMensaje.usuario2,
            mensajes: [
                {
                    mensaje: datosMensaje.mensaje,
                    remitente: datosMensaje.usuario1,
                    fecha: Date.now(new Date())
                }
            ]
        }, (err, res) => {
            if (err) {
                cb({
                    status: 'error',
                    mensaje: 'Falló la creación del mensaje'
                })
            } else {
                cb({
                    status: 'exitoso',
                    mensaje: res
                })
            }
        })
    },
    consultarMensajes(id, cb) {
        esquema.chatConect.find({
            usuarios: {
                $regex: id
            }
        })
            .exec((err, data) => {
                err ? cb({ status: 'error', contenido: err }) : cb({ status: 'exitoso', contenido: data })
            })
    },
    async consultaMensajeUsuario(id, cb) {
        esquema.chatConect.find({
            usuarios: {
                $regex: id
            }
        })
            .exec((err, data) => {
                if (err) {
                    cb(err)
                }
                let n = data.map(element => {
                    let idUser = element.usuarios.replace(id, '').replace('_', '')
                    return {
                        usuarios: element.usuarios,
                        usuario: idUser,
                        mensaje: element.mensajes.pop()
                    }
                });
                cb(n)
            })
    },
    consultaGeneral(cb) {
        esquema.chatConect.find()
            .exec((err, data) => {
                err ? cb({ status: 'error', contenido: err }) : cb({ status: 'exitoso', contenido: data })
            })
    },
    consultarMensajesChatEspecifico(usuarios, cb) {
        esquema.chatConect.find({ usuarios })
            .exec((err, data) => {
                if (err) {
                    cb({
                        status: err,
                    })
                }
                cb({
                    status: 'exitoso',
                    content: data
                })
            })
    },
    traerHoras(cb){
        esquema.horarioConect.find()
        .exec((err,resp)=>{
            if(err){
                cb({
                    status:'error'
                })
            }else{
                cb({
                    estatus:'exitoso',
                    data:resp
                })
            }            
        })
    }
}
module.exports = crud
