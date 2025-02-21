import { Client } from "cntsc";
import { blob } from "cntsc/dist/src/types/blob";
import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import crypto from "crypto";
import contractABI from "@/contracts/MemeCoin.json";
const SEPOLIA_RPC_URL = "wss://base-sepolia.g.alchemy.com/v2/W79MhAzo3-xz0UkhUU1Vx4CWNl7UkQ8W";


interface Transaction{
    from: string,
    isBuy: boolean,
    amountETH: number,
    amountToken: number,
    time: Date
}
export const TrackHistory = (address: string) =>  {
    const provider = new ethers.WebSocketProvider(SEPOLIA_RPC_URL);
    const contract = new ethers.Contract(
        address,
        contractABI.abi,
        provider
    );
    contract.once("Buy", (buyer, amountETH, amountToken) => {
        const transaction: Transaction = {
            from: buyer,
            isBuy: true,
            amountETH: amountETH,
            amountToken: amountToken,
            time: new Date()
        }
        submitBlob(JSON.stringify(transaction));
        console.log("Buy event detected:", transaction);
    })
    contract.once("Sell", (seller, amountETH, amountToken) => {
        const transaction: Transaction = {
            from: seller,
            isBuy: false,
            amountETH: amountETH,
            amountToken: amountToken,
            time: new Date()
        }
        submitBlob(JSON.stringify(transaction));
        console.log("Sell event detected:", transaction);
    })
    return contract;
    }

export const submitBlob = async (dataSubmit: string) => {
    const url = "https://flying-minnow-discrete.ngrok-free.app";
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJwdWJsaWMiLCJyZWFkIiwid3JpdGUiLCJhZG1pbiJdLCJOb25jZSI6IjVLUGFXYVVGYW5TTlMwTk40Z1RqUk1QcUJWc0JRbDVRYWhmUGZ5UkhoNlk9IiwiRXhwaXJlc0F0IjoiMDAwMS0wMS0wMVQwMDowMDowMFoifQ.SxkCtdFk1sk87YGFh8GPgkExMi4BHTLsGj0ifiqAyCI";
    const client = new Client(url, token);
    const blob: blob.Blob = {
        namespace : "DEADBEEFabcdef1234567890abcdef1234567890",
        data : dataSubmit,
        share_version : 1,
        commitment : calculateCommitment(dataSubmit),
        index : 1,
    }
    client.Blob.Submit([blob], 0.001);

}
function calculateCommitment(data: string) {
    const sha256 = (data: string) => crypto.createHash('sha256').update(data).digest('hex');
    const chunkSize = 256;
    const chunks = [];
    for (let i = 0; i < data.length; i += chunkSize) {
        chunks.push(data.slice(i, i + chunkSize));
    }
    const hashedChunks = chunks.map(chunk => sha256(chunk));
    const merkleTree = new MerkleTree(hashedChunks, sha256, { sortPairs: true });
    const commitment = merkleTree.getRoot().toString('hex');
    console.log("Commitment:", commitment);
    return commitment;
}

export const StartTracking = async () => {
    console.log("Starting to track history...");
    const provider = new ethers.WebSocketProvider(SEPOLIA_RPC_URL);
    const contract = new ethers.Contract(
        "0xA7CEc61f5Ca4E7e77e85eD44724be6ED9059040C",
        contractABI.abi,
        provider
    );
provider.send("eth_subscribe", ["logs", { 
    address: "0xA7CEc61f5Ca4E7e77e85eD44724be6ED9059040C",
    topics: [] // Lọc event cụ thể nếu cần
}]).then(subscriptionId => {
    console.log("📡 Subscribed to logs:", subscriptionId);
}).catch(error => console.error("❌ Subscription error:", error));

    contract.on("Buy", (buyer, amountETH, amountToken) => {
        const transaction: Transaction = {
            from: buyer,
            isBuy: true,
            amountETH: amountETH,
            amountToken: amountToken,
            time: new Date()
        }
        //submitBlob(JSON.stringify(transaction));
        console.log("Buy event detected:", transaction);
    })
    contract.on("Sell", (seller, amountETH, amountToken) => {
        const transaction: Transaction = {
            from: seller,
            isBuy: false,
            amountETH: amountETH,
            amountToken: amountToken,
            time: new Date()
        }
        //submitBlob(JSON.stringify(transaction));
        console.log("Sell event detected:", transaction);
    })
    // Tạo interval để giữ chương trình chạy
    setInterval(() => {
        console.log("✅ Server is still running... ", contract.getAddress());
    }, 30_000); // Mỗi 30s log một lần
    await new Promise(() => {}); // Chặn tiến trình kết thúc
}

StartTracking().catch(console.error);