import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import detectEthereumProvider from '@metamask/detect-provider'
import Web3 from 'web3'
import contractABI from '@/assets/contracts/TipToken-ABI.json'

export const useWalletStore = defineStore('wallet', () => {
  const toast = useToast()
  
  // State
  const isConnected = ref(false)
  const address = ref('')
  const balance = ref('0')
  const tokenBalance = ref('0')
  const network = ref(null)
  const provider = ref(null)
  const web3 = ref(null)
  const contract = ref(null)
  const connecting = ref(false)
  
  // Contract configuration
  const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890'
  
  // Getters
  const formattedBalance = computed(() => {
    return parseFloat(balance.value).toFixed(4)
  })
  
  const formattedTokenBalance = computed(() => {
    return parseFloat(tokenBalance.value).toFixed(2)
  })
  
  const isMetaMaskInstalled = computed(() => {
    return typeof window.ethereum !== 'undefined'
  })
  
  // Actions
  const initializeWallet = async () => {
    try {
      console.log('🔍 Initializing wallet...');
      
      // Silent mode - không hiện warning nếu không có MetaMask
      const ethereumProvider = await detectEthereumProvider({ silent: true })
      
      if (ethereumProvider) {
        provider.value = ethereumProvider
        web3.value = new Web3(ethereumProvider)
        
        // Setup contract
        if (contractABI && CONTRACT_ADDRESS) {
          contract.value = new web3.value.eth.Contract(contractABI, CONTRACT_ADDRESS)
        }
        
        // Check if already connected - quan trọng để auto-reconnect
        const accounts = await ethereumProvider.request({ method: 'eth_accounts' })
        console.log('📋 Existing accounts:', accounts);
        
        if (accounts.length > 0) {
          console.log('✅ Found existing connection, auto-connecting...');
          await connectWallet(false) // Silent reconnect, không show toast
        } else {
          console.log('ℹ️ No existing connection found');
        }
        
        // Listen for account changes
        ethereumProvider.on('accountsChanged', handleAccountsChanged)
        ethereumProvider.on('chainChanged', handleChainChanged)
        
        return true
      } else {
        console.warn('⚠️ MetaMask not detected')
        return false
      }
    } catch (error) {
      console.error('❌ Error initializing wallet:', error)
      return false
    }
  }
  
  const connectWallet = async (showToast = true) => {
    if (!provider.value) {
      if (showToast) {
        toast.error('MetaMask chưa được cài đặt')
      }
      return false
    }
    
    try {
      connecting.value = true
      
      // Request account access
      const accounts = await provider.value.request({
        method: 'eth_requestAccounts'
      })
      
      if (accounts.length > 0) {
        address.value = accounts[0]
        isConnected.value = true
        
        console.log('✅ Wallet connected:', address.value);
        
        await updateBalances()
        await updateNetwork()
        
        if (showToast) {
          toast.success('Kết nối wallet thành công!')
        }
        
        return true
      }
    } catch (error) {
      console.error('❌ Error connecting wallet:', error)
      
      if (showToast) {
        if (error.code === 4001) {
          toast.error('Bạn đã từ chối kết nối wallet')
        } else {
          toast.error('Lỗi kết nối wallet')
        }
      }
      
      return false
    } finally {
      connecting.value = false
    }
  }
  
  const disconnectWallet = () => {
    isConnected.value = false
    address.value = ''
    balance.value = '0'
    tokenBalance.value = '0'
    network.value = null
    toast.info('Wallet đã ngắt kết nối')
  }
  
  const updateBalances = async () => {
    if (!address.value || !web3.value) return
    
    try {
      // Get ETH balance
      const ethBalance = await web3.value.eth.getBalance(address.value)
      balance.value = web3.value.utils.fromWei(ethBalance, 'ether')
      
      // Get token balance
      if (contract.value) {
        const tokenBal = await contract.value.methods.balanceOf(address.value).call()
        tokenBalance.value = web3.value.utils.fromWei(tokenBal, 'ether')
      }
    } catch (error) {
      console.error('Error updating balances:', error)
    }
  }
  
  const updateNetwork = async () => {
    if (!provider.value) return
    
    try {
      const chainId = await provider.value.request({ method: 'eth_chainId' })
      const networkId = parseInt(chainId, 16)
      
      const networks = {
        1: 'Mainnet',
        3: 'Ropsten',
        4: 'Rinkeby',
        5: 'Goerli',
        11155111: 'Sepolia',
        1337: 'Hardhat',
        31337: 'Hardhat'
      }
      
      network.value = {
        id: networkId,
        name: networks[networkId] || `Unknown (${networkId})`
      }
    } catch (error) {
      console.error('Error getting network:', error)
    }
  }
  
  const switchToNetwork = async (chainId) => {
    if (!provider.value) return false
    
    try {
      await provider.value.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }]
      })
      return true
    } catch (error) {
      console.error('Error switching network:', error)
      return false
    }
  }
  
  const sendTip = async (toAddress, amount, videoId) => {
    if (!contract.value || !address.value) {
      throw new Error('Wallet chưa kết nối')
    }
    
    try {
      const amountInWei = web3.value.utils.toWei(amount.toString(), 'ether')
      
      // Estimate gas
      const gasEstimate = await contract.value.methods
        .sendTip(toAddress, amountInWei, videoId)
        .estimateGas({ from: address.value })
      
      // Send transaction
      const tx = await contract.value.methods
        .sendTip(toAddress, amountInWei, videoId)
        .send({
          from: address.value,
          gas: Math.floor(gasEstimate * 1.2) // Add 20% buffer
        })
      
      // Update balances after transaction
      await updateBalances()
      
      return {
        success: true,
        txHash: tx.transactionHash,
        blockNumber: tx.blockNumber
      }
    } catch (error) {
      console.error('Error sending tip:', error)
      throw error
    }
  }
  
  const buyTokens = async (ethAmount) => {
    if (!contract.value || !address.value) {
      throw new Error('Wallet chưa kết nối')
    }
    
    try {
      const amountInWei = web3.value.utils.toWei(ethAmount.toString(), 'ether')
      
      const tx = await contract.value.methods
        .buyTokens()
        .send({
          from: address.value,
          value: amountInWei
        })
      
      await updateBalances()
      
      return {
        success: true,
        txHash: tx.transactionHash
      }
    } catch (error) {
      console.error('Error buying tokens:', error)
      throw error
    }
  }
  
  const withdrawEarnings = async () => {
    if (!contract.value || !address.value) {
      throw new Error('Wallet chưa kết nối')
    }
    
    try {
      const tx = await contract.value.methods
        .withdrawEarnings()
        .send({ from: address.value })
      
      await updateBalances()
      
      return {
        success: true,
        txHash: tx.transactionHash
      }
    } catch (error) {
      console.error('Error withdrawing earnings:', error)
      throw error
    }
  }
  
  const getBloggerEarnings = async (bloggerAddress = null) => {
    if (!contract.value) return '0'
    
    try {
      const addr = bloggerAddress || address.value
      const earnings = await contract.value.methods.getBloggerEarnings(addr).call()
      return web3.value.utils.fromWei(earnings, 'ether')
    } catch (error) {
      console.error('Error getting blogger earnings:', error)
      return '0'
    }
  }
  
  const signMessage = async (message) => {
    if (!provider.value || !address.value) {
      throw new Error('Wallet chưa kết nối')
    }
    
    try {
      const signature = await provider.value.request({
        method: 'personal_sign',
        params: [message, address.value]
      })
      
      return signature
    } catch (error) {
      console.error('Error signing message:', error)
      throw error
    }
  }
  
  // Event handlers
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnectWallet()
    } else if (accounts[0] !== address.value) {
      address.value = accounts[0]
      updateBalances()
      toast.info('Tài khoản wallet đã thay đổi')
    }
  }
  
  const handleChainChanged = () => {
    updateNetwork()
    updateBalances()
    toast.info('Mạng blockchain đã thay đổi')
  }
  
  return {
    // State
    isConnected,
    address,
    balance,
    tokenBalance,
    network,
    connecting,
    
    // Getters
    formattedBalance,
    formattedTokenBalance,
    isMetaMaskInstalled,
    
    // Actions
    initializeWallet,
    connectWallet,
    disconnectWallet,
    updateBalances,
    updateNetwork,
    switchToNetwork,
    sendTip,
    buyTokens,
    withdrawEarnings,
    getBloggerEarnings,
    signMessage
  }
})

