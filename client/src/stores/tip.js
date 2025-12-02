import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'
import { useWalletStore } from '@/stores/wallet'

export const useTipStore = defineStore('tip', () => {
  // State
  const tips = ref([])
  const receivedTips = ref([])
  const sentTips = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Actions
  const sendTip = async (tipData) => {
    const walletStore = useWalletStore()
    
    try {
      loading.value = true
      error.value = null
      
      // Validate wallet connection
      if (!walletStore.isConnected) {
        throw new Error('Wallet chưa được kết nối')
      }
      
      // Validate balance
      if (parseFloat(walletStore.balance) < tipData.amount) {
        throw new Error('Số dư không đủ')
      }
      
      // Call backend API to initiate blockchain transaction
      const response = await api.post('/tips/send', {
        videoId: tipData.videoId,
        bloggerId: tipData.bloggerId,
        amount: tipData.amount,
        message: tipData.message,
        isAnonymous: tipData.isAnonymous,
        fromAddress: tipData.fromAddress,
        toAddress: tipData.toAddress
      })
      
      if (response.data.success) {
        // Add to local state
        sentTips.value.push({
          ...tipData,
          id: response.data.tipId,
          transactionHash: response.data.transactionHash,
          createdAt: new Date().toISOString()
        })
        
        return {
          success: true,
          tipId: response.data.tipId,
          transactionHash: response.data.transactionHash
        }
      } else {
        throw new Error(response.data.error || 'Giao dịch thất bại')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Lỗi gửi tip'
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }
  
  const fetchReceivedTips = async (bloggerId) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get(`/tips/received/${bloggerId}`)
      receivedTips.value = response.data.tips
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi tải tips nhận được'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const fetchSentTips = async (userId) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get(`/tips/sent/${userId}`)
      sentTips.value = response.data.tips
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi tải tips đã gửi'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const fetchVideoTips = async (videoId) => {
    try {
      const response = await api.get(`/tips/video/${videoId}`)
      return response.data.tips
    } catch (err) {
      console.error('Error fetching video tips:', err)
      return []
    }
  }
  
  const getTipHistory = async (userId, type = 'all') => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.get(`/tips/history/${userId}`, {
        params: { type }
      })
      
      return response.data.tips
    } catch (err) {
      error.value = err.response?.data?.message || 'Lỗi tải lịch sử tip'
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const withdrawEarnings = async (amount, walletAddress) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await api.post('/tips/withdraw', {
        amount,
        walletAddress
      })
      
      if (response.data.success) {
        return {
          success: true,
          transactionHash: response.data.transactionHash
        }
      } else {
        throw new Error(response.data.error || 'Rút tiền thất bại')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Lỗi rút tiền'
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }
  
  const getTipStats = async (userId) => {
    try {
      const response = await api.get(`/tips/stats/${userId}`)
      return response.data.stats
    } catch (err) {
      console.error('Error fetching tip stats:', err)
      return {
        totalReceived: 0,
        totalSent: 0,
        totalWithdrawn: 0,
        availableBalance: 0
      }
    }
  }
  
  const buyTokens = async (ethAmount) => {
    const walletStore = useWalletStore()
    
    try {
      loading.value = true
      error.value = null
      
      if (!walletStore.isConnected) {
        throw new Error('Wallet chưa được kết nối')
      }
      
      // Call smart contract to buy tokens
      const response = await api.post('/blockchain/buy-tokens', {
        ethAmount,
        walletAddress: walletStore.address
      })
      
      if (response.data.success) {
        // Update wallet balance
        await walletStore.updateBalances()
        
        return {
          success: true,
          transactionHash: response.data.transactionHash,
          tokensReceived: response.data.tokensReceived
        }
      } else {
        throw new Error(response.data.error || 'Mua token thất bại')
      }
    } catch (err) {
      error.value = err.response?.data?.message || err.message || 'Lỗi mua token'
      return {
        success: false,
        error: error.value
      }
    } finally {
      loading.value = false
    }
  }
  
  const getTransactionStatus = async (transactionHash) => {
    try {
      const response = await api.get(`/blockchain/transaction/${transactionHash}`)
      return response.data
    } catch (err) {
      console.error('Error getting transaction status:', err)
      return { status: 'unknown' }
    }
  }

  return {
    // State
    tips,
    receivedTips,
    sentTips,
    loading,
    error,
    
    // Actions
    sendTip,
    fetchReceivedTips,
    fetchSentTips,
    fetchVideoTips,
    getTipHistory,
    withdrawEarnings,
    getTipStats,
    buyTokens,
    getTransactionStatus
  }
})

