// main.js

// takes in the container div
// creates and puts the login popup in container



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

var LoginPopup = function(container) {
    var login = document.createElement('div');
    login.id='login-popup';
    login.className='popup-object';

    login.appendChild(textField('Username', 'input-textbox'));
    login.appendChild(document.createElement('br'));
    login.appendChild(textField('Password', 'input-textbox'));
    login.appendChild(document.createElement('br'));
    login.appendChild(textField('Email', 'input-textbox'));
    login.appendChild(document.createElement('br'));
    login.appendChild(textField('Mobile Number', 'input-textbox'));
    login.appendChild(document.createElement('br'));
    login.appendChild(submitButton(login.id, 'input-textbox' ));

    return login;
};

function login(name, password){
    response = sendRequest('POST','/login',{"name":name,"password":password});
    if (response.success){
        user = response.user;
        habits = response.habits;
    }
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
        //console.log(jsonResponse)
        if (jsonResponse.success == true) {
            killPopup('invis-click-panel', container);
        } else {
            $("." + classname).each(function() {
                $(this).val('');
            });
        }
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
    login.appendChild(textField('Mobile Number', 'input-textbox'));
    login.appendChild(document.createElement('br'));
    login.appendChild(submitButton('loginPopup', 'input-textbox' ));
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

var hidePopup = function(popupObjectId, clickPanelId) {
    //$('#'+popupObjectId).delay(800).fadeOut(400, function() { $('#'+popupObjectId).empty(); });
    //console.log( $('#'+popupObjectId));
    //$('#'+popupObjectId).delay(800).fadeOut(400);
    console.log("click-panel clicked");
    $('#'+clickPanelId).delay(800).fadeOut(400);
    $('#'+popupObjectId).delay(800).fadeOut(400);
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
    var loginPopupObject = LoginPopup(popCont);
    popCont.appendChild(loginPopupObject);
    //var container = document.getElementById('modal-container');
    var clickPanel = document.getElementById('click-panel');
    //console.log(clickPanel);
    //console.log(popCont);
    clickPanel.onclick = function() { hidePopup(loginPopupObject.id, clickPanel.id); };
    //content.style.display='none';
    //content.style.background='rgba(0, 0, 0, 0.5)';
    $("input[name='register-button']").click(function() {
        //console.log('sign up button clicked!');
        //console.log($('#login-popup').attr('id'));
        //document.getElementById("login-popup").style.display="block";
        $('#click-panel').delay(800).fadeIn(400);
        $('#login-popup').delay(800).fadeIn(400);
        //$('#login-popup').delay(800).fadeIn(400);
    });
});

