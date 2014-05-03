// main.js

// takes in the container div
// creates and puts the signup popup in container


var fadeOutTime = 400,
    fadeInTime = 400,
    delayTime = 100,
    popupObjectId,
    clickPanelId,
    popupContainerId;

var user;
var habits;

function sendRequest(type, url, data){
    return JSON.parse($.ajax({
                type: type,
                url: url,
                data: data,
                async: false,
                dataType: "json",
            }).responseText);
}

var SignupPopup = function(container) {
    var signup = document.createElement('div');
    signup.id='signup-popup';
    signup.className='popup-object';

    signup.appendChild(textField('Username', 'input-textbox'));
    signup.appendChild(document.createElement('br'));
    signup.appendChild(textField('Password', 'input-textbox'));
    signup.appendChild(document.createElement('br'));
    signup.appendChild(textField('Email', 'input-textbox'));
    signup.appendChild(document.createElement('br'));
    signup.appendChild(textField('Mobile Number', 'input-textbox'));
    signup.appendChild(document.createElement('br'));
    signup.appendChild(submitButton(signup.id, 'input-textbox' ));

    return signup;
};

/*
function login(name, password){
    response = sendRequest('POST','/login',{"name":name,"password":password});
    if (response.success == true){
        user = response.user;
        habits = response.habits;
    }
}
*/
function login(name, password) {
    //console.log("loggin in");
    //console.log(document.getElementByName("username")[0].value);
    //$("input[name='login-button']").click(function() {
    /*
    $("." + classname).each(function() {
        //console.log($(this).val());
        list.push($(this).val());
    });
    */
    //console.log(list);
    //jsonlist = {"name": list[0], "password": list[1], "email": list[2], "number": list[3] };
    //console.log("name: " + name + ", pass: " + password);
    if (name == "" || password == "") {
        console.log("invalid input");
        return;
    }
    return $.post('/login', {"name":name,"password":password}).then(function(response) {
        //console.log("promises made");
        if (response.success) {
            //console.log("login successful!");
            user = response.user;
            habits = response.habits;
        }
    });
}

// all textboxes
// @text holds placeholder text
// @classname is the class name assigned to each box
var textField = function(text, classname) {
    var textBox = document.createElement('input');
    textBox.type = 'text';
    textBox.placeholder = text;
    textBox.className = classname;
    return textBox;
};

// container is the container div id
// classname is the class of the boxes that will be searched for
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
        jsonlist = {"name": list[0], "password": list[1], "email": list[2], "number": list[3] };
        //console.log(jsonlist);
        /*############# SEND AJAX REQUEST HERE to give dylan data ##############*/
        
        var jsonResponse = sendRequest("POST", "/", jsonlist);
        console.log(jsonResponse)
        if (jsonResponse.success == true) {
            //killPopup('invis-click-panel', container);
            hidePopup(popupObjectId, clickPanelId, popupContainerId);
        }
        $("." + classname).each(function() {
            $(this).val('');
        });
        /*
        $('#'+container).delay(800).fadeOut(400, function() { $('#'+container).remove(); });
        $('#content').delay(800).fadeOut(400);
        */
    };
    return submit;
};

// habitlist wrapper field
var HabitListPopup = function(container, habitList) {
    var habits = document.createElement('div');
    habits.id='habitsPopup';
    habits.className='hidden-popup';

    /*
    signup.appendChild(textField('Mobile Number', 'input-textbox'));
    signup.appendChild(document.createElement('br'));
    signup.appendChild(submitButton('signupPopup', 'input-textbox' ));
    */
    
    habitList.forEach(function(elem) {
        //console.log('hiberfore');
        habits.appendChild(habitEntry(elem));
        //console.log('hiafter');
    });
    habits.appendChild(newHabit(habits.id));

    return habits;
};

// entryData is an object that contains an entire entry
var habitEntry = function(entryData) {
    var divWrap = document.createElement('div');
    var butWrap = document.createElement('span');
    var checkBut = document.createElement('input');
    var header = document.createElement('div');
    var descrip = document.createElement('div');
    checkBut.type="checkbox";
    butWrap.className="check-button-wrap";
    divWrap.className="habit-entry-wrap";
    //console.log(entryData);
    header.innerHTML=entryData['habit']+"-"+entryData['rank']+"-"+entryData['deadline'];
    descrip.innerHTML=entryData['description'];

    butWrap.appendChild(checkBut);
    divWrap.appendChild(butWrap);
    divWrap.appendChild(header);
    divWrap.appendChild(descrip);

    return divWrap;
};

// where you would enter in a new habit to add to the list
// takes in the master habit list, to add new habits to
var newHabit = function(habitsId) {
    var newHab = document.createElement('div');

    newHab.appendChild(textField('Habit', 'input-habit-field'));
    newHab.appendChild(textField('Rank (1-5)', 'input-habit-field'));
    newHab.appendChild(textField('Freq (D or W)', 'input-habit-field'));
    newHab.appendChild(textField('Description', 'input-habit-field'));
    newHab.appendChild(textField('Deadline', 'input-habit-field'));
    newHab.appendChild(submitHabit(habitsId, 'input-habit-field', newHab));


    /*######## SEND AJAX to add to database #######*/

    return newHab;
};

// submit button for new habit
// container id
// classname is the class to target
var submitHabit= function(container, classname, lastElem) {
    var submit = document.createElement('button');

    /*######## SUPER DUMMY VARIABLE USER used in jsonlist ##########*/
    var user = {'name': 'bob'};


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
        jsonlist = {'habit': list[0]
                , 'rank': list[1]
                , 'freq': list[2]
                , 'description': list[3]
                , 'deadline': list[4]
                , 'name': user.name
        };

        var TrialHabitEntry = habitEntry(jsonlist);
        document.getElementById(container).insertBefore(TrialHabitEntry, lastElem);
        //console.log(jsonlist);
        /*############# SEND AJAX REQUEST HERE to give dylan data ##############*/
        
        var jsonResponse = sendRequest("POST", "/new_habit", jsonlist);
        //console.log(jsonResponse)
        if (jsonResponse.success == true) {
            $("." + classname).each(function() {
                //console.log($(this).val());
                $(this).val('');
            });
        } else {
            $('.habit-entry-wrap').remove();
        }
        
    };
    return submit;
};

var hidePopup = function(popupObjectId, clickPanelId, popupContainerId) {
    //$('#'+popupObjectId).delay(800).fadeOut(400, function() { $('#'+popupObjectId).empty(); });
    //console.log( $('#'+popupObjectId));
    //$('#'+popupObjectId).delay(800).fadeOut(400);
    //console.log("click-panel clicked");
    $('#'+clickPanelId).delay(delayTime).fadeOut(fadeOutTime);
    $('#'+popupObjectId).delay(delayTime).fadeOut(fadeOutTime);
    $('#'+popupContainerId).delay(delayTime).fadeOut(fadeOutTime);
};

// essentially the main method for THE LOGIN POPUP; it runs everything.
// when you need to bind all this into a button, just rip this function
// out of the $().ready and bind it to a button or something.
/*
$(document).ready(function() {
    var popCont = document.getElementById('popup-container');
    popCont.appendChild(LoginPopup(popCont));
    var content = document.getElementById('content');
    var killerInvis = document.createElement('div');
    content.appendChild(killerInvis);
    killerInvis.id = 'invis-click-panel';
    killerInvis.onclick = function() { killPopup(content.id, popCont.id); };
    //content.style.display='none';
    //content.style.background='rgba(0, 0, 0, 0.5)';
    $('#invis-click-panel').delay(800).fadeIn(400);
    $('.hidden-popup').delay(800).fadeIn(400);
});
*/

// essentially the main method for THE HABITLIST POPUP; it runs everything.
// when you need to bind all this into a button, just rip this function
// out of the $().ready and bind it to a button or something.
/*$(document).ready(function() {
    console.log("fucking work please");
    var popCont = document.getElementById('popup-container');

    // GET HABITLIST (LIST OF OBJECTS) 

    //var habitList = [{"habit": "eat", "name": "bob"}, {"habit": "sleep", "name": "jim"}];
    var habits = [{"habit": "eat", "name": "bob"}, {"habit": "sleep", "name": "jim"}];
    var content = document.getElementById('content');
    var killerInvis = document.createElement('div');
    content.appendChild(killerInvis);
    popCont.appendChild(HabitListPopup(popCont, habits));
    //content.appendChild(killerInvis);
    killerInvis.id = 'invis-click-panel';
    //killerInvis.style.display='none';
    //killerInvis.style.background='rgba(0, 0, 0, 0.5)';
    killerInvis.onclick = function() { killPopup(content.id, popCont.id); };
    //$('#content').delay(800).fadeIn(400);
    $('#invis-click-panel').delay(800).fadeIn(400);
    $('.hidden-popup').delay(800).fadeIn(400);
});*/

/*$("input[name='register-button']").click(function() {*/

/*$("#logo-container").click(function() {

    var popCont = document.getElementById('popup-container');
    console.log("meowmeow");

    // GET HABITLIST (LIST OF OBJECTS) 

    //var habitList = [{"habit": "eat", "name": "bob"}, {"habit": "sleep", "name": "jim"}];
    var habits = [{"habit": "eat", "name": "bob"}, {"habit": "sleep", "name": "jim"}];
    var content = document.getElementById('content');
    var killerInvis = document.createElement('div');
    content.appendChild(killerInvis);
    popCont.appendChild(HabitListPopup(popCont, habits));
    //content.appendChild(killerInvis);
    killerInvis.id = 'invis-click-panel';
    //killerInvis.style.display='none';
    //killerInvis.style.background='rgba(0, 0, 0, 0.5)';
    killerInvis.onclick = function() { killPopup(content.id, popCont.id); };
    //$('#content').delay(800).fadeIn(400);
    $('#invis-click-panel').delay(800).fadeIn(400);
    $('.hidden-popup').delay(800).fadeIn(400);
});*/

$(document).ready( function() {
    var popCont = document.getElementById('popup-container');
    var signupPopupObject = SignupPopup(popCont);
    popCont.appendChild(signupPopupObject);
    //var container = document.getElementById('modal-container');
    var clickPanel = document.getElementById('click-panel');
    popupObjectId = signupPopupObject.id;
    clickPanelId = clickPanel.id;
    popupContainerId = 'popup-container';
    //console.log(clickPanel);
    //console.log(popCont);
    clickPanel.onclick = function() { hidePopup(popupObjectId, clickPanelId, popupContainerId); };
    $("#login").submit(function(e) {
        //alert('here');
        e.preventDefault();
        var username = $("input[name='username']").val(),
            password = $("input[name='password']").val();
        login(username, password);
        return false;
    });
    //content.style.display='none';
    //content.style.background='rgba(0, 0, 0, 0.5)';
    $("input[name='register-button']").click(function() {
        //console.log('sign up button clicked!');
        //console.log($('#signup-popup').attr('id'));
        //document.getElementById("signup-popup").style.display="block";
        $('#click-panel').delay(delayTime).fadeIn(fadeInTime);
        $('#popup-container').delay(delayTime).fadeIn(fadeInTime);
        $('#signup-popup').delay(delayTime).fadeIn(fadeInTime);
        //$('#signup-popup').delay(800).fadeIn(400);
    });
});

