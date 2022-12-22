console.log('hello');

const fs = require('fs');
const SortedArray = require("collections/sorted-array"); // https://www.collectionsjs.com/sorted-array

class Vertex {
    constructor(height, dist = Number.MAX_VALUE) {
        this.dist = dist;
        this.prev = undefined;
        this.neighbors = [];
        this.height = height;
    }
}

let Q = new SortedArray([], (a, b) => a === b, (a, b) => a.dist - b.dist);

console.log(Q.length);

let vertices = [];
let start = undefined;
let end = undefined;

function charToHeight(c) {
    return 1 + c.charCodeAt(0) - 'a'.charCodeAt(0);
}

const allFileContents = fs.readFileSync('Example.txt', 'utf-8');
allFileContents.split(/\r?\n/).forEach(line => {
    let vertexLine = []
    for (let i = 0; i < line.length; i++) {
        let c = line.charAt(i);
        if (c === 'S') {
            start = new Vertex(1, 0);
            vertexLine.push(start);
        } else if (c === 'E') {
            end = (new Vertex(26));
            vertexLine.push(end);
        } else {
            let v = new Vertex(charToHeight(c)); // ##################
            vertexLine.push(v);
        }
    }

    vertices.push(vertexLine);
});

function isNeighbor(x, y, currHeight) {
    // console.log(`Checking (${x},${y}) with height ${currHeight}`);
    return x >= 0 && x < vertices[0].length
        && y >= 0 && y < vertices.length
        && vertices[y][x].height <= currHeight + 1;
}

function tryAddNeighbor(neighbors, x, y, currHeight) {
    if (isNeighbor(x, y, currHeight))
        neighbors.push(vertices[y][x]);
}

let numNeighbors = 0;

for (let y = 0; y < vertices.length; y++) {
    for (let x = 0; x < vertices[0].length; x++) {
        let neighbors = [];
        let vertex = vertices[y][x];
        let currHeight = vertex.height;
        tryAddNeighbor(neighbors, x-1, y, currHeight);
        tryAddNeighbor(neighbors, x+1, y, currHeight);
        tryAddNeighbor(neighbors, x, y-1, currHeight);
        tryAddNeighbor(neighbors, x, y+1, currHeight);

        vertex.neighbors = neighbors;
        numNeighbors += neighbors.length;

        Q.push(vertex);
    }
}

console.log(`Width: ${vertices[0].length}`);
console.log(`Height: ${vertices.length}`);

console.log(`Neighbors: ${numNeighbors}`);

console.log(`SortedArray: ${Q.length}`);


