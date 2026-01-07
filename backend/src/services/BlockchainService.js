const crypto = require('crypto');

class BlockchainService {
  constructor() {
    this.chain = [];
    this.pendingTransactions = [];
    this.difficulty = 2;
    this.miningReward = 100;
    this.initializeGenesisBlock();
  }

  initializeGenesisBlock() {
    const genesisBlock = this.createBlock([], '0');
    this.chain.push(genesisBlock);
  }

  createBlock(transactions, previousHash) {
    const block = {
      index: this.chain.length,
      timestamp: new Date().toISOString(),
      transactions,
      previousHash,
      nonce: 0,
      hash: ''
    };

    block.hash = this.calculateHash(block);
    return block;
  }

  calculateHash(block) {
    const data = block.index + block.timestamp + JSON.stringify(block.transactions) + block.previousHash + block.nonce;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  mineBlock(block) {
    const target = '0'.repeat(this.difficulty);
    
    while (block.hash.substring(0, this.difficulty) !== target) {
      block.nonce++;
      block.hash = this.calculateHash(block);
    }
    
    console.log(`Block mined: ${block.hash}`);
    return block;
  }

  createTransaction(from, to, amount, data) {
    const transaction = {
      from,
      to,
      amount,
      data,
      timestamp: new Date().toISOString(),
      transactionId: crypto.randomUUID()
    };

    transaction.signature = this.signTransaction(transaction);
    return transaction;
  }

  signTransaction(transaction) {
    const data = transaction.from + transaction.to + transaction.amount + JSON.stringify(transaction.data) + transaction.timestamp;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  verifyTransaction(transaction) {
    const data = transaction.from + transaction.to + transaction.amount + JSON.stringify(transaction.data) + transaction.timestamp;
    const expectedSignature = crypto.createHash('sha256').update(data).digest('hex');
    return transaction.signature === expectedSignature;
  }

  addTransaction(transaction) {
    if (this.verifyTransaction(transaction)) {
      this.pendingTransactions.push(transaction);
      return true;
    }
    return false;
  }

  minePendingTransactions(miningRewardAddress) {
    const rewardTransaction = this.createTransaction(null, miningRewardAddress, this.miningReward, { type: 'mining_reward' });
    this.pendingTransactions.push(rewardTransaction);

    const block = this.createBlock(this.pendingTransactions, this.getLatestBlock().hash);
    const minedBlock = this.mineBlock(block);
    
    this.chain.push(minedBlock);
    this.pendingTransactions = [];
    
    return minedBlock;
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  getBalance(address) {
    let balance = 0;
    
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.from === address) {
          balance -= transaction.amount;
        }
        if (transaction.to === address) {
          balance += transaction.amount;
        }
      }
    }
    
    return balance;
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== this.calculateHash(currentBlock)) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    
    return true;
  }

  // Animal-specific blockchain operations
  createAnimalRecord(animalData, ownerAddress) {
    const transaction = this.createTransaction(
      ownerAddress,
      'system',
      0,
      {
        type: 'animal_record',
        animalId: animalData.id,
        breed: animalData.predictedBreed,
        owner: animalData.ownerName,
        location: animalData.location,
        timestamp: animalData.createdAt,
        metadata: {
          age: animalData.ageMonths,
          gender: animalData.gender,
          images: animalData.imageUrls,
          gps: animalData.gps
        }
      }
    );

    this.addTransaction(transaction);
    return transaction;
  }

  updateAnimalRecord(animalId, updates, updaterAddress) {
    const transaction = this.createTransaction(
      updaterAddress,
      'system',
      0,
      {
        type: 'animal_update',
        animalId,
        updates,
        timestamp: new Date().toISOString(),
        updater: updaterAddress
      }
    );

    this.addTransaction(transaction);
    return transaction;
  }

  approveAnimalRecord(animalId, approverAddress) {
    const transaction = this.createTransaction(
      approverAddress,
      'system',
      0,
      {
        type: 'animal_approval',
        animalId,
        timestamp: new Date().toISOString(),
        approver: approverAddress,
        status: 'approved'
      }
    );

    this.addTransaction(transaction);
    return transaction;
  }

  rejectAnimalRecord(animalId, rejectorAddress, reason) {
    const transaction = this.createTransaction(
      rejectorAddress,
      'system',
      0,
      {
        type: 'animal_rejection',
        animalId,
        timestamp: new Date().toISOString(),
        rejector: rejectorAddress,
        status: 'rejected',
        reason
      }
    );

    this.addTransaction(transaction);
    return transaction;
  }

  getAnimalHistory(animalId) {
    const history = [];
    
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.data && transaction.data.animalId === animalId) {
          history.push({
            blockIndex: block.index,
            blockHash: block.hash,
            transactionId: transaction.transactionId,
            timestamp: transaction.timestamp,
            type: transaction.data.type,
            data: transaction.data,
            from: transaction.from,
            to: transaction.to
          });
        }
      }
    }
    
    return history.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  verifyAnimalRecord(animalId) {
    const history = this.getAnimalHistory(animalId);
    
    if (history.length === 0) {
      return { valid: false, reason: 'No blockchain record found' };
    }

    // Check if there's an approval transaction
    const approval = history.find(h => h.type === 'animal_approval');
    if (!approval) {
      return { valid: false, reason: 'Record not approved' };
    }

    // Check if the record hasn't been tampered with
    const recordTransaction = history.find(h => h.type === 'animal_record');
    if (!recordTransaction) {
      return { valid: false, reason: 'Original record not found' };
    }

    return {
      valid: true,
      recordHash: recordTransaction.transactionId,
      approvalHash: approval.transactionId,
      blockCount: history.length,
      lastUpdate: history[history.length - 1].timestamp
    };
  }

  generateCertificate(animalId) {
    const verification = this.verifyAnimalRecord(animalId);
    const history = this.getAnimalHistory(animalId);
    
    if (!verification.valid) {
      throw new Error('Cannot generate certificate for invalid record');
    }

    const certificate = {
      animalId,
      certificateId: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
      blockchainVerification: verification,
      transactionHistory: history.map(h => ({
        type: h.type,
        timestamp: h.timestamp,
        transactionId: h.transactionId,
        blockHash: h.blockHash
      })),
      certificateHash: this.calculateCertificateHash(animalId, verification)
    };

    return certificate;
  }

  calculateCertificateHash(animalId, verification) {
    const data = animalId + verification.recordHash + verification.approvalHash + verification.lastUpdate;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  getBlockchainStats() {
    return {
      totalBlocks: this.chain.length,
      totalTransactions: this.chain.reduce((sum, block) => sum + block.transactions.length, 0),
      pendingTransactions: this.pendingTransactions.length,
      difficulty: this.difficulty,
      miningReward: this.miningReward,
      chainValid: this.isChainValid(),
      latestBlockHash: this.getLatestBlock().hash
    };
  }
}

module.exports = BlockchainService;
