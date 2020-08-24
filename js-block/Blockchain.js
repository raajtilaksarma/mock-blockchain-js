const SHA256 = require('crypto-js/sha256');
// the block class must be able to receive multiple transactions
class Transaction {
    constructor (fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block {
    constructor(timestamp, transactions, data, previousHash='') {
        // timestamps : when the block was created
        // data : data with the block
        // previousHash : hash of the block before
        this.timestamp = timestamp;
        this.transactions = transactions;
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
    // class is responsible for keeping track of pending transactions 
    constructor () {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 100;
        // the reward miner gets when valid transaction is processed
    }

    createGenesisBlock() {
        // have to return a brand new block (first block is genesis)
        return new Block("01/08/2020", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // addBlock(newBlock) {
    //     newBlock.previousHash = this.getLatestBlock().hash;
    //     // newBlock.hash = newBlock.genHash();
    //     newBlock.mineBlock(this.difficulty);
    //     this.chain.push(newBlock);
    // }

    minePendingTransaction(mingRewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);
        this.pendingTransactions = [
            // null because currently imagine the blockchain paying out
            new Transaction(null, mingRewardAddress, this.miningReward)
        ];
        console.log('Block successfully mined. . .')
        this.chain.push(block);
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress (address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
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
// let cryptoCurr = new Blockchain();
// cryptoCurr.addBlock(new Block(1, "2/08/2020", {amount : 4}))
// cryptoCurr.addBlock(new Block(2, "3/08/2020", {amount : 9}))
// console.log('Initial JSON string of chain. . .');
// console.log(JSON.stringify(cryptoCurr, null, 4));
// console.log('Is the blockchain valid?  ' + cryptoCurr.isValidChain())


// console.log('Modifying one block. . . ' + cryptoCurr.isValidChain())
// // modify data of first block
// cryptoCurr.chain[1].data = {amount : 100};
// // as a result hash gets modified
// cryptoCurr.chain[1].hash = cryptoCurr.chain[1].genHash();
// console.log('Current JSON string of chain. . .');
// console.log(JSON.stringify(cryptoCurr, null, 4));

// console.log('Is the blockchain now valid?  ' + cryptoCurr.isValidChain())



// // create a new blockchain
// let cryptoCurr1 = new Blockchain();
// console.log("Mining block 1 . . .")
// cryptoCurr1.addBlock(new Block(1, "5/08/2020", {amount : 5}))
// console.log("Mining block 2 . . .")
// cryptoCurr1.addBlock(new Block(2, "16/08/2020", {amount : 10}))


// Testing transactions
console.log('Testing transactions. . .')
let cryptoTrans = new Blockchain();
cryptoTrans.createTransaction(new Transaction('address1','address2',100))
cryptoTrans.createTransaction(new Transaction('address2','address1',50))
console.log('\nMiner starting. . .')
cryptoTrans.minePendingTransaction('our-address')
console.log('\nBalance of account is :', cryptoTrans.getBalanceOfAddress('our-address'))
console.log('\nMiner starting. . . (2nd time)')
cryptoTrans.minePendingTransaction('our-address')
console.log('\nBalance of account is :', cryptoTrans.getBalanceOfAddress('our-address'))
console.log('\nMiner starting. . . (3rd time)')
cryptoTrans.minePendingTransaction('our-address')
console.log('\nBalance of account is :', cryptoTrans.getBalanceOfAddress('our-address'))

