const schema = {
    usuarios: {
        nombre: 'String',
        correo: 'String',
        contrasena: 'String',
        online: 'Boolean',
        avatar: 'String',
        rfid:'String'
    },
    chats: {
        usuarios: 'String',
        usuario1:'String',
        usuario2:'String',
        mensajes: [
            {
                mensaje: 'String',
                fecha: 'Number',
                remitente: 'String'
            }
        ]
    },
    horario:{
        usuario:'String',
        horario:[
            {
                isEntrada:'Boolean',
                fecha:'Number'
            }
        ]
    }
}
module.exports = schema