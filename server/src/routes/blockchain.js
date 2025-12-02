const express = require('express');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { ResponseHelper } = require('../utils/response');
const blockchainService = require('../utils/blockchain');

const router = express.Router();

// GET /api/blockchain/status - Kiểm tra trạng thái blockchain
router.get('/status', async (req, res) => {
  try {
    const status = await blockchainService.checkConnection();
    
    return ResponseHelper.success(res, {
      blockchain: status,
      contract: {
        loaded: !!blockchainService.contract,
        address: process.env.CONTRACT_ADDRESS || null
      },
      network: {
        rpcUrl: process.env.ETHEREUM_RPC_URL ? 'Configured' : 'Not configured'
      }
    }, 'Trạng thái blockchain');
    
  } catch (error) {
    console.error('Blockchain status error:', error);
    return ResponseHelper.serverError(res, 'Lỗi kiểm tra blockchain', error);
  }
});

// GET /api/blockchain/balance/:address - Lấy số dư token
router.get('/balance/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return ResponseHelper.error(res, 'Wallet address không hợp lệ', 400);
    }
    
    const balance = await blockchainService.getTokenBalance(address);
    
    return ResponseHelper.success(res, {
      address,
      balance,
      symbol: 'TIP'
    }, 'Lấy số dư thành công');
    
  } catch (error) {
    console.error('Get balance error:', error);
    return ResponseHelper.serverError(res, 'Lỗi lấy số dư', error);
  }
});

// GET /api/blockchain/earnings/:address - Lấy earnings của creator
router.get('/earnings/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      return ResponseHelper.error(res, 'Wallet address không hợp lệ', 400);
    }
    
    const earnings = await blockchainService.getCreatorEarnings(address);
    
    return ResponseHelper.success(res, {
      address,
      earnings,
      symbol: 'TIP'
    }, 'Lấy earnings thành công');
    
  } catch (error) {
    console.error('Get earnings error:', error);
    return ResponseHelper.serverError(res, 'Lỗi lấy earnings', error);
  }
});

// GET /api/blockchain/transaction/:txHash - Lấy thông tin transaction
router.get('/transaction/:txHash', async (req, res) => {
  try {
    const { txHash } = req.params;
    
    if (!txHash.match(/^0x[a-fA-F0-9]{64}$/)) {
      return ResponseHelper.error(res, 'Transaction hash không hợp lệ', 400);
    }
    
    const txData = await blockchainService.getTransaction(txHash);
    
    return ResponseHelper.success(res, txData, 'Lấy thông tin transaction thành công');
    
  } catch (error) {
    console.error('Get transaction error:', error);
    return ResponseHelper.serverError(res, 'Lỗi lấy thông tin transaction', error);
  }
});

// GET /api/blockchain/token-price - Lấy giá token
router.get('/token-price', async (req, res) => {
  try {
    const price = await blockchainService.getTokenPrice();
    
    return ResponseHelper.success(res, {
      price,
      symbol: 'TIP',
      unit: 'ETH',
      description: `1 TIP = ${price} ETH`
    }, 'Lấy giá token thành công');
    
  } catch (error) {
    console.error('Get token price error:', error);
    return ResponseHelper.serverError(res, 'Lỗi lấy giá token', error);
  }
});

// POST /api/blockchain/verify-tip - Xác minh tip transaction
router.post('/verify-tip', async (req, res) => {
  try {
    const { txHash, fromAddress, toAddress, amount } = req.body;
    
    if (!txHash || !fromAddress || !toAddress || !amount) {
      return ResponseHelper.error(res, 'Thiếu thông tin xác minh', 400);
    }
    
    const verification = await blockchainService.verifyTipTransaction(
      txHash,
      fromAddress,
      toAddress,
      amount
    );
    
    return ResponseHelper.success(res, verification, 'Xác minh transaction thành công');
    
  } catch (error) {
    console.error('Verify tip error:', error);
    return ResponseHelper.serverError(res, 'Lỗi xác minh transaction', error);
  }
});

module.exports = router;