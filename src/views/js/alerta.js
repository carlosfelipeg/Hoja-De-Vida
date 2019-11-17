function alerta(mensaje,error){
    console.log(error);
    if(error=='false'){
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
