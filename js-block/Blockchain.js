const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash='') {
        // index : where the block will be in the blockchain
        // timestamps : when the block was created
        // data : data with the block
        // previousHash : hash of the block before
        this.index = index;
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = this.genHash();
        this.nonce = 0;
    }

    genHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + 
            JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty) {
        // keep mining a block till u get a hash with leaded "difficulty" no of 0s
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.genHash();
        }
        console.log("Block mined : ", this.hash);
        console.log("Nonce count :", this.nonce);
    }

}

class Blockchain {
    constructor () {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
    }

    createGenesisBlock() {
        // have to return a brand new block (first block is genesis)
        return new Block(0,"01/08/2020", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        // newBlock.hash = newBlock.genHash();
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    isValidChain() {
        // check if blockchain is valid
        for (let i = 1; i < this.chain.length; i++) {
            const currBlock = this.chain[i];
            const prevBlock = this.chain[i-1];
            
            if (currBlock.hash !== currBlock.genHash()) {
                console.log('f')
                return false;
            }
             
            if (currBlock.previousHash !== prevBlock.hash) {
                return false;
            }
        }
        return true;
    }

}

// create a new blockchain
let cryptoCurr = new Blockchain();
cryptoCurr.addBlock(new Block(1, "2/08/2020", {amount : 4}))
cryptoCurr.addBlock(new Block(2, "3/08/2020", {amount : 9}))
console.log('Initial JSON string of chain. . .');
console.log(JSON.stringify(cryptoCurr, null, 4));
console.log('Is the blockchain valid?  ' + cryptoCurr.isValidChain())


console.log('Modifying one block. . . ' + cryptoCurr.isValidChain())
// modify data of first block
cryptoCurr.chain[1].data = {amount : 100};
// as a result hash gets modified
cryptoCurr.chain[1].hash = cryptoCurr.chain[1].genHash();
console.log('Current JSON string of chain. . .');
console.log(JSON.stringify(cryptoCurr, null, 4));

console.log('Is the blockchain now valid?  ' + cryptoCurr.isValidChain())



// create a new blockchain
let cryptoCurr1 = new Blockchain();
console.log("Mining block 1 . . .")
cryptoCurr1.addBlock(new Block(1, "5/08/2020", {amount : 5}))
console.log("Mining block 2 . . .")
cryptoCurr1.addBlock(new Block(2, "16/08/2020", {amount : 10}))

