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
    buscarUsuario(correo, cb) {
        esquema.usuarioConect.findOne({ correo })
            .exec((err, data) => {
                cb(err, data)
            })
    },
    crearUsuario(datosCrear, cb) {
        this.buscarUsuario(datosCrear.correo, (err, data) => {
            if (err) {
                cb({
                    status: 'error',
                    mensaje: 'Falló la busqueda del usuario'
                })
            } else if (data == null) {
                esquema.usuarioConect.create(datosCrear,(error,res)=>{
                    if(error){
                        cb({
                            status: 'error',
                            mensaje: 'Falló la creación del usuario'
                        })
                    }else {
                        cb({
                            status:'exitoso',
                            mensaje:res
                        })
                    }


                })

            }else{
                cb({
                    status:'alerta',
                    mensaje:'El usuario que intenta crear ya existe'
                })
            }
        })
    }
}

module.exports = crud
