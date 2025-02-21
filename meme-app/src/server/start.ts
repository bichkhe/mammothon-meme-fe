import { Client } from "cntsc";
import { blob } from "cntsc/dist/src/types/blob";
import { Contract, ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import crypto from "crypto";
import contractABI from "@/contracts/MemeCoin.json";
const SEPOLIA_RPC_URL = "wss://base-sepolia.g.alchemy.com/v2/W79MhAzo3-xz0UkhUU1Vx4CWNl7UkQ8W";


interface Transaction{
    from: string,
    isBuy: boolean,
    amountETH: string,
    amountToken: string,
    time: Date
}
export const TrackHistory = (address: string) =>  {
    const contract = new ethers.Contract(
        address,
        contractABI.abi,
        wallet
    );
    contract.on("Buy", async (buyer, amountETH, amountToken) => {
        const transaction: Transaction = {
            from: buyer,
            isBuy: true,
            amountETH: amountETH.toString(),
            amountToken: amountToken.toString(),
            time: new Date()
        }
        const commitment= await submitBlob(JSON.stringify(transaction));
        await saveTx(commitment, contract);
        console.log("Buy event detected:", transaction);
    })
    contract.on("Sell",async (seller, amountETH, amountToken) => {
        const transaction: Transaction = {
            from: seller,
            isBuy: false,
            amountETH: amountETH.toString(),
            amountToken: amountToken.toString(),
            time: new Date()
        }
        const commitment = await submitBlob(JSON.stringify(transaction));
        await saveTx(commitment, contract);
        console.log("Sell event detected:", transaction);
    })
    return contract;
    }

export const submitBlob = async (dataSubmit: string) => {
    const url = "https://flying-minnow-discrete.ngrok-free.app";
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJwdWJsaWMiLCJyZWFkIiwid3JpdGUiLCJhZG1pbiJdLCJOb25jZSI6IjVLUGFXYVVGYW5TTlMwTk40Z1RqUk1QcUJWc0JRbDVRYWhmUGZ5UkhoNlk9IiwiRXhwaXJlc0F0IjoiMDAwMS0wMS0wMVQwMDowMDowMFoifQ.SxkCtdFk1sk87YGFh8GPgkExMi4BHTLsGj0ifiqAyCI";
    const client = new Client(url, token);
    const blob: blob.Blob = {
        namespace : "AAAAAAAAAAAAAAAAAAAAAAAAAAECAwQFBgcICRA=",
        data : dataSubmit,
        share_version : 1,
        commitment : calculateCommitment(dataSubmit),
        index : 1,
    }
    console.log(blob)
    const proof = await client.Blob.Submit([blob], 0.001);
    console.log(proof)
    // save to contract 
    return blob.commitment;
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
export const saveTx = async (commitment: string, contract: Contract) =>{
    const tx = await contract.logTransaction(commitment);
    await tx.wait();
}
const provider = new ethers.WebSocketProvider(SEPOLIA_RPC_URL);
const wallet = new ethers.Wallet("264e1588d831f9645f61d94c68c62e7b5467e4ea59bdc0e6fd05452698ac8eb4", provider);

export const StartTracking = async () => {
    console.log("Starting to track history...");
    const address = ["0xcd3F14D8BD72ABD05D85b61908f400d855Bd21a0", "0x4A397667D792A891AFee36A9C795C49b44877495"]
    const contracts = address.map((addr) => TrackHistory(addr));
    console.log("✅ Tracking started for contracts: ", contracts.length);
    // Tạo interval để giữ chương trình chạy
    setInterval(() => {
        console.log("✅ Server is still running... ");
    }, 30_000); // Mỗi 30s log một lần
    await new Promise(() => {}); // Chặn tiến trình kết thúc
}

StartTracking().catch(console.error);