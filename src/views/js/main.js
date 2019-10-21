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
		return false;
	});

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
		$('#div-Color').addClass('otrx');

		$('#line-color').removeClass();
		$('#line-color').addClass('line-otrx');
		
		$('#h1ID').removeClass();
		$('#h1ID').addClass('totrx');
		return false;
	});

	$(function() {
		// Cuando cargue la pagina cargue con el click llame a la funcion addClon
		$('#add-clon').on('click', addClon);
		$('#add-clon-dos').on('click', addClonDos);
		$('#add-clon-3').on('click', addClon3);
	});

	function addClon() {
		var requirement = $('#clon').html();
			// Agrego dentro del contenedor lo acaba de clonar
		$('#contenedor-clon').append(requirement);
	}

	function addClonDos() {
		var requirement2 = $('#clon-dos').html();
		$('#contenedor-clon').append(requirement2);
	}

	function addClon3() {
		var requirement3 = $('#clon-3').html();
		$('#contenedor-clon').append(requirement3);
	}

});