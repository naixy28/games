var __main = function () {
    var game = Game();
    var paddle = Paddle();
    var ball = Ball();

    game.registerAction(37, paddle.moveLeft.bind(paddle));
    game.registerAction(39, paddle.moveRight.bind(paddle));
    game.registerAction(40, ball.fire.bind(ball));

    game.update = function() {
        ball.move();
    }

    game.draw = function() {
        this.drawImg(paddle);
        this.drawImg(ball);
    }

    // init ball
    // context.fillStyle = 'red';
    // let ballDeg = 45,
    //     speedX = 2,
    //     speedY = 2,
    //     bX = 10,
    //     bY = 10,
    //     bWidth = 20,
    //     bHeight = 20;

    // setInterval(function () {
        


    //     // draw ball
    //     if (bX <= 0 || bX + bWidth >= 400) {
    //         speedX = -speedX;
    //     }
    //     if (bY <= 0 || bY + bHeight >= 300) {
    //         speedY = -speedY;
    //     }

    //     let cX = bX += speedX,
    //         cY = bY += speedY;
    //     context.fillRect(cX, cY, bWidth, bHeight);
    // }, 16.67)
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
        speedY: 10,
        speedX: 10,
        fired: false,
        move() {
            if (this.fired){
                if (this.x < 0 || this.x > 400) {
                    this.speedX *= -1;
                }
                if (this.y < 0 || this.y > 300) {
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
        y: 200,
        speed: 5,
        moveLeft() {
            if (this.x <= 0) return;
            this.x -= this.speed;            
        },
        moveRight() {
            if (this.x + this.img.naturalWidth >= 400) return;
            this.x += this.speed;            
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