function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);
    frameRate(30);

    n = 7;
    rows = 2 * n + 1;
    row_height = height / rows;

// rect(row_height, row_height, width - 2 * row_height, row_height);

    for (var i = 0; i < n; i++) {
        td = cantorset(i);
        l = td.length;
        block_len = (width - 2 * row_height) / l;
        x_pos = row_height;
        y_pos = ((2 * i) + 1) * row_height;
        for (var j = 0; j < td.length; j++) {
            switch(td[j]) {
                case 'A':
                    console.log(x_pos, y_pos, row_height);
                    rect(x_pos, y_pos, block_len, row_height);
                    x_pos += block_len;
                    break;
                case 'B':
                    x_pos += block_len;
                    break;
            }
        };
    };

}

function draw() {
}

function csprocessor(s) {
    var p;
    switch(s) {
        case 'A':
            p = 'ABA';
            break;
        case 'B':
            p = 'BBB';
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

function cantorset(n) {
    return lsystem('A', csprocessor, n);
}

window.onresize = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;  
    canvas.size(w,h);
    width = w;
    height = h;
};
