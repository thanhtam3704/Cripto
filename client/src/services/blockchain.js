import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

// Import ABI - sẽ được tạo sau khi deploy contract
let TipTokenABI = null;
let CONTRACT_ADDRESS = null;

try {
  const abiModule = await import('@/assets/contracts/TipToken-ABI.json');
  TipTokenABI = abiModule.default;
  
  // Load contract address từ deployment info
  const deploymentModule = await import('@/assets/contracts/TipToken-deployment.json');
  CONTRACT_ADDRESS = deploymentModule.default.address;
} catch (error) {
  console.warn('⚠️ Contract ABI chưa được deploy. Chạy: cd smart-contracts && npx hardhat run scripts/deploy.js --network localhost');
}

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
    this.initialized = false;
    
    // Auto-initialize khi service được tạo
    this.initialize();
  }

  // Initialize và auto-reconnect nếu đã kết nối trước đó
  async initialize() {
    try {
      if (this.initialized) return;
      
      const ethereumProvider = await detectEthereumProvider({ silent: true });
      
      if (ethereumProvider && TipTokenABI && CONTRACT_ADDRESS) {
        // Check nếu đã connect trước đó
        const accounts = await ethereumProvider.request({ method: 'eth_accounts' });
        
        if (accounts.length > 0) {
          console.log('🔄 Auto-reconnecting wallet...');
          await this.connectWallet();
        }
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Initialize blockchain service error:', error);
    }
  }

  // Kiểm tra MetaMask đã cài đặt
  async isMetaMaskInstalled() {
    const provider = await detectEthereumProvider();
    return !!provider;
  }

  // Kết nối MetaMask
  async connectWallet(silent = false) {
    try {
      const ethereumProvider = await detectEthereumProvider();
      
      if (!ethereumProvider) {
        throw new Error('Vui lòng cài đặt MetaMask! Tải tại: https://metamask.io/');
      }

      if (!TipTokenABI || !CONTRACT_ADDRESS) {
        throw new Error('Smart contract chưa được deploy. Vui lòng chạy: cd smart-contracts && npx hardhat run scripts/deploy.js --network localhost');
      }

      // Request account access
      const accounts = await ethereumProvider.request({ 
        method: silent ? 'eth_accounts' : 'eth_requestAccounts'
      });
      
      if (accounts.length === 0) {
        if (!silent) {
          throw new Error('Không tìm thấy tài khoản. Vui lòng mở MetaMask và đăng nhập.');
        }
        return null;
      }
      
      this.account = accounts[0];

      // Create provider and signer
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.signer = await this.provider.getSigner();

      // Get network
      const network = await this.provider.getNetwork();
      
      if (!silent) {
        console.log('Connected to network:', network.name, 'Chain ID:', network.chainId);
      }

      // Initialize contract
      this.contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        TipTokenABI,
        this.signer
      );

      if (!silent) {
        console.log('✅ Connected to wallet:', this.account);
        console.log('✅ Contract address:', CONTRACT_ADDRESS);
      }

      return {
        success: true,
        account: this.account,
        network: network.name,
        chainId: network.chainId.toString()
      };
    } catch (error) {
      if (!silent) {
        console.error('Connect wallet error:', error);
      }
      throw error;
    }
  }

  // Lấy balance của user
  async getBalance(address = null) {
    try {
      if (!this.contract) await this.connectWallet();
      
      const userAddress = address || this.account;
      const balance = await this.contract.balanceOf(userAddress);
      
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Get balance error:', error);
      throw error;
    }
  }

  // Lấy ETH balance
  async getEthBalance(address = null) {
    try {
      if (!this.provider) await this.connectWallet();
      
      const userAddress = address || this.account;
      const balance = await this.provider.getBalance(userAddress);
      
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Get ETH balance error:', error);
      throw error;
    }
  }

  // Mua tokens
  async buyTokens(ethAmount) {
    try {
      if (!this.contract) await this.connectWallet();

      console.log('Buying tokens with', ethAmount, 'ETH...');

      const tx = await this.contract.buyTokens({
        value: ethers.parseEther(ethAmount.toString())
      });

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      
      console.log('Transaction confirmed:', receipt.hash);

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Buy tokens error:', error);
      throw error;
    }
  }

  // Gửi tip
  async sendTip(creatorAddress, amount, blogId) {
    try {
      if (!this.contract) await this.connectWallet();

      console.log('Sending tip:', amount, 'TIP to', creatorAddress);

      const tokenAmount = ethers.parseEther(amount.toString());
      
      const tx = await this.contract.sendTip(
        creatorAddress,
        tokenAmount,
        blogId
      );

      console.log('Transaction sent:', tx.hash);
      const receipt = await tx.wait();
      
      console.log('Transaction confirmed:', receipt.hash);

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Send tip error:', error);
      
      // Parse error message
      if (error.message.includes('Khong the tu tip cho minh')) {
        throw new Error('Không thể tự tip cho chính mình!');
      } else if (error.message.includes('Khong du token')) {
        throw new Error('Không đủ token để gửi tip!');
      }
      
      throw error;
    }
  }

  // Rút earnings (cho blogger)
  async withdrawEarnings() {
    try {
      if (!this.contract) await this.connectWallet();

      console.log('Withdrawing earnings...');

      const tx = await this.contract.withdrawEarnings();
      const receipt = await tx.wait();
      
      console.log('Withdrawal confirmed:', receipt.hash);

      return {
        success: true,
        transactionHash: receipt.hash
      };
    } catch (error) {
      console.error('Withdraw earnings error:', error);
      
      if (error.message.includes('Khong co earnings de rut')) {
        throw new Error('Không có earnings để rút!');
      }
      
      throw error;
    }
  }

  // Lấy earnings của blogger
  async getCreatorEarnings(address = null) {
    try {
      if (!this.contract) await this.connectWallet();
      
      const creatorAddress = address || this.account;
      const earnings = await this.contract.creatorEarnings(creatorAddress);
      
      return ethers.formatEther(earnings);
    } catch (error) {
      console.error('Get creator earnings error:', error);
      throw error;
    }
  }

  // Lấy token price
  async getTokenPrice() {
    try {
      if (!this.contract) await this.connectWallet();
      
      const price = await this.contract.tokenPrice();
      return ethers.formatEther(price);
    } catch (error) {
      console.error('Get token price error:', error);
      throw error;
    }
  }

  // Lấy tip history
  async getTipHistory(viewerAddress, creatorAddress) {
    try {
      if (!this.contract) await this.connectWallet();
      
      const amount = await this.contract.tipHistory(viewerAddress, creatorAddress);
      return ethers.formatEther(amount);
    } catch (error) {
      console.error('Get tip history error:', error);
      throw error;
    }
  }

  // Lấy total tips sent (cho reader)
  async getViewerTotalTips(address = null) {
    try {
      if (!this.contract) await this.connectWallet();
      
      const viewerAddress = address || this.account;
      const total = await this.contract.viewerTotalTips(viewerAddress);
      
      return ethers.formatEther(total);
    } catch (error) {
      console.error('Get viewer total tips error:', error);
      throw error;
    }
  }

  // Lấy tip history cho creator trong khoảng thời gian
  async getCreatorTipEvents(creatorAddress = null, daysBack = 7) {
    try {
      if (!this.contract) await this.connectWallet();
      if (!this.provider) throw new Error('Provider not initialized');
      
      const targetCreator = creatorAddress || this.account;
      
      // Get current block number
      const currentBlock = await this.provider.getBlockNumber();
      
      // Estimate blocks for daysBack (assume ~12 second block time)
      const blocksPerDay = (24 * 60 * 60) / 12;
      const fromBlock = Math.max(0, currentBlock - Math.floor(blocksPerDay * daysBack));
      
      console.log(`Querying TipSent events from block ${fromBlock} to ${currentBlock}`);
      
      // Query TipSent events where creator = targetCreator
      const filter = this.contract.filters.TipSent(null, targetCreator);
      const events = await this.contract.queryFilter(filter, fromBlock, currentBlock);
      
      // Parse events to get timestamp from block
      const parsedEvents = await Promise.all(events.map(async (event) => {
        const block = await event.getBlock();
        return {
          viewer: event.args[0],
          creator: event.args[1],
          amount: ethers.formatEther(event.args[2]),
          blogId: event.args[3],
          timestamp: block.timestamp * 1000, // Convert to milliseconds
          transactionHash: event.transactionHash,
          blockNumber: event.blockNumber
        };
      }));
      
      return parsedEvents;
    } catch (error) {
      console.error('Get creator tip events error:', error);
      // Return empty array on error instead of throwing
      return [];
    }
  }

  // Listen to TipSent events
  onTipSent(callback) {
    if (!this.contract) {
      console.warn('Contract not initialized');
      return () => {};
    }
    
    const filter = this.contract.filters.TipSent();
    
    this.contract.on(filter, (viewer, creator, amount, blogId, event) => {
      callback({
        viewer,
        creator,
        amount: ethers.formatEther(amount),
        blogId,
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber
      });
    });

    // Return cleanup function
    return () => {
      this.contract.off(filter);
    };
  }

  // Listen to TokensPurchased events
  onTokensPurchased(callback) {
    if (!this.contract) return () => {};
    
    const filter = this.contract.filters.TokensPurchased();
    
    this.contract.on(filter, (buyer, amount, ethPaid, event) => {
      callback({
        buyer,
        amount: ethers.formatEther(amount),
        ethPaid: ethers.formatEther(ethPaid),
        transactionHash: event.log.transactionHash
      });
    });

    return () => {
      this.contract.off(filter);
    };
  }

  // Switch network (cho Sepolia testnet)
  async switchToNetwork(chainId) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      });
    } catch (error) {
      // Network chưa được thêm, thử add network
      if (error.code === 4902) {
        await this.addNetwork(chainId);
      } else {
        throw error;
      }
    }
  }

  // Add network
  async addNetwork(chainId) {
    const networks = {
      1337: {
        chainId: '0x539',
        chainName: 'Hardhat Local',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['http://localhost:8545']
      },
      11155111: {
        chainId: '0xaa36a7',
        chainName: 'Sepolia Testnet',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://sepolia.infura.io/v3/'],
        blockExplorerUrls: ['https://sepolia.etherscan.io']
      }
    };

    const networkParams = networks[chainId];
    if (!networkParams) {
      throw new Error(`Network ${chainId} không được hỗ trợ`);
    }

    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [networkParams]
    });
  }

  // Disconnect
  disconnect() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.account = null;
    console.log('🔌 Wallet disconnected');
  }

  // Get current account
  getCurrentAccount() {
    return this.account;
  }

  // Check if connected
  isConnected() {
    return !!this.account && !!this.contract;
  }
}

export default new BlockchainService();
