document.getElementById('form').addEventListener('submit', function(e){
    e.preventDefault();
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
        return resp.json()
        //location.href='/'
    }).then((resp)=>{
        sessionStorage.setItem('id', resp._id)
        location.href='/'
    }).catch(err=>{
        console.log(err)
    })
})