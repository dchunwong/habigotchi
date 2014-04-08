var user, habits;


/*function login(name, password){
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
}*/

$(document).ready( function() {

	/*$('input[name=login-button] ').click(function (){ 
		var name = "Hello";
		var pw = "World";
		login(name, pw);
		console.log(name,", ",pw); 
	});*/

	$('input[name=login-button]').click(function (){ 
	 	$('#logo-container').slideUp(200);
	});
	

});





