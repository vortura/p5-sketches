function setup() {
    canvas = createCanvas(window.innerWidth, window.innerHeight);

    background(15);
    stroke(10, 100, 223);
    ellipseMode(RADIUS);
    noFill();

    var N_POINTS = 200; 

    var points = [];
    for (var i = 0; i < N_POINTS; i++) {
        mypoint = new Point(Math.floor(Math.random() * width), Math.floor(Math.random() * height));
        points[i] = mypoint
        strokeWeight(4);
        points[i].draw();
        strokeWeight(1);
    };
/*
    strokeWeight(4);
    points[0] = new Point(818, 196);
    points[1] = new Point(1393, 377);
    points[2] = new Point(306, 162);
    points[0].draw();
    points[1].draw();
    //points[2].draw();
    strokeWeight(1);
    */

    var mesh = boyerWatson(points);
    //console.log(points);
}

function boyerWatson(points) {
    mesh = new Mesh();
    var super_triangle = new Face(new Vertex(-1, -1),
                                  new Vertex(-1, 2 * height),
                                  new Vertex(2 * width, -1));
    //console.log('Add supertriangle.');
    mesh.addFace(super_triangle);

    for (var i = 0; i < points.length; i++) {
        //console.log('Adding point: ' + points[i].stringify());
        var point = points[i];
        var badTriangles = [];

        //console.log("Checking faces.");
        for (var j = 0; j < mesh.faces.length; j++) {
            var tri = mesh.faces[j];
            // if point is in circumcircle of tri, add to badTriangles.
            if (tri.circumcircleContains(point)) {
                //console.log("CC for tri " + tri.stringify() + " contains point.");
                badTriangles.push(tri);
            }
            //else console.log("CC for tri " + tri.stringify() + " nae contain point.");
        };

        var free_edges = freeEdges(badTriangles);
        //console.log("Free Edges: ");
        for (var j = 0; j < free_edges.length; j++) {
            //console.log(free_edges[j].stringify());
        };

        //console.log("Deleting bad triangles.");
        //console.log("Mesh pre-deletion: " + mesh.stringify());
        for (var j = 0; j < badTriangles.length; j++) {
            mesh.deleteFace(badTriangles[j]);
        };

        //console.log("Mesh post-deletion: " + mesh.stringify());

        //console.log("Filling polygon hole with new triangles");
        for (var j = 0; j < free_edges.length; j++) {
            var new_face = new Face(free_edges[j].a,
                                    free_edges[j].b,
                                    new Vertex(point.x, point.y));
            mesh.addFace(new_face);
        };
    };

    var deletes = [];

    //console.log('Deleting super_triangle vertices');
    for (var i = 0; i < mesh.faces.length; i++) {
        if (mesh.faces[i].containsVertex(super_triangle.vertices.a) || mesh.faces[i].containsVertex(super_triangle.vertices.b) || mesh.faces[i].containsVertex(super_triangle.vertices.c)) {
            deletes.push(mesh.faces[i]);
        }
    };

    for (var i = 0; i < deletes.length; i++) {
        mesh.deleteFace(deletes[i]);
    };


    mesh.draw();
    return mesh;
}

function freeEdges(triangles) {
    var all_edges = [];
    var free_edges = [];

    for (var i = 0; i < triangles.length; i++) {
        var foo = triangles[i];
        all_edges = all_edges.concat(triangles[i].getEdgeList().edges);
    };

    for (var i = 0; i < all_edges.length; i++) {
        var free = true;
        for (var j = 0; j < all_edges.length; j++) {
            if (i == j) {
                continue;
            }
            if (all_edges[i].isEqual(all_edges[j])) {
                free = false;
                break;
            }
        };

        if (free) {
            free_edges.push(all_edges[i]);
        }
    };

    return free_edges;

}

function draw() {
}

window.onresize = function() {
    var w = window.innerWidth;
    var h = window.innerHeight;
    canvas.size(w,h);
    width = w;
    height = h;
};

function Point(x, y) {
    this.x = x;
    this.y = y;

    this.draw = function() {
        point(this.x, this.y);
    }

    this.stringify = function() {
        return "(" + this.x + "," + this.y + ")";
    }
}

function Mesh() {
    this.faces = [];
    this.vertices = [];

    this.addFace = function(face) {
        var newface = false;

        // For each vertex in the face to be added, check if the vertex is
        // already present in the mesh. If any vertex is not present, add it and
        // flag that this is a new face.
        for (var v in face.vertices) {
            var i = this._indexOfVertex(face.vertices[v]);
            if (i == -1) {
                this.vertices.push(face.vertices[v]);
                newface = true;
            }
        }

        var miss = true;

        for (var i = 0; i < this.faces.length; i++) {
            if (this.faces[i].isEqual(face)) {
                miss = false;
                break;
            }
        };

        // If this is a new face, add it to the face list.
        if (newface || miss) {
            //console.log("Adding face - " + face.stringify());
            this.faces.push(face);

            // Add reverse references from the vertices to the face
            for (var v in face.vertices) {
                var i = this._indexOfVertex(face.vertices[v]);
                if (i != -1) {
                    face.vertices[v] = this.vertices[i];
                    this.vertices[i].faces.push(face);
                }
            }
        }

    }

    this.deleteFace = function(face) {
        var i = this.faces.indexOf(face);
        if (i != -1) {
            for (var v in face.vertices) {
                var j = this._indexOfVertex(face.vertices[v]);
                if (this.vertices[j].faces.length == 1) {
                    // If this is the only face with this vertex, remove the
                    // vertex from the list of vertices.
                    this.vertices.splice(j, 1);
                }
                else {
                    // If more than one face has this vertex, unlink the deleted
                    // face from the vertex in question.
                    var p = this.vertices[j].faces.indexOf(face);
                    this.vertices[j].faces.splice(p, 1);
                }
            }
        }
        // Remove the face.
        //console.log("Deleting face - " + face.stringify());
        this.faces.splice(i, 1);
    }

    this.stringify = function() {
        var f = [];
        for (var i = 0; i < this.faces.length; i++) {
            f.push(this.faces[i].stringify());
        };

        var face_string = f.join("\n");
        return "{ " + face_string + " }";
    }


    this.draw = function() {
        var edges = this.getEdges();

        for (var i = 0; i < edges.length; i++) {
            line(edges[i].a.x, edges[i].a.y, edges[i].b.x, edges[i].b.y);
        };
/*
        for (var i = 0; i < this.faces.length; i++) {
            var cc = this.faces[i].circumcentre();
            var cr = this.faces[i].circumradius();
            ellipse(cc.x, cc.y, cr, cr);
        };
        */
    }

    this.getEdges = function() {
        var edges = new EdgeList();
        for (var i = 0; i < this.faces.length; i++) {
            var face = this.faces[i];
            var edge1 = new Edge(face.vertices.a, face.vertices.b);
            var edge2 = new Edge(face.vertices.b, face.vertices.c);
            var edge3 = new Edge(face.vertices.c, face.vertices.a);

            if (! edges.contains(edge1)) {
                edges.append(edge1);
            }
            if (! edges.contains(edge2)) {
                edges.append(edge2);
            }
            if (! edges.contains(edge3)) {
                edges.append(edge3);
            }
        };
        return edges.edges;
    }

    this._indexOfVertex = function(v) {
        for (var i = 0; i < this.vertices.length; i++) {
            if (v.isEqual(this.vertices[i])) {
                return i;
            }
        };
        return -1;
    }
}

function EdgeList() {
    this.edges = [];

    this.contains = function(e) {
        for (var i = 0; i < this.edges.length; i++) {
            if (this.edges[i].isEqual(e)) {
                return true;
            }
        };
        return false;
    }

    this.append = function(e) {
        this.edges.push(e);
    }
}

function Edge(a, b) {
    this.a = a;
    this.b = b;

    this.isEqual = function(e) {
        if (this.a.x == e.a.x &&
            this.b.x == e.b.x &&
            this.a.y == e.a.y &&
            this.b.y == e.b.y) {
            return true;
        }
        if (this.a.x == e.b.x &&
            this.b.x == e.a.x &&
            this.a.y == e.b.y &&
            this.b.y == e.a.y) {
            return true;
        }
        return false;
    }

    this.stringify = function() {
        return "{a: " + this.a.stringify() + ", b: " + this.b.stringify() + "}";
    }
}

function Vertex(x, y) {
    this.x = x;
    this.y = y;
    this.faces = [];

    this.isEqual = function(v) {
        return (v.x == this.x) && (v.y == this.y);
    }

    this.stringify = function() {
        return "(" + this.x + "," + this.y + ")";
    }
}

function Face(a, b, c) {
    this.vertices = {};

    // Orient vertices clockwise
    var cp = (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
    this.vertices.a = a;
    if (cp > 0) {
        this.vertices.b = b;
        this.vertices.c = c;
    }
    else {
        this.vertices.b = c;
        this.vertices.c = b;
    }

    this.circumcircleContains = function(d) {
        var a = this.vertices.a;
        var b = this.vertices.b;
        var c = this.vertices.c;

        var d_a = a.x - d.x;
        var d_b = a.y - d.y;
        var d_c = (a.x*a.x - d.x*d.x) + (a.y*a.y - d.y*d.y);

        var d_d = b.x - d.x;
        var d_e = b.y - d.y;
        var d_f = (b.x*b.x - d.x*d.x) + (b.y*b.y - d.y*d.y);

        var d_g = c.x - d.x;
        var d_h = c.y - d.y;
        var d_i = (c.x*c.x - d.x*d.x) + (c.y*c.y - d.y*d.y);

        var determinant = d_a * d_e * d_i + d_b * d_f * d_g + d_c * d_d * d_h - d_c * d_e * d_g - d_b * d_d * d_i - d_a * d_f * d_h;
        return determinant > 0;
    }

    this.circumcentre = function() {
        var a = this.vertices.a;
        var b = this.vertices.b;
        var c = this.vertices.c;

        var d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));

        var u_x = (  (a.x*a.x + a.y*a.y) * (b.y - c.y)
                   + (b.x*b.x + b.y*b.y) * (c.y - a.y)
                   + (c.x*c.x + c.y*c.y) * (a.y - b.y))
                   / d;
        var u_y = (  (a.x*a.x + a.y*a.y) * (c.x - b.x)
                   + (b.x*b.x + b.y*b.y) * (a.x - c.x)
                   + (c.x*c.x + c.y*c.y) * (b.x - a.x))
                   / d;
        return new Point(u_x, u_y);
    }

    this.circumradius = function() {
        var cc = this.circumcentre();
        var a = this.vertices.a;

        return Math.sqrt(Math.pow(cc.x - a.x, 2) + Math.pow(cc.y - a.y, 2));
    }

    this.getEdgeList = function() {
        var e = new EdgeList();
        e.append(new Edge(this.vertices.a, this.vertices.b));
        e.append(new Edge(this.vertices.b, this.vertices.c));
        e.append(new Edge(this.vertices.c, this.vertices.a));
        return e;
    }

    this.containsVertex = function(v) {
        return this.vertices.a.isEqual(v) || this.vertices.b.isEqual(v) || this.vertices.c.isEqual(v);
    }

    this.isEqual = function(f) {
        return this.containsVertex(f.vertices.a) && this.containsVertex(f.vertices.b) && this.containsVertex(f.vertices.c);
    }

    this.stringify = function() {
        return "{a: " + this.vertices.a.stringify() + " b: " + this.vertices.b.stringify() + " c: " + this.vertices.c.stringify() + "}";

    }

}
