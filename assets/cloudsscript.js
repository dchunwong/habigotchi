canvas = document.getElementById("canvas");
canvasmid = document.getElementById("canvas1");
canvasback = document.getElementById("canvas2");
canvas.height = window.innerheight;
canvas.width = window.innerWidth;
canvasmid.height = window.innerHeight;
canvasmid.width = window.innerWidth;
canvasback.height = window.innerHeight;
canvasback.width = window.innerWidth;

ctx = canvas.getContext("2d");
ctxMid = canvasmid.getContext("2d");
ctxBack = canvasback.getContext("2d");
ctx.strokeStyle = "#EAEDD5";
var game, updateInterval, squares;
const 
      directions = {38: "N", 40: "S", 39: "E", 37: "W"},
      /*spdfct = 10;*/
	  spdfct = 0.9;
var direction = "E";

/*var cloud0 = new Image();
cloud0.src = "assets/cloud0.png";

var cloud1 = new Image();
cloud1.src = "assets/cloud1.png";

var cloud2 = new Image();
cloud2.src = "assets/cloud2.png";

var cloud3 = new Image();
cloud3.src = "assets/cloud3.png";*/


var cloud0fore = new Image();
cloud0fore.src = "assets/cloud0-fore.png";

var cloud1fore = new Image();
cloud1fore.src = "assets/cloud1-fore.png";

var cloud2fore = new Image();
cloud2fore.src = "assets/cloud2-fore.png";

var cloud3fore = new Image();
cloud3fore.src = "assets/cloud3-fore.png";

var cloud0mid = new Image();
cloud0mid.src = "assets/cloud0-mid.png";

var cloud1mid = new Image();
cloud1mid.src = "assets/cloud1-mid.png";

var cloud2mid = new Image();
cloud2mid.src = "assets/cloud2-mid.png";

var cloud3mid = new Image();
cloud3mid.src = "assets/cloud3-mid.png";

var cloud0back = new Image();
cloud0back.src = "assets/cloud0-back.png";

var cloud1back = new Image();
cloud1back.src = "assets/cloud1-back.png";

var cloud2back = new Image();
cloud2back.src = "assets/cloud2-back.png";

var cloud3back = new Image();
cloud3back.src = "assets/cloud3-back.png";


var cloudsListFore = [cloud0fore, cloud1fore, cloud2fore, cloud3fore];
var cloudsListMid = [cloud0mid, cloud1mid, cloud2mid, cloud3mid];
var cloudsListBack = [cloud0back, cloud1back, cloud2back, cloud3back];

/*var cloudsList = [cloud0, cloud1, cloud2, cloud3];*/


/* min and max inclusive */
function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
	
}

function cloud(height, x, y, speed) {
	var randInt = getRandomInt(0,3);
	this.image = cloudsListFore[randInt];
	this.height = height;
	if(!x){
        this.x = Math.round(Math.random()*canvas.width)
    }else{
        this.x = x;
    }
    if(!y){
        this.y = Math.round(Math.random()*canvas.height)
    }else{
        this.y = y;
    }
    if(!speed){
        this.speed = Math.round(Math.random()*spdfct+1)
    }else{
        this.speed = speed;
    }
	this.move = function() {
		this.x += this.speed;
	}
}

function cloudMid(height, x, y, speed) {
	var randInt = getRandomInt(0,3);
	this.image = cloudsListMid[randInt];
	this.height = height;
	if(!x){
        this.x = Math.round(Math.random()*canvas.width)
    }else{
        this.x = x;
    }
    if(!y){
        this.y = Math.round(Math.random()*canvas.height)
    }else{
        this.y = y;
    }
    if(!speed){
        this.speed = Math.round(Math.random()*spdfct+1)
    }else{
        this.speed = speed;
    }
	this.move = function() {
		this.x += this.speed;
	}
}

function cloudBack(height, x, y, speed) {
	var randInt = getRandomInt(0,3);
	this.image = cloudsListBack[randInt];
	this.height = height;
	if(!x){
        this.x = Math.round(Math.random()*canvas.width)
    }else{
        this.x = x;
    }
    if(!y){
        this.y = Math.round(Math.random()*canvas.height)
    }else{
        this.y = y;
    }
    if(!speed){
        this.speed = Math.round(Math.random()*spdfct+1)
    }else{
        this.speed = speed;
    }
	this.move = function() {
		this.x += this.speed;
	}
}


function Game(){
    console.log("Game made!");
    this.clouds = [];
	this.cloudsMid = [];
	this.cloudsBack = [];
    this.addCloudFore = function(h, x, y, s){
        this.clouds.push(new cloud(h, x, y, s));
    };
    this.addCloudMid = function(h, x, y, s){
        this.cloudsMid.push(new cloudMid(h, x, y, s));
    };
    this.addCloudBack = function(h, x, y, s){
        this.cloudsBack.push(new cloudBack(h, x, y, s));
    };

    this.update = function(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for(var i = 0; i < this.clouds.length; i++){
            curr = this.clouds[i];
            ctx.drawImage(curr.image, curr.x, curr.y);
		}
        ctxMid.clearRect(0, 0, canvasmid.width, canvasmid.height);
        for(var i = 0; i < this.cloudsMid.length; i++){
            curr = this.cloudsMid[i];
            ctxMid.drawImage(curr.image, curr.x, curr.y);
		}
        ctxBack.clearRect(0, 0, canvasback.width, canvasback.height);
        for(var i = 0; i < this.cloudsBack.length; i++){
            curr = this.cloudsBack[i];
            ctxBack.drawImage(curr.image, curr.x, curr.y);
        }
    };
   this.move = function(direction){
        for(var j = 0; j < this.clouds.length; j++){
            this.clouds[j].move(direction);
            if(this.clouds[j].x > canvas.width){
                this.clouds.splice(this.clouds.indexOf(this.clouds[j]), 1);
                continue;
            }
        }
        for(var j = 0; j < this.cloudsMid.length; j++){
            this.cloudsMid[j].move(direction);
            if(this.cloudsMid[j].x > canvasmid.width){
                this.cloudsMid.splice(this.cloudsMid.indexOf(this.cloudsMid[j]), 1);
                continue;
            }
        }
        for(var j = 0; j < this.cloudsBack.length; j++){
            this.cloudsBack[j].move(direction);
            if(this.cloudsBack[j].x > canvasback.width){
                this.cloudsBack.splice(this.cloudsBack.indexOf(this.cloudsBack[j]), 1);
                continue;
            }
        }


    }
}
function sideCalc(s){
    return 20*s/spdfct
}

game = new Game();

function animate(){
    game.move();
    game.update();
    requestAnimationFrame(animate);
}

function cloudGen(){
    s = Math.round(Math.random()*spdfct+1);
    side = sideCalc(s);
    game.addCloudFore(side, -500, undefined, s);
    setTimeout(cloudGen, 3000);
}

function cloudGenMid(){
    s = Math.round(Math.random()*spdfct+1);
    side = sideCalc(s);
    game.addCloudMid(side, -400, undefined, s);
    setTimeout(cloudGenMid, 2500);
}

function cloudGenBack(){
    s = Math.round(Math.random()*spdfct+1);
    side = sideCalc(s);
    game.addCloudBack(side, -200, undefined, s);
    setTimeout(cloudGenBack, 2000);
}



window.onresize = function(){
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    canvasmid.height = window.innerHeight;
    canvasmid.width = window.innerWidth;
    canvasback.height = window.innerHeight;
    canvasback.width = window.innerWidth;

    if(game){
        ctx.strokeStyle = "#EAEDD5";
        ctxMid.strokeStyle = "#EAEDD5";
        ctxBack.strokeStyle = "#EAEDD5";

        game.update();
    }
}

var isActive;

window.onfocus = function() {
	isActive = true;
}

window.onblue = function(){
	isActive = false;
}

setInterval(function () {
	console.log(window.isActive ? 'active' : 'inactive')}, 1000);

animate();
cloudGen();
cloudGenMid();
cloudGenBack();
