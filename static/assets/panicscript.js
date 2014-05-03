var user, habits;


function login(name, password){
response = sendRequest('POST','/login',{"name":name,"password":password});
	if (response.success){
		user = response.user;
		habits = response.habits;
	}
}

function signupexpand(e) {
    console.log("signupexpand here!");
    a = $("#loginsignup");
    a.css("transition", "1s");
    a.css( "height", "250px" );
    setTimeout(function(){$( 'input[name=password]' ).after( '<input class="login"  name="email" placeholder="email">' );
    $( 'input[name=password]' ).after( '<input class="login" name="number" placeholder="phone number">' );},1000);
}

function sendRequest(type, url, data){
return JSON.parse($.ajax({
		type: type,
		url: url,
		data: data,
		async: false,
		dataType: "json",
	}).responseText);
}

$(document).ready( function() {

	$('input[name=login-button] ').click(function (){ 
		login($('input[name=username] ').val(), $('input[name=password] ').val());
	});
	$('input[name=register-button] ').click(signupexpand);

	/*$('input[name=login-button]').click(function (){ 
	    $('#loginsignup-container').fadeOut(400);
	    $('#logo-container').delay(400).fadeOut(800).slideUp(750);
	});
	
	$('background background-image').attr({backgroundPosition: '100px'}, 1000);*/

});





