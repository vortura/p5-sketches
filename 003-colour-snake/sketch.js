num_lines = 2;
count = 0;
p = 17; 
var b;
var target;

function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    b = new Ball(width/2, height/2, 10);
    target = new Ball(random(width) - width/2, random(height) - height /2, 0);
    colorMode(HSB);
    background(0);
}

function draw() {
    b.moveto(target);
    for (var i = 0; i < p; i++) {
        push();
        translate(width/2, height/2);
        rotate(i * 2 * PI/p);
        b.draw();
        pop();
    };
    if (b.closeto(target)) {
        b.x = target.x;
        b.y = target.y;
        //b.draw();
        target = new Ball(random(width) - width/2, random(height) - height /2, 0);
    }
}

var Ball = function(x, y, v) {
    this.x = x;
    this.y = y;
    this.velocity = v;
    this.h = 0;

    this.draw = function() {
        this.h = (this.h + 0.01) % 255;
        fill(this.h, 70, 100);
        ellipse(this.x, this.y, 50, 50);
    }

    this.moveto = function(b) {
        dx = b.x - this.x;
        dy = b.y - this.y;

        theta = atan2(dy,dx)
        distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

        this.x = this.x + cos(theta) * this.velocity;
        this.y = this.y + sin(theta) * this.velocity;
    }

    this.closeto = function(b) {
        dx = b.x - this.x;
        dy = b.y - this.y;

        distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        if (distance < (this.velocity/2)) {
            return true;
        }
        else {
            return false;
        }
    }
}

window.onresize = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;  
    canvas.size(w,h);
    width = w;
    height = h;
};
