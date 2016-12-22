var p = [];
var n = 20;


function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    frameRate(30);
    background(0);
    blendMode(ADD);
    stroke('rgba(50,110,200,0.25)');

    for (var i = 0; i < n; i++) {
        p[i] = new RandomPoint(width/2, height/2);
    };
}

function draw() {
    for (var i = 0; i < n; i++) {
        p[i].move();
        p[i].draw();
    };
}

var RandomPoint = function(x, y) {
    this.x = x;
    this.y = y;

    this.prev_x = x;
    this.prev_y = y;

    this.theta = random() * 2 * PI;
    this.r = 5;

    this.draw = function() {
        line(this.prev_x, this.prev_y, this.x, this.y);
    }

    this.move = function() {
        this.theta = random() * 2 * PI;
        this.prev_x = this.x;
        this.prev_y = this.y;
        this.x = this.x + cos(this.theta) * this.r;
        this.y = this.y + sin(this.theta) * this.r;
    }
}

window.onresize = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;  
    canvas.size(w,h);
    width = w;
    height = h;
};
