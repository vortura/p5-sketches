var max_n, n, dd_base;

function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    frameRate(1);

    max_n = 16;
    n = 0
    dd_base = width/2;
}

function draw() {

    if (n <= max_n) {
        clear();
        initial_direction = -1 * (n % 8) * PI/4;
        dd = draw_distance(n, dd_base);
        td = dragon(n);
        t = new Turtle(width/2 - (5*dd_base/12), 2*height/3, initial_direction);
        for (var i = 0; i < td.length; i++) {
            switch(td[i]) {
                case 'F':
                    t.draw(dd);
                    break;
                case '-':
                    t.turn(-1 * PI/2);
                    break;
                case '+':
                    t.turn(PI/2);
                    break;
            }
        };
        n+=1;
    }

}

function draw_distance(n, b) {
    if (n == 0) {
        return b;
    }
    else {
        return Math.sqrt(2 * Math.pow(draw_distance(n - 1, b)/2, 2))
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

function dcprocessor(s) {
    var p;
    switch(s) {
        case 'X':
            p = 'X+YF+';
            break;
        case 'Y':
            p = '-FX-Y';
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

function dragon(n) {
    return lsystem('FX', dcprocessor, n);
}

window.onresize = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.size(w,h);
    width = w;
    height = h;
};
