# Solana Sequential Address Search with Activity Checker

This tool generates Solana wallet addresses and checks their transaction activity on the Solana blockchain using a specified mnemonic phrase.

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine
- An environment file (.env) with your Solana mnemonic phrase (MNEMONIC) and other configurations (refer to .env.example)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/solana-address-generator.git
    ```

2. Navigate to the project directory:

    ```bash
    cd solana-address-generator
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

## Usage

1. Edit the `.env` file with your Solana mnemonic phrase.

2. Run the script:

    ```bash
    npm start
    ```

The script generates Solana wallet addresses, checks their activity, and saves the results in `solana_addresses.csv`.

## Configuration

You can adjust the number of addresses and other settings in the script. Modify the `numberOfAddresses` variable and Solana network URL in the `generateSolanaAddresses` function.
