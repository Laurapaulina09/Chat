const { Router } = require("express");
const crud = require('../models/service')
const router = Router()

router.get('/horario', (req,res)=>{
    let fecha = parseInt(req.params.fecha)
    crud.traerHoras((horario)=>{
        if(horario.status != 'error'){
            let n = {
                horario:horario.data
            }
            crud.buscarUsuarios((resp)=>{
                n.usuarios = resp
                res.json(n)
            })
        }
    })
})
module.exports = router