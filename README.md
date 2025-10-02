# Solana Token Explorer

A modern, real-time Solana token monitoring dashboard with secure SOL transfer capabilities.  
Built with **Next.js, TypeScript**, and integrated with a **Go backend** for live blockchain data.

![Solana](https://img.shields.io/badge/Solana-Web3-4E44CE?style=for-square&logo=solana&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?style=for-square&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-3178C6?style=for-square&logo=typescript&logoColor=white)

---

## 🚀 Features

### 🌌 Cosmo - Live Token Feed
- Real-time token discovery from Solana mainnet  
- Live WebSocket connection to Go backend  
- Token metadata display: name, symbol, mint address, logo  
- Auto-reconnection with connection status indicators  
- Modern glass morphism UI with dark theme  

### 💸 SOL Transfer
- Secure SOL transfers via Phantom wallet  
- Real-time USD conversion using CoinGecko API  
- Address validation with proper error handling  
- Transaction signing and confirmation  
- Devnet testing with Helius RPC  

---

## 🛠 Tech Stack

**Frontend**
- Next.js 15.5 with App Router  
- TypeScript for type safety  
- Tailwind CSS for styling  
- Solana Web3.js for blockchain interactions  
- Phantom Wallet Adapter for wallet integration  

**Backend**
- Go WebSocket server  
- Solana RPC connection (Helius)  
- Real-time PumpFun event monitoring  

---

## 📋 Prerequisites
- Node.js 18+  
- Go 1.21+  
- Phantom Wallet browser extension  

---

## ⚡ Quick Start

### 1. Clone and Setup Backend
```bash
git clone <backend-repo-url>
cd trialtask-main

go mod tidy
go run main.go stream.go websocket.go utils.go
```
Backend will run at **http://localhost:8080** with WebSocket at **ws://localhost:8080/connect**.

### 2. Setup and Run Frontend
```bash
git clone <frontend-repo-url>
cd solana-frontend

npm install
npm run dev
```
Frontend will run at **http://localhost:3000**.

---

## 🎯 Usage

### Cosmo Page (`/cosmo`)
- View real-time token creation feed  
- Monitor connection status and token count  

### Transfer Page (`/transfer`)
1. Connect Phantom Wallet  
2. Switch to Devnet (for testing)  
3. Get test SOL from Solana Faucet  
4. Enter transfer details and approve transaction  

---

## 🔧 Configuration

**Environment**
- Backend: Connects to Solana mainnet via Helius RPC  
- Frontend: Uses Devnet RPC for transfers: `https://devnet.helius-rpc.com/`  

**Key Dependencies**
```json
{
  "@solana/web3.js": "^1.87.6",
  "@solana/wallet-adapter-react": "^0.15.32",
  "next": "15.5.4",
  "react": "18.2.0",
  "typescript": "^5.2.2"
}
```

---

## 🎨 Design Features
- Glass Morphism UI with gradients  
- Real-time updates with animations  
- Responsive design  
- Gradient text typography  
- Hover animations  

---

## 🔒 Security Features
- Phantom Wallet integration for signing  
- Address validation  
- Error handling with user-friendly messages  
- Transaction confirmation with explorer links  

---

## 📁 Project Structure
```
solana-frontend/
├── app/
│   ├── page.tsx              # Homepage
│   ├── cosmo/
│   │   └── page.tsx          # Token feed page
│   └── transfer/
│       └── page.tsx          # SOL transfer page
├── components/
│   ├── TokenFeed.tsx         # Real-time token display
│   └── TransferForm.tsx      # SOL transfer form
├── contexts/
│   └── WalletContext.tsx     # Wallet provider
└── types/
    └── index.ts              # TypeScript definitions
```

---

## 🧪 Testing

**Transfer Testing on Devnet**
- Connect Phantom to Devnet  
- Get test SOL  
- Use valid addresses  
- Test small transfers (0.1 SOL)  

**Token Feed Verification**
- Backend shows token creation logs  
- Frontend updates in real-time  
- Status shows "Live"  

---

## 🐛 Troubleshooting

**Wallet Issues**
- Ensure Phantom is installed and unlocked  
- Refresh if connection fails  

**Transaction Failures**
- Check Devnet balance  
- Validate address format  

**WebSocket Disconnections**
- Backend auto-reconnects  
- Verify Go server is running  

---
