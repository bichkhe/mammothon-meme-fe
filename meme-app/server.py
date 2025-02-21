import base64
import datetime
import json
import hashlib
import asyncio
import time
from web3 import AsyncWeb3
from web3.providers import AsyncHTTPProvider
from eth_account import Account
from merkly.mtree import MerkleTree
import celestia_node
# Config
SEPOLIA_RPC_URL = "https://base-sepolia.g.alchemy.com/v2/W79MhAzo3-xz0UkhUU1Vx4CWNl7UkQ8W"
PRIVATE_KEY = "264e1588d831f9645f61d94c68c62e7b5467e4ea59bdc0e6fd05452698ac8eb4"
CONTRACT_ADDRESSES =  ["0xcd3F14D8BD72ABD05D85b61908f400d855Bd21a0", "0x4A397667D792A891AFee36A9C795C49b44877495"]
CELESTIA_NODE_URL = "https://flying-minnow-discrete.ngrok-free.app"
CELESTIA_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJwdWJsaWMiLCJyZWFkIiwid3JpdGUiLCJhZG1pbiJdLCJOb25jZSI6IjVLUGFXYVVGYW5TTlMwTk40Z1RqUk1QcUJWc0JRbDVRYWhmUGZ5UkhoNlk9IiwiRXhwaXJlc0F0IjoiMDAwMS0wMS0wMVQwMDowMDowMFoifQ.SxkCtdFk1sk87YGFh8GPgkExMi4BHTLsGj0ifiqAyCI"
options_json = {
    "fee": 10000,
    "gas_limit": 100000
}

# Init
web3 = AsyncWeb3(AsyncHTTPProvider(SEPOLIA_RPC_URL))
wallet = Account.from_key(PRIVATE_KEY)
node = celestia_node.Client(CELESTIA_NODE_URL, CELESTIA_TOKEN)

with open("src/contracts/MemeCoin.json") as f:
    CONTRACT_ABI = json.load(f)["abi"]

async def calculate_commitment(data: str) -> str:
    print(f"Calculating commitment for {data}")
    chunks = [data[i:i+256] for i in range(0, len(data), 256)]
    hashed = [hashlib.sha256(c.encode()).hexdigest() for c in chunks]
    if len(hashed) == 1:
        hashed.append(hashed[0])
    return MerkleTree(hashed).root

async def submit_blob(data: str) -> str:
    # Implement Celestia API call properly
    commitment = await calculate_commitment(data)
    commit = base64.b64encode(commitment).decode()
    data_encode = base64.b64encode(data.encode()).decode()
    print(f"Calculated commitment {commitment} and result {commit}")
    blob = [
        {
        "namespace": "AAAAAAAAAAAAAAAAAAAAAAAAAAECAwQFBgcICRA=",
        "data": data_encode,
        "commitment": commit,
        "share_version": 0,
        }
    ]
    submitted_blob = celestia_node.Blob(node).submit(blob, options_json)
    print(f"Submitted blob {commitment} with heigh {str(submitted_blob)}")
    return commitment
async def save_tx(commitment, contract_address):
    contract = web3.eth.contract(address=contract_address, abi=CONTRACT_ABI)
    nonce = await web3.eth.get_transaction_count(wallet.address)
    gas = await web3.eth.gas_price
    # Gọi hàm logTransaction
    txn = await contract.functions.logTransaction(commitment).build_transaction({
        "from": wallet.address,
        "nonce": nonce,
        "gas": 200000,
        "gasPrice": gas,
    })
    
    print(f"Transaction data: {txn}")
    # Ký giao dịch
    signed_txn = web3.eth.account.sign_transaction(txn, PRIVATE_KEY)

    # Gửi giao dịch
    tx_hash = await web3.eth.send_raw_transaction(signed_txn.raw_transaction)
    hash = web3.to_hex(tx_hash)
    print(f"Giao dịch đang được gửi, hash: {hash}")

    # Chờ xác nhận giao dịch
    receipt = await web3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Giao dịch hoàn tất: {receipt.transactionHash.hex()}")
    # Implement properly
    print(f"Saving tx {commitment} for contract {contract_address}")
    
async def handle_buy_event(event):
    args = event["args"]
    print(f"Handling buy event {args}")
    tx_data = {
        "from": args["buyer"],
        "amountETH": str(args["amountETH"]),
        "amountToken": str(args["amountToken"]),
        "timestamp": str(time.time()),
    }
    commitment = await submit_blob(json.dumps(tx_data))
    await save_tx(commitment, event["address"])
async def handle_sell_event(event):
    args = event["args"]
    print(f"Handling sell event {args}")
    tx_data = {
        "from": args["seller"],
        "amountETH": str(args["amountETH"]),
        "amountToken": str(args["amountToken"]),
        "timestamp": str(time.time()),
    }
    commitment = await submit_blob(json.dumps(tx_data))
    await save_tx(commitment, event["address"])
async def listen_contract(address):
    contract = web3.eth.contract(address=address, abi=CONTRACT_ABI)
    
    async def log_loop(event_filter, handler):
        while True:
            events = await event_filter.get_new_entries()
            for event in events:
                await handler(event)
            await asyncio.sleep(2)
    print(f"Listening to {address}")
    buy_filter = await contract.events.Buy.create_filter(from_block="latest")
    sell_filter = await contract.events.Sell.create_filter(from_block="latest")
    print(f"Listening to 2{address}")
    await asyncio.gather(
        log_loop(buy_filter, handle_buy_event),
        log_loop(sell_filter, handle_sell_event)  # Define similar
    )

async def main():
    tasks = [listen_contract(addr) for addr in CONTRACT_ADDRESSES]
    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())