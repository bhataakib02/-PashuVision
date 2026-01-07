// Blockchain Integration Service
class BlockchainIntegrationService {
  constructor() {
    this.contractAddress = process.env.BLOCKCHAIN_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890'
    this.networkId = process.env.BLOCKCHAIN_NETWORK_ID || '1'
    this.gasLimit = 500000
    this.gasPrice = '20000000000' // 20 gwei
  }

  // Initialize blockchain connection
  async initializeBlockchain() {
    try {
      // Check if Web3 is available
      if (typeof window.ethereum !== 'undefined') {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        
        // Get provider
        const provider = new window.ethereum
        const web3 = new Web3(provider)
        
        // Get accounts
        const accounts = await web3.eth.getAccounts()
        
        return {
          success: true,
          web3: web3,
          accounts: accounts,
          currentAccount: accounts[0]
        }
      } else {
        return {
          success: false,
          error: 'MetaMask or Web3 provider not found'
        }
      }
    } catch (error) {
      console.error('Blockchain initialization error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Create animal record on blockchain
  async createAnimalRecord(animalData) {
    try {
      const blockchain = await this.initializeBlockchain()
      if (!blockchain.success) {
        throw new Error(blockchain.error)
      }

      const { web3, currentAccount } = blockchain

      // Prepare animal data for blockchain
      const blockchainData = {
        animalId: animalData.id,
        earTag: animalData.earTag,
        breed: animalData.breed,
        owner: animalData.owner,
        village: animalData.village,
        district: animalData.district,
        state: animalData.state,
        coordinates: animalData.coordinates,
        timestamp: Math.floor(Date.now() / 1000),
        hash: this.generateHash(animalData)
      }

      // Create transaction
      const transaction = {
        from: currentAccount,
        to: this.contractAddress,
        gas: this.gasLimit,
        gasPrice: this.gasPrice,
        data: this.encodeAnimalData(blockchainData)
      }

      // Send transaction
      const receipt = await web3.eth.sendTransaction(transaction)

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        data: blockchainData
      }
    } catch (error) {
      console.error('Blockchain animal record creation error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Update animal record on blockchain
  async updateAnimalRecord(animalId, updateData) {
    try {
      const blockchain = await this.initializeBlockchain()
      if (!blockchain.success) {
        throw new Error(blockchain.error)
      }

      const { web3, currentAccount } = blockchain

      // Prepare update data
      const blockchainUpdate = {
        animalId: animalId,
        updateData: updateData,
        timestamp: Math.floor(Date.now() / 1000),
        hash: this.generateHash(updateData)
      }

      // Create transaction
      const transaction = {
        from: currentAccount,
        to: this.contractAddress,
        gas: this.gasLimit,
        gasPrice: this.gasPrice,
        data: this.encodeUpdateData(blockchainUpdate)
      }

      // Send transaction
      const receipt = await web3.eth.sendTransaction(transaction)

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        data: blockchainUpdate
      }
    } catch (error) {
      console.error('Blockchain animal record update error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Create health record on blockchain
  async createHealthRecord(healthData) {
    try {
      const blockchain = await this.initializeBlockchain()
      if (!blockchain.success) {
        throw new Error(blockchain.error)
      }

      const { web3, currentAccount } = blockchain

      // Prepare health data
      const blockchainData = {
        animalId: healthData.animalId,
        healthStatus: healthData.healthStatus,
        symptoms: healthData.symptoms,
        diagnosis: healthData.diagnosis,
        treatment: healthData.treatment,
        veterinarian: healthData.veterinarian,
        timestamp: Math.floor(Date.now() / 1000),
        hash: this.generateHash(healthData)
      }

      // Create transaction
      const transaction = {
        from: currentAccount,
        to: this.contractAddress,
        gas: this.gasLimit,
        gasPrice: this.gasPrice,
        data: this.encodeHealthData(blockchainData)
      }

      // Send transaction
      const receipt = await web3.eth.sendTransaction(transaction)

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        data: blockchainData
      }
    } catch (error) {
      console.error('Blockchain health record creation error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Create vaccination record on blockchain
  async createVaccinationRecord(vaccinationData) {
    try {
      const blockchain = await this.initializeBlockchain()
      if (!blockchain.success) {
        throw new Error(blockchain.error)
      }

      const { web3, currentAccount } = blockchain

      // Prepare vaccination data
      const blockchainData = {
        animalId: vaccinationData.animalId,
        vaccineType: vaccinationData.vaccineType,
        date: vaccinationData.date,
        veterinarian: vaccinationData.veterinarian,
        nextDue: vaccinationData.nextDue,
        batchNumber: vaccinationData.batchNumber,
        timestamp: Math.floor(Date.now() / 1000),
        hash: this.generateHash(vaccinationData)
      }

      // Create transaction
      const transaction = {
        from: currentAccount,
        to: this.contractAddress,
        gas: this.gasLimit,
        gasPrice: this.gasPrice,
        data: this.encodeVaccinationData(blockchainData)
      }

      // Send transaction
      const receipt = await web3.eth.sendTransaction(transaction)

      return {
        success: true,
        transactionHash: receipt.transactionHash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed,
        data: blockchainData
      }
    } catch (error) {
      console.error('Blockchain vaccination record creation error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Verify record integrity
  async verifyRecordIntegrity(recordHash, transactionHash) {
    try {
      const blockchain = await this.initializeBlockchain()
      if (!blockchain.success) {
        throw new Error(blockchain.error)
      }

      const { web3 } = blockchain

      // Get transaction details
      const transaction = await web3.eth.getTransaction(transactionHash)
      const receipt = await web3.eth.getTransactionReceipt(transactionHash)

      // Verify transaction exists and is confirmed
      if (!transaction || !receipt) {
        return {
          success: false,
          error: 'Transaction not found'
        }
      }

      // Verify transaction is confirmed
      const currentBlock = await web3.eth.getBlockNumber()
      const confirmations = currentBlock - receipt.blockNumber

      if (confirmations < 1) {
        return {
          success: false,
          error: 'Transaction not yet confirmed'
        }
      }

      // Verify hash matches
      const storedHash = this.extractHashFromTransaction(transaction)
      const hashMatches = storedHash === recordHash

      return {
        success: true,
        verified: hashMatches,
        confirmations: confirmations,
        blockNumber: receipt.blockNumber,
        transactionHash: transactionHash,
        storedHash: storedHash,
        providedHash: recordHash
      }
    } catch (error) {
      console.error('Record integrity verification error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get record history from blockchain
  async getRecordHistory(animalId) {
    try {
      const blockchain = await this.initializeBlockchain()
      if (!blockchain.success) {
        throw new Error(blockchain.error)
      }

      const { web3 } = blockchain

      // Get all transactions for this animal
      const events = await web3.eth.getPastLogs({
        fromBlock: 0,
        toBlock: 'latest',
        address: this.contractAddress,
        topics: [this.getEventTopic('AnimalRecordCreated'), this.getEventTopic('AnimalRecordUpdated')]
      })

      // Filter events for this animal
      const animalEvents = events.filter(event => {
        const decodedData = this.decodeEventData(event)
        return decodedData.animalId === animalId
      })

      // Process events into history
      const history = animalEvents.map(event => ({
        transactionHash: event.transactionHash,
        blockNumber: event.blockNumber,
        timestamp: new Date(parseInt(event.data, 16) * 1000),
        type: event.topics[0] === this.getEventTopic('AnimalRecordCreated') ? 'created' : 'updated',
        data: this.decodeEventData(event)
      }))

      return {
        success: true,
        history: history,
        totalRecords: history.length
      }
    } catch (error) {
      console.error('Record history retrieval error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Generate hash for data integrity
  generateHash(data) {
    const crypto = require('crypto')
    const dataString = JSON.stringify(data, Object.keys(data).sort())
    return crypto.createHash('sha256').update(dataString).digest('hex')
  }

  // Encode animal data for blockchain
  encodeAnimalData(data) {
    // This would use ABI encoding in a real implementation
    return '0x' + Buffer.from(JSON.stringify(data)).toString('hex')
  }

  // Encode update data for blockchain
  encodeUpdateData(data) {
    return '0x' + Buffer.from(JSON.stringify(data)).toString('hex')
  }

  // Encode health data for blockchain
  encodeHealthData(data) {
    return '0x' + Buffer.from(JSON.stringify(data)).toString('hex')
  }

  // Encode vaccination data for blockchain
  encodeVaccinationData(data) {
    return '0x' + Buffer.from(JSON.stringify(data)).toString('hex')
  }

  // Extract hash from transaction
  extractHashFromTransaction(transaction) {
    // This would extract the hash from the transaction data
    // In a real implementation, this would use ABI decoding
    try {
      const data = JSON.parse(Buffer.from(transaction.input.slice(2), 'hex').toString())
      return data.hash
    } catch {
      return null
    }
  }

  // Get event topic for filtering
  getEventTopic(eventName) {
    const crypto = require('crypto')
    return '0x' + crypto.createHash('sha256').update(eventName).digest('hex').slice(0, 8)
  }

  // Decode event data
  decodeEventData(event) {
    // This would use ABI decoding in a real implementation
    try {
      return JSON.parse(Buffer.from(event.data.slice(2), 'hex').toString())
    } catch {
      return null
    }
  }

  // Get blockchain status
  async getBlockchainStatus() {
    try {
      const blockchain = await this.initializeBlockchain()
      if (!blockchain.success) {
        return blockchain
      }

      const { web3 } = blockchain

      // Get network information
      const networkId = await web3.eth.net.getId()
      const blockNumber = await web3.eth.getBlockNumber()
      const gasPrice = await web3.eth.getGasPrice()

      return {
        success: true,
        networkId: networkId,
        blockNumber: blockNumber,
        gasPrice: gasPrice,
        contractAddress: this.contractAddress,
        connected: true
      }
    } catch (error) {
      console.error('Blockchain status error:', error)
      return {
        success: false,
        error: error.message,
        connected: false
      }
    }
  }

  // Estimate gas cost
  async estimateGasCost(transactionData) {
    try {
      const blockchain = await this.initializeBlockchain()
      if (!blockchain.success) {
        throw new Error(blockchain.error)
      }

      const { web3 } = blockchain

      const gasEstimate = await web3.eth.estimateGas(transactionData)
      const gasPrice = await web3.eth.getGasPrice()
      const gasCost = web3.utils.fromWei((gasEstimate * gasPrice).toString(), 'ether')

      return {
        success: true,
        gasEstimate: gasEstimate,
        gasPrice: gasPrice,
        gasCost: gasCost,
        gasCostUSD: parseFloat(gasCost) * 2000 // Assuming $2000 per ETH
      }
    } catch (error) {
      console.error('Gas estimation error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get transaction status
  async getTransactionStatus(transactionHash) {
    try {
      const blockchain = await this.initializeBlockchain()
      if (!blockchain.success) {
        throw new Error(blockchain.error)
      }

      const { web3 } = blockchain

      const receipt = await web3.eth.getTransactionReceipt(transactionHash)
      const transaction = await web3.eth.getTransaction(transactionHash)

      if (!receipt) {
        return {
          success: true,
          status: 'pending',
          confirmations: 0
        }
      }

      const currentBlock = await web3.eth.getBlockNumber()
      const confirmations = currentBlock - receipt.blockNumber

      return {
        success: true,
        status: receipt.status ? 'confirmed' : 'failed',
        confirmations: confirmations,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed
      }
    } catch (error) {
      console.error('Transaction status error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Batch create records
  async batchCreateRecords(records) {
    const results = []
    
    for (const record of records) {
      try {
        let result
        
        switch (record.type) {
          case 'animal':
            result = await this.createAnimalRecord(record.data)
            break
          case 'health':
            result = await this.createHealthRecord(record.data)
            break
          case 'vaccination':
            result = await this.createVaccinationRecord(record.data)
            break
          default:
            result = { success: false, error: 'Unknown record type' }
        }
        
        results.push({
          record: record,
          result: result
        })
      } catch (error) {
        results.push({
          record: record,
          result: { success: false, error: error.message }
        })
      }
    }
    
    return results
  }
}

export default BlockchainIntegrationService


