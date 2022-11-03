document.getElementById('form').addEventListener('submit', function(e){
    console.log('Inicio')
    e.preventDefault();
    if(activo == "email"){
        sendEmail()
    }else{
        sendRFID()
    }
})

function sendEmail(){
    let informacion = {
        correo:document.getElementById('correo').value,
        contrasena:document.getElementById('contrasena').value
    }
    fetch('/users/inicio', {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(informacion)
    }).then((resp)=>{
        console.log(resp)
        return resp.json()
        //location.href='/'
    }).then((resp)=>{
        sessionStorage.setItem('id', resp._id)
        location.href='/'
    }).catch(err=>{
        console.log(err)
    })
}
function sendRFID(data=""){
    if(data==""){
        let informacion = {
            rfid:document.getElementById('rfid').value
        }
    }else{
        let informacion = {
            rfid:data
        }
    }
    fetch('/users/inicioRFID', {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(informacion)
    }).then(async (resp)=>{
        console.log(resp)
        let n = await resp.json()
        console.log(n)
        if(resp.status == 200){
            return n
        }
        throw new Error(n.mensaje)
    }).then((resp)=>{
        sessionStorage.setItem('id', resp._id)
        sessionStorage.setItem('rfid', resp.rfid)
        location.href='/'
    }).catch(err=>{
        alert(err)
    })
}