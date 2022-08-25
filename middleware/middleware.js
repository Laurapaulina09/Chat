const docodeToken = require('./token')
function verificar(req,res,next){
    let cookie = req.headers.cookie;
    let m=null
    if (cookie === undefined || cookie.search('access_token') == -1 || cookie.se) {
        return res.redirect('/users/inicio')
    }else{
        let x =cookie.split('; ')
        m =x.filter(ele=>{
            if(ele.search('access_token') == 0){
                return ele
            }
        })
    }

    if(m[0].split('=')[1] === ''){
        return res.redirect('/users/inicio')
    }
    let n =docodeToken.decodificar(m[0].split('=')[1])
    req.token = n
    if(!n){
        return res.redirect('/users/inicio')
    }
    next()
}
module.exports=verificar