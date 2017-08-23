var __main = function () {
    var game = Game();
    var paddle = Paddle();
    var ball = Ball();

    game.registerAction(37, paddle.moveLeft.bind(paddle));
    game.registerAction(39, paddle.moveRight.bind(paddle));
    game.registerAction(40, ball.fire.bind(ball));

    game.update = function() {
        ball.move();

        var intRet = paddle.intersect(ball);
        // ball.speedX = int.x ?  ball.speedX *= -1 : ball.speedX;
        // ball.speedY = int.y ?  ball.speedY *= -1 : ball.speedY;

        if (intRet.isTouch) {
            // debugger;
            if (intRet.x) {
                log('touch x')
                ball.speedX *= -1;
            }
            if (intRet.y) {
                log('touch y')
                ball.speedY *= -1;
            }
        }
        
    }

    game.draw = function() {
        this.drawImg(paddle);
        this.drawImg(ball);
    }

}

__main();

function imgFromPath(path) {
    var img = new Image()
    img.src = path
    return img;
}

function Ball() {
    var image = imgFromPath('./img/ball.png')
    var o = {
        img: image, 
        x: 100,
        y: 200,
        speedY: 2,
        speedX: 2,
        fired: false,
        move() {
            if (this.fired){
                if (this.x < 0 || this.x + this.img.naturalWidth > 400) {
                    this.speedX *= -1;
                }
                if (this.y < 0 || this.y + this.img.naturalHeight > 300) {
                    this.speedY *= -1;
                }

                this.x += this.speedX;
                this.y += this.speedY;
            }
        },
        fire() {
            this.fired = true;
        },
    }

    return o;
}

function Paddle() {
    var image = imgFromPath('./img/paddle.png')
    var o = {
        img: image, 
        x: 100,
        y: 250,
        speed: 1,
        moveLeft() {
            if (this.x <= 0) return;
            this.x -= this.speed;            
        },
        moveRight() {
            if (this.x + this.img.naturalWidth >= 400) return;
            this.x += this.speed;            
        },
        intersect (o) {
            var cen1 = {
                x: this.x + this.img.naturalWidth / 2,
                y: this.y + this.img.naturalHeight / 2,
            };

            var cen2 = {
                x: o.x + o.img.naturalWidth / 2,
                y: o.y + o.img.naturalHeight / 2, 
            }

            var ret = {
                x: false,
                y: false,
                isTouch: false
            }
            
            if ( Math.abs(Math.abs(cen1.y - cen2.y) - this.img.naturalHeight / 2 - o.img.naturalHeight / 2) <= 3 ) {
                ret.y = true;    
            }
            if ( Math.abs(Math.abs(cen1.x - cen2.x) - this.img.naturalWidth / 2 - o.img.naturalWidth / 2) <= 3 ) {
                ret.x = true;    
            }

            if( Math.abs(cen1.y - cen2.y) - this.img.naturalHeight / 2 - o.img.naturalHeight / 2 <= 0 &&
                Math.abs(cen1.x - cen2.x) - this.img.naturalWidth / 2 - o.img.naturalWidth / 2 <= 0) {
                    ret.isTouch = true;
                }

            // ret.isTouch = ret.x === ret.y === true ? true : false;

            return ret;
        }
    }

    return o;
}

function Game() {
    const canvas = document.querySelector('#c'),
    context = canvas.getContext('2d');

    var g = {
        canvas: canvas,
        context: context,
        actions: {},
        keydowns: {},
    }

    // events
    window.addEventListener('keydown', function(e) {
        g.keydowns[e.keyCode] = true;
    })
    window.addEventListener('keyup', function(e) {
        g.keydowns[e.keyCode] = false;
    })

    g.registerAction = function(key, cb) {
        g.actions[key] = cb;
    }

    g.drawImg = function(obj) {
        this.context.drawImage(obj.img, obj.x, obj.y);                
    }

    // timer
    setInterval(function(){
        // events
        var actions = Object.keys(g.actions);
        for (var i = 0; i < actions.length; i++) {
            g.keydowns[actions[i]] ? g.actions[actions[i]]() : null;
        }
        // update
        g.update();
        // clear
        context.clearRect(0, 0, canvas.width, canvas.height);
        // draw        
        g.draw();

    }, 16.67)

    return g;
}