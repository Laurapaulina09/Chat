const jwt = require('jsonwebtoken')
const secure = "wz43TYFm$Mr#b3UaR5C692ayNW^YX8QDN#IMbwtB@@%KKQCV7"

let element= {
    generar(data){
        let f = new Date(Date.now())
        return jwt.sign({
            ext:Math.floor(Date.now() / 1000 + (1000 * 60)),
            data:{
                data,
                exp:`${f.getFullYear()}-${f.getMonth()+1}-${f.getDate()} ${f.toTimeString()}`
            }
        },secure,{ expiresIn: '1h' } )
    },
    decodificar(token){
        try {
            verificar = jwt.verify(token, secure)
            return verificar
        } catch (error) {
            return false
        }
    }
}

module.exports = element