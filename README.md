# Web3 Transaction Handler with Gemini AI and Wagmi

A Next.js application that integrates Gemini AI to interpret natural language commands into EVM-compatible transactions. It uses Wagmi for wallet connection and transaction execution, with robust backend validation for Ethereum addresses and ERC20 contracts.

## Features

- Parse user commands to create EVM-compatible transactions (ETH or ERC20).
- Wallet connection and transaction execution using Wagmi.
- Backend validation for Ethereum addresses and ERC20 token contracts.
- Responsive UI built with Next.js, Tailwind CSS, and NextUI.

## Technologies

- **Frontend**: Next.js, Tailwind CSS, NextUI
- **Blockchain Interaction**: Wagmi, ethers.js
- **AI Integration**: Gemini AI (Google Generative AI)
- **Backend**: Next.js API routes

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sriram651/web3-token-transfer-gemini.git
   cd web3-token-transfer-gemini

2. Install dependencies

    ```bash
    npm install
3. Create a `.env.local` file in the root directory and add the following variables:

    ```bash
    NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
    NEXT_PUBLIC_RPC_URL=your-ethereum-rpc-url
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-wallet-connect-project-id
4. Start the development server:

    ```bash
    npm run dev

5. Open your browser and navigate to:

    ```bash
    http://localhost:3000

## Usage
1. Enter a command in the input box, such as:

    ```bash
    Send 10 tokens to 0xRecipientAddress from me using contract 0xTokenAddress

2. The application parses the command using Gemini AI and validates the transaction details on the backend.

3. Connect your wallet using the "Connect Wallet" button.

4. Execute the transaction via Wagmi.

## API Endpoints

`/api/gemini`

 - **Method:** `POST`
 - **Description:** Parses user input into an EVM-compatible transaction.
 - **Request Body:**
    ```bash
    {
        "input": "your-natural-language-command"
    }
 - **Response:**

    ```bash
    {
        "success": true,
        "data": {
            "recipientAddress": "0x000...",
            "amount": 123,
            "isErc20": true,
            "tokenAddress": "0x345..."
        }
    }

## Acknowledgments

[Wagmi](https://wagmi.sh/) for wallet and blockchain interaction.

[Google Generative AI](https://aistudio.google.com/) for natural language processing.

[Next.js](https://nextjs.org/) for the React framework.

[Tailwind CSS](https://tailwindcss.com/) and [NextUI](https://nextui.org/) for UI styling.