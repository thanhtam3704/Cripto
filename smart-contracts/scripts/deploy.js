const hre = require("hardhat");
const fs = require('fs');
const path = require('path');

async function main() {
  console.log("🚀 Bắt đầu deploy TipToken contract...");
  
  // Lấy deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts với account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy TipToken contract
  const TipToken = await hre.ethers.getContractFactory("TipToken");
  const tipToken = await TipToken.deploy(deployer.address);
  
  await tipToken.waitForDeployment();
  const contractAddress = await tipToken.getAddress();
  
  console.log("✅ TipToken deployed to:", contractAddress);
  
  // Lưu contract address và ABI
  const contractInfo = {
    address: contractAddress,
    deployer: deployer.address,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };
  
  // Tạo thư mục deployments nếu chưa có
  const deploymentsDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  // Lưu contract info
  fs.writeFileSync(
    path.join(deploymentsDir, `TipToken-${hre.network.name}.json`),
    JSON.stringify(contractInfo, null, 2)
  );
  
  // Copy ABI để sử dụng trong frontend/backend
  const artifactPath = path.join(__dirname, '../artifacts/contracts/TipToken.sol/TipToken.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  
  fs.writeFileSync(
    path.join(deploymentsDir, 'TipToken-ABI.json'),
    JSON.stringify(artifact.abi, null, 2)
  );
  
  console.log("📄 Contract info và ABI đã được lưu trong thư mục deployments/");
  
  // Verify contract trên Etherscan (nếu không phải local network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("⏳ Đợi 30 giây trước khi verify...");
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [deployer.address],
      });
      console.log("✅ Contract đã được verify trên Etherscan");
    } catch (error) {
      console.log("❌ Verify thất bại:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deploy thất bại:", error);
    process.exit(1);
  });