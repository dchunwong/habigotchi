// main.js

// takes in the container div
// creates and puts the signup popup in container


var fadeOutTime = 400,
    fadeInTime = 400,
    delayTime = 100,
    popupObjectId,
    clickPanelId,
    popupContainerId,
    habitsContainerId,
    addHabitButtonId,
    checkDeleteHabitContainerId;

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
            PopulateHabitList(document.getElementById(habitsContainerId), habits);
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
//function PopulateHabitList(container, habitList) 
function PopulateHabitList(habitsListContainer, habitList) {
    //var habits = document.createElement('div');
    //habits.id='habitsPopup';
    //habits.className='hidden-popup';

    /*
    signup.appendChild(textField('Mobile Number', 'input-textbox'));
    signup.appendChild(document.createElement('br'));
    signup.appendChild(submitButton('signupPopup', 'input-textbox' ));
    */
    
    /* ################ BEGIN FILLER TESTCODE ################ */
    habitList = [{"habit": "eat", "name": "bob"}, {"habit": "sleep", "name": "jim"}, {"habit": "walk", "name": "tim"}, {"habit": "breathe", "name": "joe"}];
    // dont forget to also clear out the filler functioncall in the main!
    /* ################ END FILLER TESTCODE ################ */

    habitList.forEach(function(elem) {
        //console.log('hiberfore');
        habitsListContainer.appendChild(habitEntry(elem));
        //console.log('hiafter');
    });
    bindADCCheckboxAction();
    //habitsListContainer.appendChild(newHabit(habitsListContainer.id));

    //return habitsListContainer;
};

// entryData is an object that contains an entire entry
var habitEntry = function(entryData) {
    var divWrap = document.createElement('div');
    var butWrap = document.createElement('span');
    var checkCover = document.createElement('label');
    var checkBut = document.createElement('input');
    var header = document.createElement('div');
    var descrip = document.createElement('div');
    checkBut.type="checkbox";
    checkBut.className="list-item-checkbox";
    checkBut.setAttribute("name", "habit-check");
    checkCover.htmlFor = "toggle-1";
    checkCover.className="checkbox-cover";
    butWrap.className="check-button-wrap";
    divWrap.className="habit-entry-wrap";
    //console.log(entryData);
    header.innerHTML=entryData['habit']+"-"+entryData['rank']+"-"+entryData['deadline'];
    descrip.innerHTML=entryData['description'];
    //bindADCCheckboxAction();
    
    butWrap.appendChild(checkCover);
    butWrap.appendChild(checkBut);
    divWrap.appendChild(butWrap);
    divWrap.appendChild(header);
    divWrap.appendChild(descrip);

    return divWrap;
};

/**
 * binds action onto onclick for each checkbox
 * ADCCheckbox stands for Add/Delete/Check Checkbox
 * this fades in/out Add/(Delete,Check) depending on situation
 *
 */
function bindADCCheckboxAction() {
    $("input[name='habit-check']").click(function() {
        console.log("checked!");
        var checkboxes = document.getElementsByName('habit-check');
        var checked = false;
        for (var i = 0; i < checkboxes.length; i++) {
            if (checkboxes[i].checked) {
                checked = true;
            }
        }
        if (checked && document.getElementById(addHabitButtonId).style.display != "none") {
            // fadeout add, fadein div holding delete/check
            console.log('fadeout add, fadein div holding delete/check');
            $("#" + addHabitButtonId).fadeOut(fadeOutTime/2, function() {
                $("#" + checkDeleteHabitContainerId).fadeIn(fadeInTime/2);
            });
        } else if (!checked && document.getElementById(checkDeleteHabitContainerId).style.display != "none") {
            // fadein add, fadeout div holding delete/check
            console.log('fadein add, fadeout div holding delete/check');
            $("#" + checkDeleteHabitContainerId).fadeOut(fadeOutTime/2, function() {
                $("#" + addHabitButtonId).fadeIn(fadeInTime/2);
            });
        }
    });
};

// where you would enter in a new habit to add to the list
// takes in the master habit list, to add new habits to
var newHabitPopup = function(habitsId) {
    console.log("popuplating newhabit popup");
    var newHab = document.createElement('form');
    newHab.id = "new-habit-popup";

    newHab.appendChild(textField('Habit', 'input-habit-field'));
    newHab.appendChild(textField('Rank (1-5)', 'input-habit-field'));
    newHab.appendChild(textField('Freq (D or W)', 'input-habit-field'));
    newHab.appendChild(textField('Description', 'input-habit-field'));
    newHab.appendChild(textField('Deadline', 'input-habit-field'));
    //newHab.appendChild(submitHabit(habitsId, 'input-habit-field', newHab));
    newHab.appendChild(submitHabit(habitsId, 'input-habit-field'));


    /*######## SEND AJAX to add to database #######*/

    return newHab;
};

// submit button for new habit
// container id
// classname is the class to target
var submitHabit = function(containerId, classname) {
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

        var trialHabitEntry = habitEntry(jsonlist);
        //document.getElementById(containerId).insertBefore(TrialHabitEntry, lastElem);
        document.getElementById(containerId).appendChild(trialHabitEntry);
        //console.log(jsonlist);
        /*############# SEND AJAX REQUEST HERE to give dylan data ##############*/
        
        sendNewHabit(jsonlist, classname, function() {
            document.getElementById(containerId).removeChild(trialHabitEntry);
        });
        /*
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
        */
        
    };
    return submit;
};

function sendNewHabit(jsonlist, fieldclassname, removeTrialEntry) {
    return $.post('/new_habit', jsonlist).then(function(response) {
        //console.log("promise made!");
        if (response.success) {
            $("." + fieldclassname).each(function() {
                //console.log($(this).val());
                $(this).val('');
                bindADCCheckboxAction();
            });
        } else {
            console.log("invalid habit form! removing!");
            removeTrialEntry();
            //$('.habit-entry-wrap').remove();
        }
    });
};

function sendHabitRemoval() {
    return $.post('/remove_habit', notsurewhattosendhere).then(function(response) {
        if (response.success) {
            console.log("habit delete success!");
            var checkboxes = document.getElementsByName('habit-check');
            for (var i = checkboxes.length - 1; i >= 0; i--) {
                if (checkboxes[i].checked) {
                    console.log(checkboxes[i]);
                    document.getElementById(habitsContainerId).removeChild(checkboxes[i].parentNode.parentNode);
                }
            }
        } else {
            console.log("habit delete failed!");
        }
    });
};

function sendHabitCompletion() {
    return $.post('/finish_habit', notsurewhatotsendhere).then(function(response) {
        if (response.success) {
            console.log("habit completion success!");
            var checkboxes = document.getElementsByName('habit-check');
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    // Do something to finished habits here!
                }
            }
        } else {
            console.log("habit completion failed!");
        }
    });
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


$(document).ready( function() {
    var popCont = document.getElementById('popup-container');
    var signupPopupObject = SignupPopup(popCont);
    var newHabitPopupObject = newHabitPopup('habit-list');
    popCont.appendChild(signupPopupObject);
    popCont.appendChild(newHabitPopupObject);
    //var container = document.getElementById('modal-container');
    var clickPanel = document.getElementById('click-panel');
    popupObjectId = signupPopupObject.id;
    clickPanelId = clickPanel.id;
    popupContainerId = 'popup-container';
    habitsContainerId = 'habit-list';
    addHabitButtonId = 'habit-add-task-button';
    checkDeleteHabitContainerId = 'habit-check-delete-container';
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

    $("#habit-add-task-button").click(function () {
        $('#click-panel').delay(delayTime).fadeIn(fadeInTime);
        $('#popup-container').delay(delayTime).fadeIn(fadeInTime);
        $('#new-habit-popup').delay(delayTime).fadeIn(fadeInTime);
    });

    $("#habit-delete-task-button").click(function() {
        sendHabitRemoval();
    });
    $("#habit-check-task-button").click(function() {
        sendHabitCompletion();
    });

    /*############# BEGIN FILLER TESTCODE ##############*/
    PopulateHabitList(document.getElementById(habitsContainerId), habits);
    /*############# END FILLER TESTCODE ##############*/
});

