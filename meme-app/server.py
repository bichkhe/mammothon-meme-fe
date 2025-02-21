import json
import hashlib
import asyncio
from web3 import AsyncWeb3
from web3.providers import AsyncHTTPProvider
from eth_account import Account
from merkly.mtree import MerkleTree

# Config
SEPOLIA_RPC_URL = "https://base-sepolia.g.alchemy.com/v2/W79MhAzo3-xz0UkhUU1Vx4CWNl7UkQ8W"
PRIVATE_KEY = "264e1588d831f9645f61d94c68c62e7b5467e4ea59bdc0e6fd05452698ac8eb4"
CONTRACT_ADDRESSES =  ["0xcd3F14D8BD72ABD05D85b61908f400d855Bd21a0", "0x4A397667D792A891AFee36A9C795C49b44877495"]
CELESTIA_NODE_URL = "https://flying-minnow-discrete.ngngrok-free.app"
CELESTIA_TOKEN = "YOUR_TOKEN"

# Init
web3 = AsyncWeb3(AsyncHTTPProvider(SEPOLIA_RPC_URL))
wallet = Account.from_key(PRIVATE_KEY)

with open("src/contracts/MemeCoin.json") as f:
    CONTRACT_ABI = json.load(f)["abi"]

async def calculate_commitment(data: str) -> str:
    chunks = [data[i:i+256] for i in range(0, len(data), 256)]
    hashed = [hashlib.sha256(c.encode()).hexdigest() for c in chunks]
    return MerkleTree(hashed).root

async def submit_blob(data: str) -> str:
    # Implement Celestia API call properly
    headers = {"Authorization": f"Bearer {CELESTIA_TOKEN}"}
    commitment = await calculate_commitment(data)
    
    blob = {
        "namespace": "DEADBEEF...",
        "data": data,
        "commitment": commitment,
        # ... other fields
    }
    
    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{CELESTIA_NODE_URL}/submit",
            headers=headers,
            json=blob
        )
        return res.json()["commitment"]

async def handle_buy_event(event):
    args = event["args"]
    tx_data = {
        "from": args["buyer"],
        "amountETH": str(args["amountETH"]),
        # ... other fields
    }
    commitment = await submit_blob(json.dumps(tx_data))
    await save_tx(commitment, event["address"])

async def listen_contract(address):
    contract = web3.eth.contract(address=address, abi=CONTRACT_ABI)
    
    async def log_loop(event_filter, handler):
        while True:
            print(f"Checking for new events in {address}")
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
        log_loop(sell_filter, handle_buy_event)  # Define similar
    )

async def main():
    tasks = [listen_contract(addr) for addr in CONTRACT_ADDRESSES]
    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())