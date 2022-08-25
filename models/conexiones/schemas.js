const schema = {
    usuarios: {
        nombre: 'String',
        correo: 'String',
        contrasena: 'String',
        online: 'Boolean',
        avatar: 'String'
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
}
module.exports = schema