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
from convex import ConvexClient
import web3 as w3
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
CONVEX_URL = "https://dazzling-dalmatian-501.convex.cloud"
FACTORY_ADDRESS = "0x44ce89145a6BF2E4EBe908AD1dD755Dc72d7B3d7"
convex_client = ConvexClient(CONVEX_URL)
web3 = AsyncWeb3(AsyncHTTPProvider(SEPOLIA_RPC_URL))
wallet = Account.from_key(PRIVATE_KEY)
node = celestia_node.Client(CELESTIA_NODE_URL, CELESTIA_TOKEN)
with open("src/contracts/MemeCoin.json") as f:
    MEME_ABI = json.load(f)["abi"]
    
with open("src/contracts/ContractFactory.json") as f:
    FACTORY_ABI = json.load(f)["abi"]
factory_contract = web3.eth.contract(address=FACTORY_ADDRESS, abi=FACTORY_ABI)

# get all contract from convex
contracts = convex_client.query("meme:get")
print(contracts)
# format contract to some thing difference
for contract in contracts:
    CONTRACT_ADDRESSES.append(contract["addr"])
def calculate_commitment(data: str) -> str:
    print(f"Calculating commitment for {data}")
    chunks = [data[i:i+256] for i in range(0, len(data), 256)]
    hashed = [hashlib.sha256(c.encode()).hexdigest() for c in chunks]
    if len(hashed) == 1:
        hashed.append(hashed[0])
    return MerkleTree(hashed).root

async def save_tx(commitment, block_height, contract_address):
    print(f"Saving tx {commitment} for contract {contract_address}")
    convex_client.mutation("meme:saveTransaction", dict(
        address = contract_address,
        commitment = base64.b64encode(commitment).decode("utf-8"),
        block_height = block_height,
    ))
    print(f"Saving tx {commitment} for contract {contract_address}")

async def submit_blob(data: str) -> tuple[str, int]:
    # Implement Celestia API call properly
    commitment = calculate_commitment(data)
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
    return (commitment, submitted_blob)
async def save_tx(commitment, block_height, contract_address):
    print(f"Saving tx {commitment} for contract {contract_address}")
    convex_client.mutation("meme:saveTransaction", dict(
        address = contract_address,
        commitment = base64.b64encode(commitment).decode("utf-8"),
        block_height = block_height,
    ))
    print(f"Saving tx {commitment} for contract {contract_address}")
    
async def handle_buy_event(event):
    args = event["args"]
    print(f"Handling buy event {args}")
    tx_data = {
        "sender": args["buyer"],
        "eth": str(args["amountETH"]),
        "amount": str(args["amountToken"]),
        "time": str(time.time()),
        "t_type": 0
    }
    price = args["price"]
    print(f"Price {price}")
    result = await submit_blob(json.dumps(tx_data))
    convex_client.mutation("meme:updateContract", dict(
        address = event["address"],
        ethAmount = str(args["amountETH"]),
        price = str(args["price"]),
        token_buy = args["amountToken"],
    ))
    await save_tx(result[0],result[1] , event["address"])
    
async def handle_sell_event(event):
    args = event["args"]
    print(f"Handling sell event {args}")
    tx_data = {
        "sender": args["seller"],
        "eth": str(args["amountETH"]),
        "amount": str(args["amountToken"]),
        "time": str(time.time()),
        "t_type": 1
    }
    price = args["price"]
    print(f"Price {price}")
    result = await submit_blob(json.dumps(tx_data))
    convex_client.mutation("meme:updateContract", dict(
        address = event["address"],
        ethAmount = str(args["amountETH"]),
        price = str(args["price"]),
        token_buy = -args["amountToken"],
    ))
    commitment = await submit_blob(json.dumps(tx_data))
    await save_tx(commitment, event["address"])
async def log_loop(event_filter, handler):
    while True:
        events = await event_filter.get_new_entries()
        for event in events:
            await handler(event)
        await asyncio.sleep(2)
async def listen_contract(address):
    contract = web3.eth.contract(address=address, abi=MEME_ABI)
    print(f"Listening to {address}")
    buy_filter = await contract.events.Buy.create_filter(from_block="latest")
    sell_filter = await contract.events.Sell.create_filter(from_block="latest")
    print(f"Listening to 2{address}")
    await asyncio.gather(
        log_loop(buy_filter, handle_buy_event),
        log_loop(sell_filter, handle_sell_event)  # Define similar
    )
    
async def on_new_contract(event):
    print(f"New contract {event}")
    args = event["args"]
    address = args["contractAddress"]
    print(f"New contract {address}")
    CONTRACT_ADDRESSES.append(address)
    await listen_contract(address)
    
async def listen_new_contract():
    print("Listening to new contract")
    new_contract_filter = await factory_contract.events.ContractCreated.create_filter(from_block="latest")
    await log_loop(new_contract_filter, on_new_contract)



async def main():
     # Tạo một tác vụ để lắng nghe contract mới
    listen_new_contract_task = asyncio.create_task(listen_new_contract())
    
    # Tạo các tác vụ để lắng nghe các contract hiện có
    tasks = [listen_contract(addr) for addr in CONTRACT_ADDRESSES]
    
    # Chạy song song tất cả các tác vụ
    await asyncio.gather(listen_new_contract_task, *tasks)
    
if __name__ == "__main__":
    asyncio.run(main())