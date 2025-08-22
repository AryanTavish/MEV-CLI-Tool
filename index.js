
const solanaweb3 = require('@solana/web3.js');

// Input arguments from cli.py
const address = process.argv[2]; // Wallet address
const numTx = parseInt(process.argv[3]) || 3;

const endpoint = 'https://wispy-crimson-resonance.solana-devnet.quiknode.pro/1dcb0448edf1ddad43b369b9eb898103435d6d9f/';
const solanaConnection = new solanaweb3.Connection(endpoint);

const DEX_PROGRAM_IDS = [
    'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB',
    'RVKd61ztZW9jqhDd7diYxZ3cYVQ7gSRu4fJ6u9Ztuu7',
    'nQj1ePx2uec6FhFQugrN4yC7xgYZNjv4aZKPo9yVDaQ',
    'PHNXqaz96N3rLjzvRXfA3DZZdR8wnhfZ9nKJKfHkH53'
];

const PROGRAM_ID_MAP = {
    'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB': 'Jupiter',
    'RVKd61ztZW9jqhDd7diYxZ3cYVQ7gSRu4fJ6u9Ztuu7': 'Jupiter',
    'nQj1ePx2uec6FhFQugrN4yC7xgYZNjv4aZKPo9yVDaQ': 'Phoenix',
    '4MtdTzMv8yUo7Cz6MPyA3E7nffHprpKUEyX6dU9EzyGx': 'Raydium',
    '5quBvLjFbLMPbEBB35UrbJm1wDK5q6GvsQaK7nR3zD2F': 'Orca',
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': 'Token Program',
    '11111111111111111111111111111111': 'System Program',
    '2rgj5vmR2sh9Y5HZMgPjyz2JFJvL4dRkJoZYVnbDkA7Q': 'Meteora',
};

function getPlatformNamesFromTransaction(tx) {
    const platforms = new Set();
    const instructions = tx.transaction.message.instructions;
    instructions.forEach(ix => {
        const id = ix.programId.toString();
        if (PROGRAM_ID_MAP[id]) platforms.add(PROGRAM_ID_MAP[id]);
    });

    if (tx.meta?.innerInstructions) {
        tx.meta.innerInstructions.forEach(inner => {
            inner.instructions.forEach(ix => {
                const id = ix.programId?.toString();
                if (PROGRAM_ID_MAP[id]) platforms.add(PROGRAM_ID_MAP[id]);
            });
        });
    }

    return Array.from(platforms);
}

const getTransactions = async (wallet, numTx) => {
    try {
        const pubKey = new solanaweb3.PublicKey(wallet);
        const transactionList = await solanaConnection.getSignaturesForAddress(pubKey, { limit: numTx });
        const signatureList = transactionList.map(tx => tx.signature);
        const transactionDetails = await solanaConnection.getParsedTransactions(signatureList);

        transactionDetails.forEach((tx, idx) => {
            if (!tx) return;
            const sig = tx.transaction.signatures[0];
            const signerAccount = tx.transaction.message.accountKeys.find(key => key.signer);
            const walletAddress = signerAccount ? signerAccount.pubkey.toString() : 'Unknown';
            const platforms = getPlatformNamesFromTransaction(tx);
            const slot = tx.slot;
            const fee = tx.meta?.fee;
            const instructions = tx.transaction.message.instructions;
            const programIDs = instructions.map(ix => ix.programId.toString());
            const isSwap = programIDs.some(id => DEX_PROGRAM_IDS.includes(id));
            const balanceGain = (tx.meta?.postBalances[0] || 0) - (tx.meta?.preBalances[0] || 0);
            const isMEV = isSwap && balanceGain > 0;

            console.log(`\n==========================`);
            console.log(`Transaction ${idx + 1}`);
            console.log(`Signature: ${sig}`);
            console.log(`Wallet Address: ${walletAddress}`);
            console.log(`Platforms Involved: ${platforms.join(', ')}`);
            console.log(`Slot: ${slot}`);
            console.log(`Fee Paid: ${fee} lamports`);
            console.log(`Swap DEXs Involved: ${programIDs.filter(id => DEX_PROGRAM_IDS.includes(id)).join(', ') || 'None'}`);
            console.log(`Profitability: ${balanceGain > 0 ? `+${balanceGain} lamports` : 'No Profit'}`);
            console.log(`MEV Behavior Detected: ${isMEV ? '✅ YES' : '❌ NO'}`);
        });
    } catch (err) {
        console.error("Error fetching transactions:", err.message);
        process.exit(1);
    }
};

getTransactions(address, numTx);
