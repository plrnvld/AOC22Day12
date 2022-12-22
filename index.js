console.log('hello');

const fs = require('fs');

const allFileContents = fs.readFileSync('Example.txt', 'utf-8');
allFileContents.split(/\r?\n/).forEach(line =>  {
  console.log(line);
});

class Vertex {
    constructor() {
        this.dist = Number.MAX_VALUE;
        this.prev = undefined;
        this.neighbors = [];
    }
}
