const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d')
canvas.width = 1000;
canvas.height = 600;
var img_dino_list = [];
var img_back = new Image();
var img_cactus = new Image();
for(i = 0; i<48 ; i++){
    var img_dino = new Image();
    img_dino.src = 'img/dino/fff-'+i+'.jpg';
    img_dino_list.push(img_dino);
}
img_dino.src = 'img/dino/fff-0.jpg';
img_back.src = 'img/back.jpg';
img_cactus.src = 'img/cat.png';


const dino = {
    x: 50,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    index: 0,
    draw() {
        if (frame%1 == 0){
            this.index =(this.index + 1)%48;
        }
        //ctx.fillStyle = 'green';
        //ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.drawImage(img_dino_list[this.index], this.x, this.y, this.width, this.height);
    }
}

class Cactus {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height - 100;
        this.width = 50;
        this.height = 50;
    }
    draw() {
        //ctx.fillStyle = 'red';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.drawImage(img_cactus, this.x, this.y, this.width, this.height);
    }
}

var cactus = {
    x: 900,
    y: 500,
    width: 50,
    height: 50,
}


var jump = false;
var step = 3;
var frame = 0;
var cactus_list = [];
var animation;
var v = 15;
var v_ = 0;
var ac = -0.98;
var groundY = canvas.height - 100;
function play() {
    animation = requestAnimationFrame(play);
    frame += 1;
    if (frame % 240 == 1) {
        var cactus = new Cactus();
        cactus_list.push(cactus);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img_back, 0, 0, canvas.width, canvas.height);
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center'
    ctx.fillText('Score: ' + frame, canvas.width - 100, 50);

    cactus_list.forEach((a, i, o) => {
        if (a.x < -a.width) {
            o.splice(i, 1);
        }
        a.x -= 5;
        a.draw();
        collision(dino, a)
    })

    if (jump === true) {
        v_ += ac;
        dino.y -= v_;
        if (-0.1<=v<=0.1) {
            v +=ac;     
        }
        if (dino.y >= groundY) {
            dino.y = groundY;
            jump = false;
            v_ = 0;
        }
    }
    dino.draw()
}

document.addEventListener('keydown', function (e) {
    if (e.code === 'Space') {
        jump = true;
        v_ = v
    }
})

function collision(dino, cactus) {
    ctx.font = '30px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    var x_len = cactus.x - (dino.x + dino.width);
    var y_len = cactus.y - (dino.y + dino.height);

    if ((cactus.x > 50 && x_len < -10) && y_len < -10) {
        ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2)
        cancelAnimationFrame(animation);


    }
}
play()


