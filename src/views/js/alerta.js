function alerta(mensaje,flag){
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
        })
    }
}
