# cli.py
import argparse
import subprocess

def run_js_analysis(wallet, num_tx):
    try:
        result = subprocess.run(
            ["node", "index.js", wallet, str(num_tx)],
            capture_output=True,
            text=True,
            check=True
        )
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print("🚨 Error from JS script:")
        print(e.stderr)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="🔍 Analyze Solana transactions for MEV behavior.")
    parser.add_argument("wallet", help="Solana wallet address to analyze")
    parser.add_argument("-n", "--num", type=int, default=3, help="Number of recent transactions to analyze")

    args = parser.parse_args()
    run_js_analysis(args.wallet, args.num)

