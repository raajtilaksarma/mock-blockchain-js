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
    }

    genHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + 
            JSON.stringify(this.data)).toString();
    }

}

class Blockchain {
    constructor () {
        this.chain = [this.createGenesisBlock()];
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
        newBlock.hash = newBlock.genHash();
        this.chain.push(newBlock);
    }

    isValidChain() {
        // check if blockchain is valid
        for (let i = 1; i < this.chain.length; i++) {
            const currBlock = this.chain[i];
            const prevBlock = this.chain[i-1];
            
            if (currBlock.hash !== currBlock.genHash()) {
                return false;
            }
             
            if (currBlock.previousHash !== prevBlock.hash) {
                return false;
            }
        }
        return true;
    }

}