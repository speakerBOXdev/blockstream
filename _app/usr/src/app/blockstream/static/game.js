var gameInstance = null;


var keyleft = 37;
var keyup = 38;
var keyright = 39; 
var keydown = 40;


function start() {

    var wrapper = document.getElementById('gamewrapper');
    wrapper.className = "gameWrapper";
    if (!wrapper) throw "Could not find 'gamewrapper'";
    
    createHud(wrapper);

    var canvas = document.createElement("CANVAS");
    wrapper.appendChild(canvas);
    
    canvas.width = 900;
    canvas.height = 600;

    gameInstance = new game(canvas);
    gameInstance.start();
    
    document.body.addEventListener('keydown', keylistener);
    document.body.addEventListener('keyup', keyuplistener);
    
}

function createHud(container) {
    if (!container) throw "createHud was called with undefined 'container'.";

    var hudWrapper = createDiv(container);
    hudWrapper.className = "hud";

    var scoreWrapper = createDiv(hudWrapper, "", "scoreWrapper");
    createSpan(scoreWrapper, "Score", "scoreLabel", "label");
    createSpan(scoreWrapper, "0", "score", "value"); 
    
    var levelWrapper = createDiv(hudWrapper, "", "levelWrapper");
    createSpan(levelWrapper, "Level", "levelLabel", "label");
    createSpan(levelWrapper, "1", "level", "value");

    var skinWrapper = createDiv(hudWrapper, "", "skinWrapper");
    createSpan(skinWrapper, "Skin", "skinLabel", "label");
    var skin = document.createElement("SELECT");
    skin.id = "skin";

    var keys = Object.keys(skins);

    for (var i = 0; i < keys.length; i++) {
        var option = document.createElement("OPTION");
        option.value = keys[i];
        option.text = keys[i];
        skin.add(option);
    }
    skin.onchange = function () { gameInstance.updateSkin(this.selectedOptions[0].value); };
    skinWrapper.appendChild(skin);
    //var levelDiv = createDiv(hudWrapper, "levelWrapper");

    //hudWrapper.innerHTML = "<div id='scoreWrapper'><span class='label'>score</span><span id='score' class='value'>0</span></div>";
    //hudWrapper.innerHTML += "<div id='levelWrapper'><span class='label'>level</span><span id='level' class='value'>1</span></div>";
    //hudWrapper.innerHTML += "<div id='skinWrapper'><span class='label'>skin</span><select id='skin'></select></div>"
    
}

function createDiv(parent, innerHTML, id, cls) {
    var div = document.createElement("DIV");
    if (innerHTML) div.innerHTML = innerHTML;
    if (id) div.id = id;
    if (cls) div.className = cls;
    parent.appendChild(div);
    return div;
}

function createSpan(parent, innerHTML, id, cls) {
    var obj = document.createElement("SPAN");
    if (innerHTML) obj.innerHTML = innerHTML;
    if (id) obj.id = id;
    if (cls) obj.className = cls;
    parent.appendChild(obj);
    return obj;
}
function reset() {
    var canvas = document.getElementsByTagName("canvas")[0];
    
    if (gameInstance && gameInstance.interval) {
        gameInstance.clear();
        gameInstance.pause();
    } 
    gameInstance = new game(canvas);
    gameInstance.start();
}

function keylistener(e) {
    var esc = 27;
    var space = 32;

    if (e.keyCode == esc) gameInstance.pause();
    if (e.keyCode == space) reset();
    gameInstance.update(e.keyCode, 'down');    
}

function keyuplistener(e) {
    
    gameInstance.update(e.keyCode, 'up');
}

function game(canvas, xLowerBound, yLowerBound, xUpperBound, yUpperBound) {

    if (!canvas || !canvas.getContext || !canvas.height || !canvas.width) throw "No canvas provided.";

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.xLowerBound = xLowerBound || 0;
    this.yLowerBound = yLowerBound || 0;
    this.xUpperBound = xUpperBound || this.canvas.width;
    this.yUpperBound = yUpperBound || this.canvas.height;

    this.availableWidth = this.xUpperBound - this.xLowerBound;
	this.availableHeight = this.yUpperBound - this.yLowerBound;
    
    this.xCenter = this.xLowerBound + (this.availableWidth / 2),
	this.yCenter = this.yLowerBound + (this.availableHeight / 2);

    this.player = null;
    this.items = [];
    this.obstacles = [];
    this.stars = [];

    this.newPairRate = 60;
    this.minGap = 75;
    this.maxGap = 200;
    this.newPairSpeed = -1;

    this.intervalSpeed = 30;

    this.frameNo = 0;
    this.score = 0;
    this.level = 1;
    this.wait = 0;
    this.availableColors = ["reg", "orange", "yellow", "green", "blue", "purple", "pink", "white", "grey", "silver"];
    this.obstaclesPerLevel = 10;


    this.run = function() {
        me.frameNo++;
        me.drawCanvas();
        me.move();
        me.addObstacle();
    }

    this.updateSkin = function(skinName) {
        if (!skinName) throw "skinName was undefined.";
        this.player.skin = skinName;
    }

    this.addObstacle = function() {
        me = this;
        if (me.wait == 0) {
            if (me.frameNo % (me.newPairRate / me.level) == 0) {
                me.createNewObstacle();
            }
        } else {
            if (me.obstacles.length == 0)
                me.wait--;
            if (me.wait == 0) {
                me.level++;
            }
        }
        

        if (me.obstaclesThisLevel >= me.obstaclesPerLevel) {
            me.obstaclesPerLevel += 5;
            me.obstaclesThisLevel = 0;
//            me.minGap -=5;
//            me.maxGap -=5;
            me.newPairSpeed -= 2;
            //if (me.newPairRate < 15) me.newPairRate += 15;
            
            me.score += 50;
            me.wait = 50;
        }
    }

    this.drawCanvas = function() {

        this.drawBackground();

        // Background Items
        for (var o = 0; o < this.items.length; o++) {
            this.items[o].draw();
        }

        // Player
        this.player.draw();

        var scoreContainer = document.getElementById('score');
        if (scoreContainer && scoreContainer.innerHTML) {
            scoreContainer.innerHTML = this.score;
        }

        var levelContainer = document.getElementById('level');
        if (levelContainer && levelContainer.innerHTML) {
            levelContainer.innerHTML = this.level;
        }

        //this.drawForground();
    }

    this.drawBackground = function() {

        // Dark background
        this.ctx.fillStyle = "rgba(0,0,0,1)"
        this.ctx.fillRect(this.xLowerBound, this.yLowerBound, this.xUpperBound, this.yUpperBound);

        for (var i = 0; i < this.stars.length; i++) {
            var s = this.stars[i];
            
            var alpha = s.r * .2,
            color = "rgba(255,255,255," + alpha + ")";

            this.drawCircle(s.x, s.y, s.r, color);
        }

        var x = this.xCenter, 
        radius = 700,
        y = this.yUpperBound + (radius * .9);
    
        this.drawCircle(x, y, radius, "blue", 5, "lightblue")

    }

    this.drawCircle = function(x,y,radius, fillColor, lineWidth, lineColor) {

        this.ctx.beginPath();
        var startAngle = 0, endAngle = 2 * Math.PI, counterClockwise = false;
        this.ctx.arc(x,y,radius,startAngle, endAngle, counterClockwise);

        if (lineWidth && lineColor) {
            this.ctx.lineWidth = lineWidth;
            this.ctx.strokeStyle = lineColor;
            this.ctx.stroke();
        }

        this.ctx.fillStyle = fillColor;
        this.ctx.fill();
    }

    this.drawForground = function() {
        this.ctx.fillStyle = "rgba(200,200,200,200.1)"
        this.ctx.fillRect(0,0,canvas.width, 10);
    }

    this.move = function() {

        this.player.move();

        var newItems = [];
        for (var o = 0; o < this.items.length; o++) {
            this.items[o].move();
            if (this.player.detectCollision(this.items[o])) {
                
                this.pause("Score was " + this.score);
                this.drawCanvas();
                this.player = null;
                this.sendScore();
                break;
            }
            if (this.items[o].x > 0) {
                newItems.push(this.items[o]);
            } else {
                this.score += 10;
            }
        }
        this.items = newItems;
    }

    this.sendScore = function() {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/game/scores", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            val: this.score
        }));
    }

    this.update = function(keyCode, direction) {
        if (!this.interval) return;

        if (keyCode == keyup || keyCode == keydown)
            this.player.update(keyCode, direction);
    }

    this.start = function() {

        var width = 35;
        var playerX = (this.canvas.width /4) - (width /2),
            playerY = (this.canvas.height/2) - (width /2);
        this.player = new component(this.ctx, playerX, playerY, width, width);
        this.player.gravity = .05;
        this.player.skin = "none";
        this.player.yLowerBound = this.yLowerBound;
        this.player.xLowerBound = this.xLowerBound;
        this.player.xUpperBound = this.xUpperBound;
        this.player.yUpperBound = this.yUpperBound;

        // Stars
        for (var i = 0; i < 20; i++) {
            this.stars.push(
                { 
                    x : getRandom(this.xLowerBound, this.xUpperBound), 
                    y : getRandom(this.yLowerBound, this.yUpperBound),
                    r : getRandom(1,5),
                }
            );
        }

        this.drawBackground();
        
        this.obstaclesThisLevel = 0;
        this.createNewObstacle();

        this.pause();
    }

    this.createNewObstacle = function() {

        var itemWidth = getRandom(50, 100);
        var itemHeight = getRandom(15, 45);

        var itemX = this.canvas.width - itemWidth;
        var itemY = getRandom(45, this.canvas.height);

        var item = new component(this.ctx, itemX, itemY, itemWidth, itemHeight);
        
        var x = getRandom(2, 10);
        x -= this.newPairSpeed;

        item.speedX = -x;

        var r = getRandom(50, 255);
        var g = getRandom(50, 255);
        var b = getRandom(50, 255);
        var a = 1;

        item.color = "rgba(" + r + "," + g + "," + b + "," + a + ")";

        item.bounceRate = 0;
        item.yLowerBound = 45;
        item.xLowerBound = 0;
        item.xUpperBound = this.canvas.width;
        item.yUpperBound = this.canvas.height;

        this.items.push(item);
        this.obstaclesThisLevel++;
    }

    this.createNewStar = function() {

        //var itemWidth = getRandom(50, 100);
        //var itemHeight = getRandom(15, 45);

        //var itemX = this.canvas.width - itemWidth;
        //var itemY = getRandom(45, this.canvas.height);

        var item = new component(this.ctx, itemX, itemY, itemWidth, itemHeight);
        
        var x = getRandom(2, 10);
        x -= this.newPairSpeed;

        item.speedX = -x;

        var r = getRandom(50, 255);
        var g = getRandom(50, 255);
        var b = getRandom(50, 255);
        var a = 1;

        item.color = "rgba(" + r + "," + g + "," + b + "," + a + ")";

        item.bounceRate = 0;
        item.yLowerBound = 45;
        item.xLowerBound = 0;
        item.xUpperBound = this.canvas.width;
        item.yUpperBound = this.canvas.height;

        this.items.push(item);
        this.obstaclesThisLevel++;
    }
    this.createNewObstaclePair = function() {
        
        var minGap = this.minGap,
            maxGap = this.maxGap,
            minHeight = 20,
            maxHeight = this.canvas.height - maxGap;

        var obstacleWidth = 10;
        var randomColorIndex = Math.floor(Math.random()*this.availableColors.length);
        var obstacleColor = this.availableColors[randomColorIndex];
        var obstacleSpeed = this.newPairSpeed;

        var obstacleX = this.canvas.width - obstacleWidth;
        var obstacleY = 45;
        
        var obstacleHeight = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);

        var obstacle = new component(this.ctx, obstacleX, obstacleY, obstacleWidth, obstacleHeight);
        obstacle.speedX = obstacleSpeed; 
        obstacle.color = obstacleColor;
        obstacle.bounceRate = 0;
        obstacle.yLowerBound = 45;
        obstacle.xLowerBound = 0;
        obstacle.xUpperBound = this.canvas.width;
        obstacle.yUpperBound = this.canvas.height;

        this.obstacles.push(obstacle);

        var gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);        
        obstacleY = obstacleY + obstacleHeight + gap;
        obstacleHeight = this.canvas.height - 45 - obstacleHeight - gap;

        var obstacle = new component(this.ctx, obstacleX, obstacleY, obstacleWidth, obstacleHeight);
        obstacle.speedX = obstacleSpeed;
        obstacle.bounceRate = 0;
        obstacle.color = obstacleColor;
        obstacle.yLowerBound = 45;
        obstacle.xLowerBound = 0;
        obstacle.xUpperBound = this.canvas.width;
        obstacle.yUpperBound = this.canvas.height;

        this.obstacles.push(obstacle);
        this.obstaclesThisLevel++;
    }

    this.clear = function() {
        this.ctx.clearRect(0, 45, this.canvas.width, this.canvas.height);
    }
    this.pause = function(message) {

        if (!message) message = "";
        me = this;
        if (me.interval) {
            console.info("Paused " + message);
            clearInterval(me.interval);
            me.interval = undefined;
        } else {
            console.info("Started " + message);
            me.interval = setInterval(me.run, me.intervalSpeed);

            if (!me.player) reset();
        }
    }
    this.updateInterval = function(keyCode) {
        
        if (keyCode == keyright) {
            this.intervalSpeed--;
        } else if (keyCode == keyleft) {
            this.intervalSpeed++;
        }
        
        if (this.intervalSpeed <= 0) this.intervalSpeed = 1;
        if (this.intervalSpeed > 100) this.intervalSpeed = 100;

        if (this.interval) {
            this.pause("Update Interval Start");
            this.pause("Update Interval Complete");
        }

    }
}

function getRandom(min, max) {
    return Math.floor(Math.random() * max + min);
}

start()