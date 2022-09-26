/* document.getElementById('form').addEventListener('submit', function(event){
    event.preventDefault();
    alert('este')
}) */
let informacion = {}
function $(param) {
    return document.querySelector(param)
}
function registrar(e) {
    e.preventDefault();
    informacion.nombre = $('#user').value,
    informacion.correo = $('#email').value,
    informacion.contrasena = $('#password1').value,
    informacion.contrasena2 = $('#password2').value
    informacion.rfid = $('#rfid').value
    if (informacion.contrasena != informacion.contrasena2) {
        $('#mensaje').classList.add('mensaje')
        $('#mensaje').innerHTML = '<span>Valida que la contraseña escrita en ambos casos coincida</span>'
        setTimeout(() => {
            $('#mensaje').classList.remove('mensaje')
            $('#mensaje').innerHTML = ''
        }, 4000)
    } else {
        $('#avatars').style.display = "flex"
        mostrarAvatars()
    }
}
function mostrarAvatars() {
    $('.list').querySelectorAll('img').forEach(element => {
        element.addEventListener('click', selectAvatar);
    })
    $('#aceptar').addEventListener('click', aceptar)
}
function selectAvatar(e) {
    $('.list').querySelectorAll('img').forEach(element => {
        element.style.opacity = 1
        $('#aceptar').classList.remove('disabled')
    })
    e.target.style.opacity = .3
    informacion.avatar=e.target.getAttribute('src')
}
function aceptar(){
    fetch('/users/crearUsuario', {
        method:'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body:JSON.stringify(informacion)
    })
    .then(async (resp)=>{
        if(resp.status == 200){
            location.href='/users/inicio'
        }
        let n = await resp.json()
        throw new Error(n.mensaje)
    })
    .then((resp)=>{
        console.log(resp)
    })
    .catch(err=>{
        alert(err)
        setTimeout(()=>location.reload(),100)
    })
}