# Offramps by fiatsend: Easy Web3 offramp and settlement solution

![fsWallet Logo](./public//favicon.ico)

## Overview

offramps by fiatsend is a decentralized app that allows users to mint their mobile account as a SBT NFT which is used to identify users mobile account when they offramp or send stablecoins directly to fiatsend.eth.

##Features:

- NFT Mint
- Account Verification
- Transfer
- Settings
- Rewards
- Liquidity Pools

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **Decentralized Identity (DID) Integration:** Ensures secure and private user authentication using Web5 DID protocols.
- **Cross-Border Transfers:** Enables seamless transfers between different African countries using TBDex protocol.
- **Low Transaction Fees:** Built to minimize transaction costs, making it accessible to a wider audience.
- **Multi-Currency Support:** Supports multiple African currencies (e.g., GHS) and digital currencies (e.g., USDC) to facilitate local and international transactions.
- **User-Friendly Interface:** Designed with simplicity and ease of use in mind, catering to users of all technical levels.
- **Portable DID Management:** Allows users to create, export, and manage their Decentralized Identifiers.
- **PFI Comparison:** Allows users to compare offerings from multiple PFIs.
- **Rating System:** Enables users to rate and review PFIs based on their experience.
- **Secure Credential Storage:** Safely stores and manages users' Verifiable Credentials.

## Technology Stack

- **Frontend:** React, TypeScript, Next.js
- **State Management:** Redux Toolkit
- **Blockchain:** Lisk, Solidity
- **Styling:** Tailwind CSS
- **Build Tools:** Next.js built-in tooling
- **Package Management:** yarn

## Installation & Usage

To run this project locally, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/fiatsend/offramp.git
   cd offramp
   ```

2. **Install dependencies:**

   ```bash
   yarn install
   ```

3. **Run the development server:**

   ```bash
   yarn run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

/fiatsend-frontend
│
├── /public
│ └── /assets (Images, logos, icons, etc.)
│
├── /src
│ ├── /abis (Smart contract ABIs)
│ │ └── contractName.json
│ │
│ ├── /components (Reusable UI components)
│ │ ├── /forms (Form-specific components)
│ │ ├── /modals (Reusable modal components)
│ │ ├── /navigation (Navbar, Sidebar, etc.)
│ │ └── /shared (Buttons, Inputs, Cards, etc.)
│ │
│ ├── /features (Redux feature slices)
│ │ ├── authSlice.ts (Authentication state)
│ │ ├── transactionSlice.ts (Transaction signing and tracking state)
│ │ └── otherFeatureSlice.ts
│ │
│ ├── /hooks (Custom React hooks)
│ │ ├── /auth (Hooks for authentication logic)
│ │ └── /web3 (Hooks for blockchain interactions)
│ │ ├── useWallet.ts
│ │ ├── useContract.ts
│ │ └── useTransaction.ts
│ │
│ ├── /layouts (Reusable layout components)
│ │ ├── /MainLayout.tsx
│ │ └── /AuthLayout.tsx
│ │
│ ├── /middleware (Middleware logic for Redux or authentication)
│ │ ├── authMiddleware.ts (Ensures authenticated state)
│ │ └── transactionMiddleware.ts (Processes signed transactions)
│ │
│ ├── /pages (Next.js pages directory)
│ │ ├── /api (API routes)
│ │ ├── /auth (Authentication-related pages)
│ │ │ ├── login.tsx
│ │ │ └── signup.tsx
│ │ ├── /dashboard (Authenticated user dashboard)
│ │ │ ├── index.tsx
│ │ │ └── exchange.tsx
│ │ └── index.tsx (Landing page)
│ │
│ ├── /redux (Redux store configuration)
│ │ ├── store.ts (Configure store with middleware and slices)
│ │ └── rootReducer.ts (Combine reducers)
│ │
│ ├── /services (Business logic, API calls, and blockchain services)
│ │ ├── apiService.ts (API interaction logic)
│ │ ├── transactionService.ts (Transaction signing logic)
│ │ └── walletService.ts (Wallet connection and signing helpers)
│ │
│ ├── /styles (Tailwind CSS and other styles)
│ │ ├── /globals.css
│ │ └── /theme.js
│ │
│ ├── /types (TypeScript type definitions)
│ │ ├── auth.d.ts (Types for authentication)
│ │ ├── transactions.d.ts (Types for transactions)
│ │ ├── redux.d.ts (Types for Redux state)
│ │ └── web3.d.ts (Types for Web3 interactions)
│ │
│ ├── /utils (Utility functions)
│ │ ├── api.ts (API helpers)
│ │ ├── constants.ts (App-wide constants)
│ │ ├── helpers.ts (General helpers)
│ │ └── validators.ts (Input validation utilities)
│ │
│ ├── /views (Page-specific components and logic)
│ │ ├── /HomeView.tsx (Landing page components and logic)
│ │ ├── /DashboardView.tsx (Dashboard components and logic)
│ │ └── /ExchangeView.tsx (Exchange page components and logic)
│ │
│ ├── /config (Configuration files)
│ │ ├── network.ts (Blockchain network configurations)
│ │ ├── reduxConfig.ts (Redux DevTools and middleware setup)
│ │ └── web3.ts (Web3 or ethers.js setup)
│ │
│ └── app.tsx (Main entry file for the app)
│
├── .env.local (Environment variables)
├── next.config.js
├── postcss.config.js
├── tailwind.config.js
└── package.json

## Key Components

- `account-slice.ts`: Manages account information and settings.
- `offramp-slice.ts`: Handles deposit and exchange operations.
- `vault-slice.ts`: Manages vault and liqudity operations.

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs)
- [Wagmi Documentation](https://wagmi.sh/react/getting-started)
- [Lisk Documentation](https://docs.lisk.com/building-on-lisk/interacting-with-the-blockchain/viem)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For any queries or suggestions, please open an issue in the GitHub repository.
