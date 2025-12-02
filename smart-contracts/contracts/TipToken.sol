// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title TipToken
 * @dev Token ERC-20 cho hệ thống tip bloggers
 */
contract TipToken is ERC20, ERC20Burnable, Ownable, ReentrancyGuard {
    
    // Mapping để track tips cho từng creator
    mapping(address => uint256) public creatorEarnings;
    
    // Mapping để track tổng tips đã gửi bởi viewer
    mapping(address => uint256) public viewerTotalTips;
    
    // Mapping để track tips từ viewer đến creator cụ thể
    mapping(address => mapping(address => uint256)) public tipHistory;
    
    // Events
    event TipSent(address indexed viewer, address indexed creator, uint256 amount, string videoId);
    event EarningsWithdrawn(address indexed creator, uint256 amount);
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 ethPaid);
    
    // Giá token (1 ETH = 1000 TIP)
    uint256 public tokenPrice = 1e15; // 0.001 ETH per token
    
    constructor(address initialOwner) 
        ERC20("TipToken", "TIP") 
        Ownable(initialOwner) 
    {
        // Mint initial supply cho owner (1 triệu tokens)
        _mint(initialOwner, 1000000 * 10**decimals());
    }
    
    /**
     * @dev Mua tokens bằng ETH
     */
    function buyTokens() external payable nonReentrant {
        require(msg.value > 0, "Phai gui ETH de mua token");
        
        uint256 tokenAmount = (msg.value * 10**decimals()) / tokenPrice;
        require(tokenAmount > 0, "So luong token khong hop le");
        
        _mint(msg.sender, tokenAmount);
        
        emit TokensPurchased(msg.sender, tokenAmount, msg.value);
    }
    
    /**
     * @dev Gửi tip cho creator
     */
    function sendTip(address creator, uint256 amount, string memory videoId) 
        external 
        nonReentrant 
    {
        require(creator != address(0), "Creator address khong hop le");
        require(creator != msg.sender, "Khong the tu tip cho minh");
        require(amount > 0, "So luong tip phai lon hon 0");
        require(balanceOf(msg.sender) >= amount, "Khong du token");
        
        // Transfer tokens từ viewer đến contract
        _transfer(msg.sender, address(this), amount);
        
        // Cập nhật earnings cho creator
        creatorEarnings[creator] += amount;
        
        // Cập nhật tip history
        viewerTotalTips[msg.sender] += amount;
        tipHistory[msg.sender][creator] += amount;
        
        emit TipSent(msg.sender, creator, amount, videoId);
    }
    
    /**
     * @dev Creator rút earnings
     */
    function withdrawEarnings() external nonReentrant {
        uint256 earnings = creatorEarnings[msg.sender];
        require(earnings > 0, "Khong co earnings de rut");
        
        creatorEarnings[msg.sender] = 0;
        
        // Transfer tokens từ contract đến creator
        _transfer(address(this), msg.sender, earnings);
        
        emit EarningsWithdrawn(msg.sender, earnings);
    }
    
    /**
     * @dev Lấy earnings của creator
     */
    function getCreatorEarnings(address creator) external view returns (uint256) {
        return creatorEarnings[creator];
    }
    
    /**
     * @dev Lấy tổng tips đã gửi bởi viewer
     */
    function getViewerTotalTips(address viewer) external view returns (uint256) {
        return viewerTotalTips[viewer];
    }
    
    /**
     * @dev Lấy tip history giữa viewer và creator
     */
    function getTipHistory(address viewer, address creator) external view returns (uint256) {
        return tipHistory[viewer][creator];
    }
    
    /**
     * @dev Owner có thể mint thêm tokens
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @dev Owner có thể thay đổi giá token
     */
    function setTokenPrice(uint256 newPrice) external onlyOwner {
        require(newPrice > 0, "Gia token phai lon hon 0");
        tokenPrice = newPrice;
    }
    
    /**
     * @dev Owner có thể rút ETH từ contract
     */
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "Khong co ETH de rut");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Rut ETH that bai");
    }
    
    /**
     * @dev Nhận ETH
     */
    receive() external payable {}
}