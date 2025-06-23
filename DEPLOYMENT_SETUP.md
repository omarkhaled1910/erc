# ERC-20 Contract Deployment Setup

This guide will help you set up the ERC-20 contract deployment system for the Sepolia testnet.

## Prerequisites

- Node.js 18+ installed
- A wallet with Sepolia ETH for gas fees
- An Infura or Alchemy account for RPC access

## Environment Variables Setup

Create a `.env.local` file in your project root with the following variables:

```env
# Sepolia RPC URL (from Infura or Alchemy)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
# or
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY

# Deployer private key (without 0x prefix)
PRIVATE_KEY=your_deployer_private_key_here

# WalletConnect Project ID
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### Getting the Required Values

#### 1. Sepolia RPC URL

- **Infura**: Go to [infura.io](https://infura.io), create an account, create a new project, and copy the Sepolia endpoint URL
- **Alchemy**: Go to [alchemy.com](https://alchemy.com), create an account, create a new app, and copy the Sepolia HTTP URL

#### 2. Deployer Private Key

- Create a new wallet specifically for deployment (never use your main wallet's private key)
- You can use MetaMask to create a new account and export the private key
- Make sure this wallet has some Sepolia ETH for gas fees

#### 3. WalletConnect Project ID

- Go to [cloud.walletconnect.com](https://cloud.walletconnect.com)
- Create a new project and copy the Project ID

## Getting Sepolia ETH

You'll need Sepolia ETH in your deployer wallet to pay for gas fees:

1. **Sepolia Faucet**: Visit [sepoliafaucet.com](https://sepoliafaucet.com) or [sepolia-faucet.pk910.de](https://sepolia-faucet.pk910.de)
2. **Alchemy Faucet**: If using Alchemy, they provide a faucet in their dashboard
3. **Infura Faucet**: Some Infura plans include faucet access

## Installation

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Deploying an ERC-20 Contract

1. Navigate to the "Deploy Contract" page in the sidebar
2. Connect your wallet using the RainbowKit connect button
3. Ensure you're connected to the Sepolia testnet
4. Fill in the token details:
    - **Token Name**: The full name of your token (e.g., "My Awesome Token")
    - **Token Symbol**: The short symbol (e.g., "MAT")
    - **Token Decimals**: Number of decimal places (usually 18)
    - **Initial Supply**: Total number of tokens to mint initially
5. Click "Deploy ERC-20 Contract"
6. Wait for the deployment to complete
7. Copy the contract address and transaction hash

### Interacting with Deployed Contracts

1. After deployment, click "Interact with Contract" to go to the ERC-20 interaction page
2. The contract address will be pre-filled
3. Use the various functions to interact with your token

## Security Considerations

### Important Security Notes

1. **Never commit private keys to version control**

    - The `.env.local` file should be in your `.gitignore`
    - Never share your private keys

2. **Use a dedicated deployment wallet**

    - Create a separate wallet for deployments
    - Only keep enough ETH for gas fees in this wallet

3. **Test thoroughly on Sepolia**

    - Always test your contracts on testnet before mainnet
    - Verify all functionality works as expected

4. **Environment variable validation**
    - The application validates that all required environment variables are present
    - Missing variables will cause the app to fail on startup

## Troubleshooting

### Common Issues

1. **"Insufficient ETH for deployment gas fees"**

    - Make sure your deployer wallet has Sepolia ETH
    - Get more from a faucet

2. **"Network connectivity issue"**

    - Check your RPC URL is correct
    - Ensure your Infura/Alchemy account is active

3. **"Invalid user address format"**

    - Make sure the wallet is properly connected
    - The address should be a valid Ethereum address

4. **"Transaction nonce error"**
    - This usually resolves itself on retry
    - If persistent, check your deployer wallet's transaction history

### Getting Help

- Check the browser console for detailed error messages
- Verify all environment variables are set correctly
- Ensure you have sufficient Sepolia ETH in your deployer wallet

## Contract Details

### ERC-20 Features

The deployed contract includes standard ERC-20 functionality:

- Transfer tokens between addresses
- Approve and transferFrom for delegated transfers
- Balance and allowance queries
- Mint and burn functions (owner only)
- Blacklist functionality (owner only)
- Role-based access control

### Constructor Parameters

The contract constructor takes:

- `name`: Token name (string)
- `symbol`: Token symbol (string)
- `decimals`: Number of decimal places (uint8)
- `totalSupply`: Initial token supply (uint256)
- `owner`: Initial contract owner (address)

## Next Steps

After successful deployment:

1. **Verify your contract** on Sepolia Etherscan
2. **Test all functionality** using the interaction page
3. **Document your contract** address and ABI
4. **Consider upgrading** to mainnet when ready

## Support

For issues or questions:

- Check the troubleshooting section above
- Review the console logs for detailed error messages
- Ensure all prerequisites are met
