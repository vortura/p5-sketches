function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    frameRate(30);

    for (var i = 0; i < 11; i++) {
        console.log(algae(i));
    };
}

function draw() {
}

function algaeprocessor(s) {
    var p;
    switch(s) {
        case 'A':
            p = 'AB';
            break;
        case 'B':
            p = 'A';
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

function algae(n) {
    return lsystem('A', algaeprocessor, n);
}

window.onresize = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;  
    canvas.size(w,h);
    width = w;
    height = h;
};
