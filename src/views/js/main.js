var contador1=0;
var contador2=0;
var contador3=0;
var flag1=false;
var flag2=false;
var flag3=false;
$(function() {
		$('#div-Color').addClass('bluee');

		$('.btn-color-r').click(function(){
			$('#div-Color').removeClass();
			$('#div-Color').addClass('pink');
			$('#line-color').removeClass();
			$('#line-color').addClass('line-top-r');
			
			$('#h1ID').removeClass();
			$('#h1ID').addClass('h1-r');
			return false;
		});

		$('.btn-color-b').click(function(){
			$('#div-Color').removeClass();
			$('#div-Color').addClass('bluee');
			$('#line-color').removeClass();
			$('#line-color').addClass('line-top');

			$('#h1ID').removeClass();
			$('#h1ID').addClass('h1-b');
			return false;
		});

		$('.btn-color-o').click(function(){
			$('#div-color').removeClass();
			$('#div-Color').addClass('otrx');

			$('#line-color').removeClass();
			$('#line-color').addClass('line-otrx');
			
			$('#h1ID').removeClass();
			$('#h1ID').addClass('totrx');
			return false;
		});

		// Cuando cargue la pagina cargue con el click llame a la funcion addClon
		$('#add-clon').on('click', addClon);
		$('#add-clon-dos').on('click', addClon2);
		$('#add-clon-4').on('click',addClon3);
	});

	function addClon() {
		console.log('hola');
		contador1++;
		var requirement = $('#clon').html();
		// Agrego dentro del contenedor lo acaba de clonar
		$('#contenedor-clon').append(requirement);
	}

	function addClon2() {
		console.log('hola2');
		contador2++;
		var requirement = $('#clon').html();
		// Agrego dentro del contenedor lo acaba de clonar
		$('#contenedor-clon').append(requirement);
	}

	function addClon3() {
		contador3++;
		console.log('hola3');
		var requirement = $('#clon').html();
		// Agrego dentro del contenedor lo acaba de clonar
		$('#contenedor-clon').append(requirement);
	}

$(document).ready(function() {
	$('div.btn-menu li a:first').addClass('active');
	$('article.mo').hide(); // Oculta todos los article
	$('article.mo:first').show(); // Muestra el primero article

	$('div.btn-menu li a').click(function(){
		$('div.btn-menu li a').removeClass('active');
		// Al que le damos click le agrega la clase
		$(this).addClass('active');

		$('article.mo').hide();
		// Trae su atributo href
		var activeTab = $(this).attr('href');
		$(activeTab).show();

		$('#opcion2').click(function () {
			console.log('hola seccion 2 '+ contador1);
			if(!flag1){
				for(var i=0; i<contador1; i++){
					var requirement = $('#clon').html();
					$('#contenedor-clon').append(requirement);
				}
				flag1=true;
				flag2=false;
				flag3=false;
			}
		});

		$('#opcion3').click(function () {
			console.log('hola seccion 3 '+ contador2);
			if(!flag2){
				for (var i = 0; i < contador2; i++) {
					 var requirement2 = $('#clon-dos').html();
					$('#contenedor-clon').append(requirement2);
				}
			}
				flag1=false;
				flag2=true;
				flag3=false;
	
		});

		

		$('#opcion4').click(function () {
			if(!flag3){
			for (var i = 0; i < contador3; i++) {
					var requirement3 = $('#clon-tres').html();
					$('#contenedor-clon').append(requirement3);
				}
			}
			flag1=false;
			flag2=false;
			flag3=true;
		});
		return false;
	});
});