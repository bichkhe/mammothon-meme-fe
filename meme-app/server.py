import base64
import datetime
import json
import hashlib
import asyncio
import time
from web3 import AsyncWeb3
from web3.providers import AsyncHTTPProvider
from eth_account import Account
import celestia_node
from convex import ConvexClient
import web3 as w3
from typing import List
import hashlib


class Node:
    def __init__(self, left, right, value: str, content, is_copied=False) -> None:
        self.left: Node = left
        self.right: Node = right
        self.value = value
        self.content = content
        self.is_copied = is_copied

    @staticmethod
    def hash(val: str) -> str:
        return hashlib.sha256(val.encode('utf-8')).hexdigest()

    def __str__(self):
        return (str(self.value))

    def copy(self):
        """
        class copy function
        """
        return Node(self.left, self.right, self.value, self.content, True)


class MerkleTree:
    def __init__(self, values: List[str]) -> None:
        self.__buildTree(values)

    def __buildTree(self, values: List[str]) -> None:

        leaves: List[Node] = [Node(None, None, Node.hash(e), e)
                              for e in values]
        if len(leaves) % 2 == 1:
            # duplicate last elem if odd number of elements
            leaves.append(leaves[-1].copy())
        self.root: Node = self.__buildTreeRec(leaves)

    def __buildTreeRec(self, nodes: List[Node]) -> Node:
        if len(nodes) % 2 == 1:
            # duplicate last elem if odd number of elements
            nodes.append(nodes[-1].copy())
        half: int = len(nodes) // 2

        if len(nodes) == 2:
            return Node(nodes[0], nodes[1], Node.hash(nodes[0].value + nodes[1].value), nodes[0].content+"+"+nodes[1].content)

        left: Node = self.__buildTreeRec(nodes[:half])
        right: Node = self.__buildTreeRec(nodes[half:])
        value: str = Node.hash(left.value + right.value)
        content: str = f'{left.content}+{right.content}'
        return Node(left, right, value, content)

    def printTree(self) -> None:
        self.__printTreeRec(self.root)

    def __printTreeRec(self, node: Node) -> None:
        if node != None:
            if node.left != None:
                print("Left: "+str(node.left))
                print("Right: "+str(node.right))
            else:
                print("Input")

            if node.is_copied:
                print('(Padding)')
            print("Value: "+str(node.value))
            print("Content: "+str(node.content))
            print("")
            self.__printTreeRec(node.left)
            self.__printTreeRec(node.right)

    def getRootHash(self) -> str:
        return self.root.value
# Config
SEPOLIA_RPC_URL = "https://base-sepolia.g.alchemy.com/v2/W79MhAzo3-xz0UkhUU1Vx4CWNl7UkQ8W"
PRIVATE_KEY = "264e1588d831f9645f61d94c68c62e7b5467e4ea59bdc0e6fd05452698ac8eb4"
CONTRACT_ADDRESSES =  ["0xD295179D0265a0170af78565b7EDE98CA5678F0B"]
CELESTIA_NODE_URL = "https://flying-minnow-discrete.ngrok-free.app"
CELESTIA_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJwdWJsaWMiLCJyZWFkIiwid3JpdGUiLCJhZG1pbiJdLCJOb25jZSI6IjVLUGFXYVVGYW5TTlMwTk40Z1RqUk1QcUJWc0JRbDVRYWhmUGZ5UkhoNlk9IiwiRXhwaXJlc0F0IjoiMDAwMS0wMS0wMVQwMDowMDowMFoifQ.SxkCtdFk1sk87YGFh8GPgkExMi4BHTLsGj0ifiqAyCI"
options_json = {
    "fee": 10000,
    "gas_limit": 100000
}
CONVEX_URL = "https://dazzling-dalmatian-501.convex.cloud"
FACTORY_ADDRESS = "0x9563E05970a900022AF0DFfB5aD7eA0B99025bA8"
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
    print("found contract " +  contract["addr"])
    CONTRACT_ADDRESSES.append(contract["addr"])
def calculate_commitment(data: str) -> str:
    print(f"Calculating commitment for {data}")
    chunks = [data[i:i+256] for i in range(0, len(data), 256)]
    hashed = [hashlib.sha256(c.encode()).hexdigest() for c in chunks]
    tree =  MerkleTree(hashed)
    tree.printTree()
    return tree.getRootHash()

async def save_tx(commitment, block_height, contract_address):
    print(f"Saving tx {commitment} for contract {contract_address}")
    convex_client.mutation("meme:saveTransaction", dict(
        address = contract_address,
        commitment = base64.b64encode(commitment.encode()).decode("utf-8"),
        block_height = block_height,
    ))
    print(f"Saving tx {commitment} for contract {contract_address}")

async def submit_blob(data: str) -> tuple[str, int]:
    # Implement Celestia API call properly
    commitment = calculate_commitment(data)
    commit = base64.b64encode(commitment.encode()).decode()
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
    print(f"Submitting blob {blob}")
    submitted_blob = celestia_node.Blob(node).submit(blob, options_json)
    
    print(f"Submitted blob {commitment} with heigh {str(submitted_blob)}")
    return (commitment, submitted_blob)
async def save_tx(commitment, block_height, contract_address):
    print(f"Saving tx {commitment} for contract {contract_address}")
    convex_client.mutation("meme:saveTransaction", dict(
        address = contract_address,
        commitment = base64.b64encode(commitment.encode()).decode("utf-8"),
        block_height = block_height,
    ))
    print(f"Saving tx {commitment} for contract {contract_address}")
    
async def handle_buy_event(event):
    args = event["args"]
    print(f"Handling buy event {args}")
    tx_data = {
        "sender": str(args["buyer"]),
        "eth": str(args["amountETH"]),
        "amount": str(args["amountToken"]),
        "time": str(time.time()),
        "t_type": '0',
        "price" : str(args["price"])
    }
    print(f"Handling buy event {tx_data}")
    price = args["price"]
    print(f"Price {price}")
    result = await submit_blob(json.dumps(tx_data))
    token_buy_total = int(args["amountToken"])
    convex_client.mutation("meme:updateContract", dict(
        address = event["address"],
        ethAmount = str(args["amountETH"]),
        price = str(args["price"]),
        token_buy = token_buy_total,
    ))
    await save_tx(result[0],result[1] , event["address"])
    
async def handle_sell_event(event):
    args = event["args"]
    print(f"Handling sell event {args}")
    tx_data = {
        "sender": str(args["seller"]),
        "eth": str(args["amountETH"]),
        "amount": str(args["amoumtToken"]),
        "time": str(time.time()),
        "t_type": '1',
        "price" : str(args["price"])
    }
    print(f"Handling sell event {tx_data}")
    price = args["price"]
    print(f"Price {price}")
    token_buy = int(args["amountToken"])
    convex_client.mutation("meme:updateContract", dict(
        address = event["address"],
        ethAmount = str(args["amountETH"]),
        price = str(args["price"]),
        token_buy = -token_buy,
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