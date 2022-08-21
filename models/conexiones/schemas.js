const schema = {
    usuarios: {
        nombre: 'String',
        correo: 'String',
        contrasena: 'String',
        online: 'Boolean',
        avatar: 'String'
    },
    chats: {
        usuario1: 'String',
        usuario2: 'String',
        mensajes: [
            {
                mensaje: 'String',
                fecha: 'Number',
                remite: 'String'
            }
        ]
    },
}
module.exports = schema