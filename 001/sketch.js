function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight)
}

function draw() {
    if (mouseIsPressed) {
        fill(0);
    }
    else {
        fill(255);
    }
    ellipse(mouseX, mouseY, 80, 80);
}

window.onresize = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;  
    canvas.size(w,h);
    width = w;
    height = h;
};
