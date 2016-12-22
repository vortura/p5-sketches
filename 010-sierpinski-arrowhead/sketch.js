var td;
var count = 0;
var t;
var v;
var border = 10;

function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    frameRate(30);

    var n = 8;
    t_size = Math.pow(2, n);
    t_len = (height - 2 * border);
    t_height = Math.sqrt(Math.pow(t_len, 2) - Math.pow(t_len/2, 2));
    curve_width = Math.pow(3, n);
    v = t_len / t_size;

    td = sierpinski(n);
    console.log(td);
    t = new Turtle(width/2 + t_height/2, height - border, 3*PI/2);
}

function draw() {
    var next = false;
    while (!next && count < td.length) {
        switch(td[count]) {
            case 'A':
                t.draw(v);
                next = true;
                break;
            case 'B':
                t.draw(v);
                next = true;
                break;
            case '+':
                t.turn(-1 * PI/3);
                break;
            case '-':
                t.turn(PI/3);
                break;
        }
        count += 1;
    }
}

function Turtle (x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.stack = [];

    this.draw = function(n) {
        new_x = this.x + cos(this.r) * n;
        new_y = this.y + sin(this.r) * n;
        line(this.x, this.y, new_x, new_y);
        this.x = new_x;
        this.y = new_y;
    }

    this.turn = function(p) {
        this.r = this.r + p;
    }

    this.save = function() {
        state = [this.x, this.y, this.r].join();
        this.stack.push(state);
    }
    
    this.restore = function() {
        state_string = this.stack.pop()
        newstate = state_string.split(',');
        console.log(newstate);
        this.x = float(newstate[0]);
        this.y = float(newstate[1]);
        this.r = float(newstate[2]);
    } 
}

function saprocessor(s) {
    var p;
    switch(s) {
        case 'A':
            p = '+B-A-B+';
            break;
        case 'B':
            p = '-A+B+A-';
            break;
        default:
            p = s;
    }
    return p
}

function lsystem(state, rule, n) {
    var newstate = "";

    if (n == 0) {
        return state;
    }
    else {
        for (var i = 0; i < state.length; i++) {
            newstate += rule(state[i]);
        };
        return lsystem(newstate, rule, n - 1)
    }
}

function sierpinski(n) {
    return lsystem('A', saprocessor, n);
}

window.onresize = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;  
    canvas.size(w,h);
    width = w;
    height = h;
};
