/**
 * Format blockchain error messages to be user-friendly
 * @param {Error} error - The error object from ethers.js or MetaMask
 * @returns {string} - User-friendly error message
 */
export function formatBlockchainError(error) {
  // Get error message
  const message = error.message || error.toString();
  
  // Check for specific error types
  if (message.includes('insufficient funds')) {
    return '❌ Không đủ ETH để trả phí gas. Vui lòng nạp thêm Sepolia ETH.';
  }
  
  if (message.includes('user rejected') || message.includes('User denied')) {
    return '⚠️ Bạn đã từ chối giao dịch.';
  }
  
  if (message.includes('Khong du token')) {
    return '❌ Không đủ TIP tokens. Vui lòng mua thêm token.';
  }
  
  if (message.includes('execution reverted')) {
    // Try to extract revert reason
    const revertMatch = message.match(/reason="([^"]+)"/);
    if (revertMatch) {
      return `❌ Giao dịch bị từ chối: ${revertMatch[1]}`;
    }
    return '❌ Giao dịch bị từ chối bởi smart contract.';
  }
  
  if (message.includes('network changed') || message.includes('chain mismatch')) {
    return '⚠️ Vui lòng chuyển sang Sepolia Test Network trong MetaMask.';
  }
  
  if (message.includes('timeout') || message.includes('Timeout')) {
    return '⏱️ Giao dịch timeout. Vui lòng thử lại.';
  }
  
  if (message.includes('nonce')) {
    return '⚠️ Lỗi nonce. Vui lòng reset account trong MetaMask (Settings → Advanced → Clear activity).';
  }
  
  if (message.includes('gas')) {
    return '⛽ Lỗi gas. Vui lòng thử lại với gas cao hơn.';
  }
  
  // Default: Return shortened error
  // Only show first 100 characters
  const shortMessage = message.length > 100 
    ? message.substring(0, 100) + '...' 
    : message;
    
  return `❌ Lỗi: ${shortMessage}`;
}

/**
 * Show blockchain error toast with formatted message
 * @param {Function} toast - Vue toast function
 * @param {Error} error - The error object
 * @param {string} defaultMessage - Default message if error is unknown
 */
export function showBlockchainError(toast, error, defaultMessage = 'Có lỗi xảy ra') {
  const message = error.message || error.toString();
  
  // Handle user rejection as info, not error
  if (message.includes('user rejected') || 
      message.includes('User denied') || 
      error.code === 'ACTION_REJECTED' || 
      error.code === 4001) {
    toast.info('❌ Bạn đã hủy giao dịch');
    console.log('User cancelled transaction');
    return;
  }
  
  // Handle other errors normally
  const formattedError = formatBlockchainError(error);
  toast.error(formattedError);
  
  // Log full error to console for debugging
  console.error('Blockchain error:', error);
}
