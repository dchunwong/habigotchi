// main.js

// takes in the container div
// creates and puts the login popup in container
var LoginPopup = function(container) {
    var login = document.createElement('div');
    login.id='loginPopup';
    login.className='hidden-popup';

    login.appendChild(textField('Username', 'input-textbox'));
    login.appendChild(document.createElement('br'));
    login.appendChild(textField('Password', 'input-textbox'));
    login.appendChild(document.createElement('br'));
    login.appendChild(textField('Email', 'input-textbox'));
    login.appendChild(document.createElement('br'));
    login.appendChild(textField('Mobile Number', 'input-textbox'));
    login.appendChild(document.createElement('br'));
    login.appendChild(submitButton('loginPopup', 'input-textbox' ));

    return login;
};

// all textboxes
// text holds placeholder text
var textField = function(text, classname) {
    var textBox = document.createElement('input');
    textBox.type = 'text';
    textBox.placeholder = text;
    textBox.className = classname;
    return textBox;
};

// container is the container div
var submitButton = function(container, classname) {
    var submit = document.createElement('button');
    submit.type = 'button';
    submit.innerHTML = 'Submit';
    submit.onclick = function() {
        var list = [];
        var jsonlist;
        $("." + classname).each(function() {
            //console.log($(this).val());
            list.push($(this).val());
        });
        //console.log(list);
        jsonlist = {'name': list[0], 'password': list[1], 'email': list[2], 'number': list[3] };
        //console.log(jsonlist);
        /*############# SEND AJAX REQUEST HERE ##############*/
        $('#loginPopup').delay(800).fadeOut(400, function() { $('#loginPopup').remove(); });
        $('#content').delay(800).fadeOut(400);
    };
    return submit;
};

/*
var textLabel = function(content) {
    var textCont = document.createElement('div');
    textCont.innerHTML=content;
    return textCont;
};
*/

// habitlist wrapper field
var HabitList = function(container) {
    var habits = document.createElement('div');
    habits.id='habitsPopup';
    return habits;
};

// essentially the main method; it runs everything
$(document).ready(function() {
    var popCont = document.getElementById('popup-container');
    popCont.appendChild(LoginPopup(popCont));
    var content = document.getElementById('content');
    content.style.display='none';
    content.style.background='rgba(0, 0, 0, 0.5)';
    $('#content').delay(800).fadeIn(400);
    $('.hidden-popup').delay(800).fadeIn(400);
});
