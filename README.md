# 🔗 CryptoTip - Decentralized Blog Tipping Platform


---

## 📑 Mục lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Công nghệ](#-công-nghệ)
- [Kiến trúc](#-kiến-trúc)
- [Cài đặt](#-cài-đặt)
- [Sử dụng](#-sử-dụng)
- [Smart Contract](#-smart-contract)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Giới thiệu

**CryptoTip** là một nền tảng blog phi tập trung kết hợp giữa việc tạo nội dung và blockchain technology. Dự án cho phép:

- 📝 **Bloggers** viết và chia sẻ bài viết
- 💰 **Readers** ủng hộ tác giả bằng TIP tokens
- 🔐 **Giao dịch minh bạch** trên blockchain Ethereum
- 💳 **Rút tiền nhanh chóng** về ví cá nhân

### Vấn đề giải quyết

- ❌ Hệ thống tip truyền thống phụ thuộc vào trung gian (phí cao, chậm)
- ❌ Thiếu minh bạch trong việc phân phối thu nhập
- ❌ Blogger khó kiểm soát earnings
- ❌ Cross-border payments phức tạp

### Giải pháp

- ✅ **Decentralized**: Không cần trung gian, giao dịch P2P
- ✅ **Transparent**: Mọi giao dịch được ghi lại trên blockchain
- ✅ **Instant**: Rút tiền bất kỳ lúc nào
- ✅ **Global**: Không giới hạn địa lý, không conversion fees

---

## ✨ Tính năng

### 🔐 Authentication & Authorization

- ✅ Đăng ký/Đăng nhập với email
- ✅ Email verification
- ✅ JWT authentication
- ✅ Google OAuth integration
- ✅ Role-based access control (Reader/Blogger/Admin)

### 📝 Blog Management

- ✅ Rich text editor (TipTap)
- ✅ Image upload (Cloudinary)
- ✅ Categories & tags
- ✅ Draft/Published status
- ✅ Reading time estimation
- ✅ View counter
- ✅ Like/Unlike articles
- ✅ Search & filter

### 💰 Blockchain Integration

- ✅ **TIP Token (ERC-20)** trên Sepolia testnet
- ✅ Mua TIP tokens bằng ETH (1 ETH = 1,000 TIP)
- ✅ Gửi tip cho bloggers với message
- ✅ Blogger rút earnings về ví
- ✅ Real-time balance updates
- ✅ Transaction history
- ✅ Earnings analytics với charts

### 👤 User Profile

- ✅ Profile customization
- ✅ Avatar upload
- ✅ Bio & social links
- ✅ Wallet integration (MetaMask)
- ✅ Following/Followers system
- ✅ Activity feed

### 📊 Dashboard

#### Reader Dashboard
- Bài viết đã đọc
- Lịch sử tips đã gửi
- Following bloggers
- Reading statistics

#### Blogger Dashboard
- Quản lý bài viết
- Earnings overview
- Tips received với chart
- Withdraw earnings
- Article analytics

### 🔔 Notifications

- Real-time notifications (Socket.io)
- New follower alerts
- Tip received notifications
- Comment mentions

---

## 🛠 Công nghệ

### Frontend

| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **Vue 3** | 3.4.0 | Progressive JavaScript Framework |
| **Vite** | 5.0.0 | Build tool & dev server |
| **Pinia** | 2.1.0 | State management |
| **Vue Router** | 4.2.0 | Routing |
| **Tailwind CSS** | 3.4.0 | Utility-first CSS |
| **Ethers.js** | 6.15.0 | Ethereum library |
| **TipTap** | 2.1.0 | Rich text editor |
| **Chart.js** | 4.4.0 | Data visualization |
| **Axios** | 1.6.0 | HTTP client |
| **Socket.io Client** | 4.6.0 | Real-time communication |

### Backend

| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **Node.js** | 18+ | JavaScript runtime |
| **Express** | 4.18.0 | Web framework |
| **MongoDB** | 6.0+ | NoSQL database |
| **Mongoose** | 8.0.0 | MongoDB ODM |
| **JWT** | 9.0.0 | Authentication |
| **Passport** | 0.7.0 | Auth strategies |
| **Nodemailer** | 6.9.0 | Email sending |
| **Socket.io** | 4.6.0 | WebSocket server |
| **Cloudinary** | 1.41.0 | Image hosting |

### Blockchain

| Công nghệ | Version | Mục đích |
|-----------|---------|----------|
| **Solidity** | 0.8.20 | Smart contract language |
| **Hardhat** | 2.22.0 | Ethereum development |
| **OpenZeppelin** | 5.0.0 | Secure contracts |
| **Ethers.js** | 6.15.0 | Contract interaction |
| **MetaMask** | Latest | Web3 wallet |

### DevOps & Tools

- **Git** - Version control
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Hardhat** - Smart contract testing
- **Postman** - API testing

---

## 🏗 Kiến trúc

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENT (Vue 3)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │   Pages      │  │  Components  │  │   Services           │ │
│  │  - Home      │  │  - Navbar    │  │  - API Service       │ │
│  │  - Blog      │  │  - BlogCard  │  │  - Blockchain Service│ │
│  │  - Profile   │  │  - TipButton │  │  - Auth Service      │ │
│  │  - Dashboard │  │  - Wallet    │  │                      │ │
│  └──────────────┘  └──────────────┘  └──────────────────────┘ │
│                           │                                      │
│                  ┌────────┴────────┐                           │
│                  │  Pinia Store    │                           │
│                  │  - auth         │                           │
│                  │  - blog         │                           │
│                  │  - wallet       │                           │
│                  └─────────────────┘                           │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                ┌───────────┼───────────┐
                │           │           │
        ┌───────▼──────┐  ┌▼───────────▼┐
        │   MetaMask   │  │   Backend    │
        │   (Wallet)   │  │  (Node.js)   │
        └───────┬──────┘  └┬───────────┬─┘
                │           │           │
                │      ┌────▼────┐  ┌───▼─────┐
                │      │ MongoDB │  │ Socket  │
                │      └─────────┘  └─────────┘
                │
        ┌───────▼────────────┐
        │   Smart Contract   │
        │   TipToken.sol     │
        │  (Sepolia Testnet) │
        └────────────────────┘
```

### Data Flow

#### 1. Mua TIP Tokens
```
User → BuyTokensModal → Blockchain Service → MetaMask
  → Smart Contract (buyTokens) → Mint TIP → User Wallet
```

#### 2. Gửi Tip
```
Reader → Blog Detail → TipButton → Smart Contract (sendTip)
  → Transfer TIP to Contract → Update creatorEarnings
  → Backend API → Save Transaction → Socket Notification
  → Blogger receives alert
```

#### 3. Rút Earnings
```
Blogger → Dashboard → Withdraw Button → Smart Contract (withdrawEarnings)
  → Transfer TIP to Blogger → Reset earnings → Update UI
```

---

## 🚀 Cài đặt

### Yêu cầu hệ thống

- **Node.js** >= 18.0.0
- **MongoDB** >= 6.0
- **MetaMask** browser extension
- **Sepolia ETH** for testnet (get from [faucet](https://sepoliafaucet.com/))

### 1. Clone repository

```bash
git clone https://github.com/thanhtam3704/Cripto.git
cd Cripto
```

### 2. Cài đặt dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

#### Smart Contracts
```bash
cd smart-contracts
npm install
```

### 3. Cấu hình Environment Variables

#### Backend (server/.env)
```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/cryptotip

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email (Gmail)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
CLIENT_URL=http://localhost:5173

# Blockchain
ETHEREUM_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
CONTRACT_ADDRESS=0x616e607040e7d058D2fE90F70840306734857DF7
PRIVATE_KEY=your_private_key_here
```

#### Frontend (client/.env)
```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000

# Blockchain
VITE_ETHEREUM_NETWORK=sepolia
VITE_CONTRACT_ADDRESS=0x616e607040e7d058D2fE90F70840306734857DF7
VITE_CHAIN_ID=11155111

# Cloudinary
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

#### Smart Contracts (smart-contracts/.env)
```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=your_deployer_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 4. Khởi động MongoDB

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### 5. Deploy Smart Contract (nếu chưa có)

```bash
cd smart-contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

Contract đã được deploy tại: `0x616e607040e7d058D2fE90F70840306734857DF7`

### 6. Chạy ứng dụng

#### Terminal 1 - Backend
```bash
cd server
npm run dev
```
Server chạy tại: http://localhost:3000

#### Terminal 2 - Frontend
```bash
cd client
npm run dev
```
Client chạy tại: http://localhost:5173

### 7. Cấu hình MetaMask

1. Cài đặt [MetaMask extension](https://metamask.io/)
2. Thêm Sepolia testnet:
   - Network Name: Sepolia
   - RPC URL: https://sepolia.infura.io/v3/YOUR_KEY
   - Chain ID: 11155111
   - Currency Symbol: ETH
3. Get test ETH từ [Sepolia Faucet](https://sepoliafaucet.com/)

---

## 📖 Sử dụng

### Cho Readers

#### 1. Đăng ký tài khoản
```
Trang chủ → Register → Nhập email/password → Verify email → Login
```

#### 2. Mua TIP Tokens
```
Profile → Wallet Section → Connect MetaMask → Buy Tokens
→ Nhập số ETH → Confirm → Nhận TIP
```

#### 3. Tip cho Blogger
```
Blog List → Chọn bài viết → Scroll down → Tip Section
→ Nhập số TIP + message → Send Tip → Confirm MetaMask
```

### Cho Bloggers

#### 1. Nâng cấp lên Blogger
```
Profile → Upgrade to Blogger → Nhập thông tin → Confirm
```

#### 2. Viết bài
```
Dashboard → Write Blog → Rich text editor → Upload cover image
→ Add tags → Publish
```

#### 3. Rút earnings
```
Dashboard → Blockchain Earnings → Connect Wallet
→ View available earnings → Withdraw → Confirm MetaMask
```

---

## 📜 Smart Contract

### TipToken.sol

**Contract Address**: `0x616e607040e7d058D2fE90F70840306734857DF7` (Sepolia)

**Verified on Etherscan**: [View Contract](https://sepolia.etherscan.io/address/0x616e607040e7d058D2fE90F70840306734857DF7)

#### Main Functions

```solidity
// Mua tokens bằng ETH
function buyTokens() external payable

// Gửi tip cho creator
function sendTip(address creator, uint256 amount, string memory blogId) external

// Rút earnings
function withdrawEarnings() external

// Xem earnings
function getCreatorEarnings(address creator) external view returns (uint256)

// Xem total tips đã gửi
function getViewerTotalTips(address viewer) external view returns (uint256)
```

#### Events

```solidity
event TokensPurchased(address indexed buyer, uint256 amount, uint256 ethPaid);
event TipSent(address indexed tipper, address indexed creator, uint256 amount, string blogId);
event EarningsWithdrawn(address indexed creator, uint256 amount);
```

#### Token Details

- **Name**: TipToken
- **Symbol**: TIP
- **Decimals**: 18
- **Standard**: ERC-20
- **Price**: 1 ETH = 1,000 TIP (0.001 ETH = 1 TIP)

---

## 🔌 API Documentation

### Authentication

#### POST /api/auth/register
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123!"
}
```

#### POST /api/auth/login
```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

### Blogs

#### GET /api/blogs
Query params: `?page=1&limit=12&category=technology&sort=latest`

#### POST /api/blogs
```json
{
  "title": "My First Blog",
  "content": "<p>Content here...</p>",
  "coverImage": "https://...",
  "category": "technology",
  "tags": ["vue", "blockchain"]
}
```

#### GET /api/blogs/:id
Get single blog with author info

### Tips

#### POST /api/tips/:blogId
```json
{
  "txHash": "0xabc123...",
  "amount": 10,
  "message": "Great article!"
}
```

#### GET /api/tips/received
Get tips received (blogger only)

#### GET /api/tips/sent
Get tips sent (reader only)

#### GET /api/tips/stats
Get platform statistics (public)

### Users

#### GET /api/users/profile/:id
Get user profile

#### PUT /api/users/profile
Update profile

#### GET /api/users/bloggers
Get featured bloggers

---

## 📸 Screenshots

### Home Page
![Home](docs/screenshots/home.png)

### Blog Detail với Tip Section
![Blog Detail](docs/screenshots/blog-detail.png)

### Wallet Section
![Wallet](docs/screenshots/wallet.png)

### Blogger Dashboard
![Dashboard](docs/screenshots/dashboard.png)

### Buy Tokens Modal
![Buy Tokens](docs/screenshots/buy-tokens.png)

---

## 🗺 Roadmap

### Phase 1: MVP ✅ (Completed)
- [x] User authentication & authorization
- [x] Blog CRUD operations
- [x] Smart contract deployment
- [x] Blockchain integration
- [x] Tip functionality
- [x] Withdraw earnings
- [x] Basic UI/UX

### Phase 2: Enhancement 🚧 (In Progress)
- [ ] Comment system
- [ ] Advanced search & filters
- [ ] Email notifications
- [ ] Social sharing
- [ ] Mobile responsive improvements
- [ ] Performance optimization

### Phase 3: Advanced Features 📋 (Planned)
- [ ] NFT badges for top supporters
- [ ] Subscription with TIP tokens
- [ ] Referral program
- [ ] Multi-language support
- [ ] Dark mode
- [ ] Advanced analytics

### Phase 4: Scaling 🎯 (Future)
- [ ] Deploy to Ethereum Mainnet
- [ ] Multi-chain support (Polygon, BSC)
- [ ] Layer 2 integration
- [ ] Mobile app (React Native)
- [ ] Token staking
- [ ] DAO governance

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Keep PRs focused and small

---

## 🐛 Bug Reports

Found a bug? Please open an issue with:

- Clear title and description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

- **Developer**: [Thanh Tam](https://github.com/thanhtam3704)
- **Email**: ttam37444@gmail.com

---

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) - Secure smart contract library
- [Hardhat](https://hardhat.org/) - Ethereum development environment
- [Vue.js](https://vuejs.org/) - Progressive JavaScript framework
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Ethers.js](https://docs.ethers.org/) - Ethereum library

---

## 📞 Support

Need help? Contact us:

- **Email**: ttam37444@gmail.com
- **GitHub Issues**: [Create an issue](https://github.com/thanhtam3704/Cripto/issues)

---

## 🌟 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=thanhtam3704/Cripto&type=Date)](https://star-history.com/#thanhtam3704/Cripto&Date)

---

<div align="center">

**Made with ❤️ and ☕ by Thanh Tam**

[⬆ Back to top](#-cryptotip---decentralized-blog-tipping-platform)

</div>
