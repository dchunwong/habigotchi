var user, habits;


function login(name, password){
response = sendRequest('POST','/login',{"name":name,"password":password});
	if (response.success){
		user = response.user;
		habits = response.habits;
	}
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

});





