function alerta(mensaje){
    console.log(mensaje);
    if(mensaje=='Registrado Correctamente'){
        Swal.fire({
            position: 'top-end',
            type: 'success',
            title: mensaje,
            showConfirmButton: false,
            timer: 1500
          })
    }else{
        Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: mensaje,
            footer: '<a href>Deseas Restablecer tu Contraseña?</a>'
        })
    }
}
