function iniciarFacial() {
    let facial = document.getElementById('facial')
    facial.classList.add('facial')
    setTimeout(()=>{
        iniciarCamara()
    },1000)
  }

function iniciarCamara(){
    let video = document.getElementById('video')
    let canvas = document.getElementById('captura')
    navigator.mediaDevices.getUserMedia({video:true})

    .then(stream=>{
        video.srcObject = stream
        video.play()
    })
    .catch(err=> console.log(err))

    document.getElementById('enviarFace').addEventListener('click', function(){
        let usuario = document.getElementById('usuarioFace').value;
        if(usuario != ""){
            canvas.style.marginLeft='35px'
            canvas.style.marginTop='-20px'
            let context = canvas.getContext('2d')
            context.drawImage(video, 0,0, 640, 480)
            video.style.visibility='hidden'
            setTimeout(async ()=>{
                var dataURL = canvas.toDataURL('image/jpeg', 1.0);
                const dataImagen = await fetch(dataURL);
                const blob = await dataImagen.blob()
                enviar(blob, usuario)
            }, 1000)
        }
    })
}

function enviar(imagen, usuario){
    var formdata = new FormData();
    formdata.append("file", imagen);

    var requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
    };

    fetch("http://127.0.0.1:8000/upload/"+usuario, requestOptions)
    .then(response => response.text())
    .then(result =>{
        if(result != "No hay similitud"){
            sendRFID(result)
        }
    })
    .catch(error => console.log('error', error));
}