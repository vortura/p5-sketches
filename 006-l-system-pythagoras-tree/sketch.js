function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    frameRate(30);

    td = pythagorastree(8);
    console.log(td);

    t = new Turtle(width/2, 1.5 * height, 3*PI/2);

    for (var i = 0; i < td.length; i++) {
        switch(td[i]) {
            case '0':
                console.log("draw leaf");
                t.draw(2);
                break;
            case '1':
                console.log("draw branch");
                t.draw(4);
                break;
            case '[':
                console.log("push turn left");
                t.save();
                t.turn(-1 * PI/4);
                break;
            case ']':
                console.log("pop turn right");
                t.restore();
                t.turn(PI/4);
                break;
        }
    };
}

function draw() {
}

function Turtle (x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;

    this.stack = [];

    this.draw = function(n) {
        new_x = this.x + cos(this.r) * n;
        new_y = this.y + sin(this.r) * n;
        console.log("X: " + new_x + " Y: " + new_y);
        line(this.x, this.y, new_x, new_y);
        this.x = new_x;
        this.y = new_y;
    }

    this.turn = function(p) {
        this.r = this.r + p;
    }

    this.save = function() {
        state = [this.x, this.y, this.r].join();
        console.log("Push " + state);
        this.stack.push(state);
    }
    
    this.restore = function() {
        state_string = this.stack.pop()
        newstate = state_string.split(',');
        console.log("Pop " + state_string);
        console.log(newstate);
        this.x = float(newstate[0]);
        this.y = float(newstate[1]);
        this.r = float(newstate[2]);
    } 
}

function ptprocessor(s) {
    var p;
    switch(s) {
        case '1':
            p = '11';
            break;
        case '0':
            p = '1[0]0';
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

function pythagorastree(n) {
    return lsystem('0', ptprocessor, n);
}

window.onresize = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;  
    canvas.size(w,h);
    width = w;
    height = h;
};
