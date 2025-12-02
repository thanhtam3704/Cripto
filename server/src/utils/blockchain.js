const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

class BlockchainService {
  constructor() {
    // Khởi tạo Web3 instance
    this.web3 = new Web3(process.env.ETHEREUM_RPC_URL || 'http://localhost:8545');
    
    // Load contract ABI và address
    this.loadContract();
    
    // Account của server (dùng để gửi transactions)
    if (process.env.PRIVATE_KEY) {
      this.serverAccount = this.web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
      this.web3.eth.accounts.wallet.add(this.serverAccount);
    }
  }
  
  loadContract() {
    try {
      // Đường dẫn đến file ABI
      const abiPath = path.join(__dirname, '../../..', 'smart-contracts', 'deployments', 'TipToken-ABI.json');
      
      if (fs.existsSync(abiPath)) {
        const contractABI = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
        
        if (process.env.CONTRACT_ADDRESS) {
          this.contract = new this.web3.eth.Contract(contractABI, process.env.CONTRACT_ADDRESS);
          console.log('✅ Contract loaded successfully:', process.env.CONTRACT_ADDRESS);
        } else {
          console.warn('⚠️ CONTRACT_ADDRESS chưa được cấu hình');
        }
      } else {
        console.warn('⚠️ Contract ABI file không tìm thấy:', abiPath);
      }
    } catch (error) {
      console.error('❌ Lỗi load contract:', error.message);
    }
  }
  
  // Kiểm tra kết nối blockchain
  async checkConnection() {
    try {
      const blockNumber = await this.web3.eth.getBlockNumber();
      return {
        connected: true,
        blockNumber: Number(blockNumber),
        networkId: await this.web3.eth.net.getId()
      };
    } catch (error) {
      console.error('Blockchain connection error:', error);
      return {
        connected: false,
        error: error.message
      };
    }
  }
  
  // Lấy số dư token của address
  async getTokenBalance(address) {
    try {
      if (!this.contract) {
        throw new Error('Contract chưa được load');
      }
      
      const balance = await this.contract.methods.balanceOf(address).call();
      return this.web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.error('Get balance error:', error);
      throw error;
    }
  }
  
  // Lấy thông tin earnings của creator
  async getCreatorEarnings(creatorAddress) {
    try {
      if (!this.contract) {
        throw new Error('Contract chưa được load');
      }
      
      const earnings = await this.contract.methods.getCreatorEarnings(creatorAddress).call();
      return this.web3.utils.fromWei(earnings, 'ether');
    } catch (error) {
      console.error('Get creator earnings error:', error);
      throw error;
    }
  }
  
  // Lấy thông tin transaction
  async getTransaction(txHash) {
    try {
      const [tx, receipt] = await Promise.all([
        this.web3.eth.getTransaction(txHash),
        this.web3.eth.getTransactionReceipt(txHash)
      ]);
      
      return {
        transaction: tx,
        receipt: receipt,
        confirmed: receipt && receipt.status,
        blockNumber: receipt ? Number(receipt.blockNumber) : null,
        gasUsed: receipt ? Number(receipt.gasUsed) : null
      };
    } catch (error) {
      console.error('Get transaction error:', error);
      throw error;
    }
  }
  
  // Xác minh transaction tip
  async verifyTipTransaction(txHash, expectedFrom, expectedTo, expectedAmount) {
    try {
      const txData = await this.getTransaction(txHash);
      
      if (!txData.receipt || !txData.receipt.status) {
        return { valid: false, reason: 'Transaction failed hoặc chưa confirm' };
      }
      
      // Kiểm tra logs để verify tip event
      const tipEvent = this.decodeTipEvent(txData.receipt.logs);
      
      if (!tipEvent) {
        return { valid: false, reason: 'Không tìm thấy tip event' };
      }
      
      // Xác minh thông tin
      const amountInWei = this.web3.utils.toWei(expectedAmount.toString(), 'ether');
      
      if (tipEvent.viewer.toLowerCase() !== expectedFrom.toLowerCase()) {
        return { valid: false, reason: 'Viewer address không khớp' };
      }
      
      if (tipEvent.creator.toLowerCase() !== expectedTo.toLowerCase()) {
        return { valid: false, reason: 'Creator address không khớp' };
      }
      
      if (tipEvent.amount !== amountInWei) {
        return { valid: false, reason: 'Số tiền không khớp' };
      }
      
      return {
        valid: true,
        blockNumber: Number(txData.receipt.blockNumber),
        gasUsed: Number(txData.receipt.gasUsed),
        gasPrice: txData.transaction.gasPrice
      };
      
    } catch (error) {
      console.error('Verify tip transaction error:', error);
      return { valid: false, reason: error.message };
    }
  }
  
  // Decode tip event từ logs
  decodeTipEvent(logs) {
    try {
      if (!this.contract) return null;
      
      // Tìm log của TipSent event
      const tipEventSignature = this.web3.utils.keccak256('TipSent(address,address,uint256,string)');
      
      const tipLog = logs.find(log => 
        log.topics[0] === tipEventSignature && 
        log.address.toLowerCase() === process.env.CONTRACT_ADDRESS.toLowerCase()
      );
      
      if (!tipLog) return null;
      
      // Decode log data
      const decoded = this.web3.eth.abi.decodeLog(
        [
          { type: 'address', name: 'reader', indexed: true },
          { type: 'address', name: 'writer', indexed: true },
          { type: 'uint256', name: 'amount' },
          { type: 'string', name: 'articleId' }
        ],
        tipLog.data,
        tipLog.topics.slice(1)
      );
      
      return {
        reader: decoded.reader,
        writer: decoded.writer,
        amount: decoded.amount,
        articleId: decoded.articleId
      };
      
    } catch (error) {
      console.error('Decode tip event error:', error);
      return null;
    }
  }
  
  // Lấy giá token hiện tại
  async getTokenPrice() {
    try {
      if (!this.contract) {
        throw new Error('Contract chưa được load');
      }
      
      const price = await this.contract.methods.tokenPrice().call();
      return this.web3.utils.fromWei(price, 'ether');
    } catch (error) {
      console.error('Get token price error:', error);
      throw error;
    }
  }
  
  // Theo dõi sự kiện tip real-time
  watchTipEvents(callback) {
    if (!this.contract) {
      console.error('Contract chưa được load');
      return;
    }
    
    this.contract.events.TipSent({
      fromBlock: 'latest'
    })
    .on('data', (event) => {
      console.log('💰 New tip event:', event.returnValues);
      callback(event);
    })
    .on('error', (error) => {
      console.error('Tip event error:', error);
    });
  }
}

// Singleton instance
const blockchainService = new BlockchainService();

module.exports = blockchainService;