console.log('hello');

const fs = require('fs');
const SortedArray = require("collections/sorted-array"); // https://www.collectionsjs.com/sorted-array

class Vertex {
    constructor(height, dist = 1000000) {
        this.dist = dist;
        this.prev = undefined;
        this.neighbors = [];
        this.height = height;
    }
}

let Q = new SortedArray([], (a, b) => a === b, (a, b) => b.dist - a.dist);

console.log(Q.length);

let vertices = [];
let start = undefined;
let target = undefined;

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
            target = (new Vertex(26));
            vertexLine.push(target);
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
        tryAddNeighbor(neighbors, x - 1, y, currHeight);
        tryAddNeighbor(neighbors, x + 1, y, currHeight);
        tryAddNeighbor(neighbors, x, y - 1, currHeight);
        tryAddNeighbor(neighbors, x, y + 1, currHeight);

        vertex.neighbors = neighbors;
        numNeighbors += neighbors.length;

        Q.push(vertex);


        // console.log(vertex);
    }
}

function findPath() {
    while (Q.length > 0) {
        let u = Q.pop();
        
        console.log(`Pop dist ${u.dist}`);
        if (u === target) {
            console.log(`Target found with dist ${u.dist}`);
        }

        let availableNeighbors = u.neighbors.filter(n => Q.has(n));
        console.log(`  Checking ${availableNeighbors.length} neighbors`);
        for (const v of availableNeighbors) {
            console.log("      "+v);
        }
            
        for (const v of availableNeighbors) {
            let alt = u.dist + 1;
            
            // console.log("Neighbor: " + v);
            console.log(`    Alt: ${alt}, v.dist: ${v.dist}`)
            if (alt < v.dist) {
                v.dist = alt;
                v.prev = u;
                Q.delete(v);
                Q.push(v);
                console.log(`Pushing with dist ${v.dist}`);
            }
        }
    }
}

console.log(`Width: ${vertices[0].length}`);
console.log(`Height: ${vertices.length}`);

console.log(`Neighbors: ${numNeighbors}`);

console.log(`SortedArray: ${Q.length}`);

let dist = findPath();
console.log(dist);


