
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

    this.skin = '';

    this.draw = function() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x,this.y,this.width,this.height);
        if (this.skin && this.skin != '') {
            this.drawSkin(this.skin);
        }
    }

    this.move = function() {

        this.gravitySpeed += this.gravity;

        this.x += this.speedX;
        
        this.y += this.speedY + this.gravitySpeed;
        
        if (this.x < this.xLowerBound) {
            this.x = this.xLowerBound;
        } else if (this.x > (this.xUpperBound - this.width)) {
            this.x = this.xUpperBound - this.width;
        }

        if (this.y < this.yLowerBound) {
            this.y = this.yLowerBound;
            this.gravitySpeed = 0;
        } else if (this.y > (this.yUpperBound - this.width)) {
            this.y = this.yUpperBound - this.width;
            this.gravitySpeed = 0;
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


    this.drawSkin = function(skinName) {

        var skin = skins[skinName];

        if (skin) {
            this.ctx.fillStyle = skinColors[skinName];
            //this.ctx.fillStyle = "blue";

            var pixel = 5;
            for (var i = 0; i < skin.length; i++) {
                 this.ctx.fillRect(this.x + (skin[i].x * pixel), this.y + (skin[i].y * pixel), pixel, pixel);      
            }
            //console.info(skin);
        }
    }

}

var skinColors = {
    "smiley" : "white",
    "checker": "green",
    "none" : "red"
}

var skins = {
    "none" : [],
    "smiley" : [ { x : 1, y : 1 }, { x : 2, y : 1 }, { x : 4, y : 1 }, { x : 5, y : 1 }, { x : 3, y : 2 }, { x : 3, y : 3 }, { x : 1, y : 4 }, { x : 5, y : 4 }, { x : 4, y : 5 }, { x : 2, y : 5 }, { x : 3, y : 5 } ],
    "checker" : [ { x : 0, y : 0 }, { x : 0, y : 2 }, { x : 0, y : 2 }, { x : 0, y : 4 }, { x : 0, y : 6 }, { x : 1, y : 1 }, { x : 1, y : 3 }, { x : 1, y : 5 }, { x : 2, y : 0 }, { x : 2, y : 2 }, { x : 2, y : 2 }, { x : 2, y : 4 }, { x : 2, y : 6 },{ x : 3, y : 1 }, { x : 3, y : 3 }, { x : 1, y : 5 }, { x : 4, y : 0 }, { x : 4, y : 2 }, { x : 4, y : 2 }, { x : 4, y : 4 }, { x : 4, y : 6 },{ x : 5, y : 1 }, { x : 5, y : 3 }, { x : 5, y : 5 }, { x : 6, y : 0 }, { x : 6, y : 2 }, { x : 6, y : 2 }, { x : 6, y : 4 }, { x : 6, y : 6 } ],
    
};
