# MEV-CLI-Tool
# Solana MEV Analysis CLI Tool

A command-line tool to analyze Solana transactions for MEV (Maximal Extractable Value) behavior and DEX interactions.

## Features

- 🔍 Analyze recent transactions for any Solana wallet
- 📊 Detect interactions with major DEXs (Jupiter, Phoenix, Raydium, etc.)
- 💰 Calculate transaction profitability
- ⚡ Track MEV behavior
- 🔄 Monitor multi-platform interactions

## Prerequisites

- Node.js (v16 or higher)
- Python 3.7+
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd solana-cli
```

2. Install Node.js dependencies:
```bash
npm install @solana/web3.js
```

## Configuration

The tool connects to Solana devnet through QuickNode. You may need to update the endpoint URL in `index.js`:

```javascript
const endpoint = 'YOUR_QUICKNODE_URL';
```

## Usage

Run the CLI tool using Python:

```bash
python3 cli.py <WALLET_ADDRESS> -n <NUMBER_OF_TRANSACTIONS>
```

Example:
```bash
python3 cli.py 5ZWj7a1f8tWkjBESHKgrNmk1ssL7kfhxrl112VQS9qkE -n 5
```

### Command Arguments

- `WALLET_ADDRESS`: The Solana wallet address to analyze (required)
- `-n, --num`: Number of recent transactions to analyze (optional, default: 3)

## Output Format

The tool provides detailed information for each transaction:
- Transaction signature
- Wallet address
- Platforms involved
- Slot number
- Transaction fees
- DEX interactions
- Profitability analysis
- MEV behavior detection

## Supported DEX Platforms

- Jupiter
- Phoenix
- Raydium
- Orca
- Meteora

## Error Handling

The tool includes comprehensive error handling for:
- Invalid wallet addresses
- Network connection issues
- Transaction parsing errors
- API rate limits

## Contributing

Feel free to submit issues and enhancement requests!

## License

[Your chosen license]

## Disclaimer

This tool is for educational and research purposes only. Always verify transaction data independently.