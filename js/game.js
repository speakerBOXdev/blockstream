var gameInstance = null;


var keyleft = 37;
var keyup = 38;
var keyright = 39; 
var keydown = 40;


function start() {
    var canvas = document.createElement("CANVAS");

    canvas.width = 1200;
    canvas.height = 600;

    gameInstance = new game(canvas);
    gameInstance.start();

    document.body.appendChild(canvas);
    document.body.addEventListener('keydown', keylistener);
    document.body.addEventListener('keyup', keyuplistener);
    
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

function component(context, x,y,width,height) {
    this.ctx = context;
    this.width = width;
    this.height = height;
    this.color = "rgb(200,0,0)";
    this.speedX = 0;
    this.speedY = 0;    

    this.maxSpeed = 8;
    this.minSpeed = -8;

    this.x = x;
    this.y = y;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.bounceRate = 0.8;

    this.xLowerBound = 0;
    this.yLowerBound = 0;
    this.xUpperBound = 0;
    this.yUpperBound = 0;

    this.draw = function() {

        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x,this.y,this.width,this.height);
    }

    this.move = function() {

        this.gravitySpeed += this.gravity;

        this.x += this.speedX;
        
        this.y += this.speedY + this.gravitySpeed;
        
        if (this.x < this.xLowerBound) {
            this.x = this.xLowerBound;
            //this.speedX = this.speedX * -this.bounceRate;
        } else if (this.x > (this.xUpperBound - this.width)) {
            this.x = this.xUpperBound - this.width;
            //this.speedX = this.speedX * -this.bounceRate;
        }

        if (this.y < this.yLowerBound) {
            this.y = this.yLowerBound;
          //  this.speedY = this.speedY * -this.bounceRate;
            
            this.gravitySpeed = 0;
        } else if (this.y > (this.yUpperBound - this.width)) {
            this.y = this.yUpperBound - this.width;
            this.gravitySpeed = 0;
            //this.speedY = this.speedY * -this.bounceRate;
        }
    }
    
    this.detectCollision = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }

    this.update = function(keyCode, direction) {
        if (direction == "down") this.gravity = -.2;
        if (direction == "up") this.gravity = .1;
    }
}

function background() {

}

function hud() {

}

function game(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.player = null;
    this.items = [];
    this.obstacles = [];
    this.background = null;

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

        if (me.wait == 0) {
            if (me.frameNo % (me.newPairRate / me.level) == 0) {
                //me.createNewObstaclePair();
                //for (var a = 0; a < me.level; a++) {
                    me.createNonObstacle();
                //}
                    
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

        // Background
        this.ctx.fillStyle = "rgba(0,0,0,1)"
        this.ctx.fillRect(0,45,canvas.width, canvas.height);

        // Background Items
        for (var o = 0; o < this.items.length; o++) {
            this.items[o].draw();
        }

        // Player
        this.player.draw();

        // Obstacles
        // for (var o = 0; o < this.obstacles.length; o++) {
        //     this.obstacles[o].draw();
        // }

        // Score
        this.ctx.fillStyle="rgb(100,100,100)";
        this.ctx.fillRect(88,8,90,33);

        this.ctx.fillRect(190, 8, 90, 33);

        //this.score = parseInt(this.frameNo * .03);

        this.ctx.fillStyle = "rgb(15,100,200)"
        this.ctx.font = "25px Arial";
        this.ctx.fillText(this.score, 90, 33);        

        this.ctx.fillText("LVL:" + this.level, 200,33);
    }

    this.drawHUD = function() {

        // Background
        this.ctx.fillStyle = "rgb(100,100,100)";
        this.ctx.fillRect(0,0,this.canvas.width, 45);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = "rgb(150,150,150)";
        this.ctx.strokeRect(2,2,this.canvas.width -4, 41);

        // Score
        this.score = parseInt(this.frameNo * .03);
        this.ctx.fillStyle = "rgb(15,100,200)"
        this.ctx.font = "25px Arial";
        this.ctx.fillText("Score:", 15, 33);
    }

    this.move = function() {

        this.player.move();

        // for (var o = 0; o < this.obstacles.length; o++) {
        //     this.obstacles[o].move();

        //     if (this.player.detectCollision(this.obstacles[o])) {
        //        this.player = null;
        //        this.pause("Score was " + this.score);
        //        break;
        //     }
        // }
        // if (this.obstacles.length > 0 && this.obstacles[0].x == 0) 
        // {
        //     this.obstacles.shift();
        //     this.obstacles.shift();
        // }

        var newItems = [];
        for (var o = 0; o < this.items.length; o++) {
            this.items[o].move();
            if (this.player.detectCollision(this.items[o])) {
                
                this.pause("Score was " + this.score);
                this.drawCanvas();
                this.player = null;
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

    this.update = function(keyCode, direction) {
        if (!this.interval) return;

        if (keyCode == keyup || keyCode == keydown)
            this.player.update(keyCode, direction);
        
        
        // if (keyCode == keyleft || keyCode == keyright) {
        //     this.updateInterval(keyCode);
        // //     for (var i = 0; i < this.obstacles.length; i++) {
        // //         this.obstacles[i].update(keyCode);
        // //     }
        // }
    }

    this.start = function() {

        var width = 15;
        var playerX = (this.canvas.width /4) - (width /2),
            playerY = (this.canvas.height/2) - (width /2);
        this.player = new component(this.ctx, playerX, playerY, width, width);
        this.player.gravity = .05;
        this.player.yLowerBound = 45;
        this.player.xLowerBound = 0;
        this.player.xUpperBound = this.canvas.width;
        this.player.yUpperBound = this.canvas.height;

        this.ctx.fillStyle = "rgb(0,0,0)";
        this.ctx.fillRect(0,0, this.canvas.width, this.canvas.height);

        this.obstaclesThisLevel = 0;
        //this.createNewObstaclePair();
        this.createNonObstacle();

        this.drawHUD();

        this.pause();
    }

    this.createNonObstacle = function() {

        var itemWidth = getRandom(50, 100);
        var itemHeight = getRandom(15, 45);

        var itemX = this.canvas.width - itemWidth;
        var itemY = getRandom(45, this.canvas.height);

        var item = new component(this.ctx, itemX, itemY, itemWidth, itemHeight);
        
        var x = getRandom(2, 10);
        x -= this.newPairSpeed;

        item.speedX = -x;//-( Math.floor(Math.random() * 5 + 5));

        var r = Math.floor(Math.random() * 255 + 50);
        var g = Math.floor(Math.random() * 255 + 50);
        var b = Math.floor(Math.random() * 255 + 50);
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