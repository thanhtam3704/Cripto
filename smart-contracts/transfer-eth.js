// Script để chuyển Sepolia ETH từ deployer sang blogger
const { ethers } = require('hardhat');
require('dotenv').config();

async function transferETH() {
  try {
    const bloggerAddress = '0xbc2dde37a1afe4eb131b7da63fa82bdb0dcf1ec3';
    const amount = '0.001'; // 0.001 ETH
    
    console.log('💸 Transferring Sepolia ETH...\n');
    
    // Connect to Sepolia with deployer wallet
    const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);
    
    console.log(`From: ${wallet.address}`);
    console.log(`To: ${bloggerAddress}`);
    console.log(`Amount: ${amount} ETH\n`);
    
    // Check deployer balance
    const balance = await provider.getBalance(wallet.address);
    console.log(`Deployer balance: ${ethers.formatEther(balance)} ETH`);
    
    if (parseFloat(ethers.formatEther(balance)) < parseFloat(amount)) {
      console.log('❌ Không đủ ETH để chuyển!');
      return;
    }
    
    // Send transaction
    const tx = await wallet.sendTransaction({
      to: bloggerAddress,
      value: ethers.parseEther(amount)
    });
    
    console.log(`\n⏳ Transaction sent: ${tx.hash}`);
    console.log('Waiting for confirmation...');
    
    await tx.wait();
    
    console.log('✅ Transfer successful!');
    console.log(`🔗 https://sepolia.etherscan.io/tx/${tx.hash}`);
    
    // Check new balance
    const newBalance = await provider.getBalance(bloggerAddress);
    console.log(`\nBlogger new balance: ${ethers.formatEther(newBalance)} ETH`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

transferETH();
// cd smart-contracts; node transfer-eth.j