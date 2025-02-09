"use client";
import { useState, useCallback } from "react";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import { ethers } from "ethers";
import contractABI from "@/contracts/MyContractABI.json";
import { debounce } from "lodash";

const CONTRACT_ADDRESS = "0x30DcD8DEf4CC1cCd5EA88AF4B56c4c2dB47bd36D";
const INFURA_PROJECT_ID = "e11fea93e1e24107aa26935258904434";
const SEPOLIA_RPC_URL = `https://base-sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;

export default function BuyAndSell() {
  const [received, setReceived] = useState<number>(0);
  const [isBuyMode, setIsBuyMode] = useState<boolean>(true);
  const [amount, setAmount] = useState<number | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Cannot connect to Wallet!");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(
        window.ethereum as unknown as ethers.Eip1193Provider
      );
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      fetchBalance(accounts[0]);
    } catch (error) {
      console.error("Cannot connect to Wallet:", error);
    }
  };

  const fetchBalance = async (userAddress: string) => {
    try {
      const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        provider
      );
      const balance = await contract.balanceOf(userAddress);
      setBalance(ethers.formatUnits(balance, 18)); // Chuyển từ Wei sang token
      console.log("User Address:", userAddress);
      console.log("Balance:", ethers.formatUnits(balance, 18));
    } catch (error) {
      console.error("Cannot get balance:", error);
    }
  };

  // Buy or Sell token
  const handleTransaction = async () => {
    if (!amount || !account || !contractABI) {
      alert("Please connect wallet and enter amount!");
      return;
    }
    if (!isBuyMode && balance && parseFloat(balance) < amount) {
      console.log("Balance:", balance);
      alert("You don't have enough balance to sell!");
      return;
    }
    setLoading(true);
    try {
      const provider = new ethers.BrowserProvider(
        window.ethereum as unknown as ethers.Eip1193Provider
      );
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );

      if (isBuyMode) {
        const tx = await contract.buy(amount);
        console.log("Transaction was sent:", tx.hash);
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          alert(
            `Buy success ${received.toFixed(2)} MEME COIN! Transaction: ${tx.hash}`
          );
          fetchBalance(account); // Cập nhật số dư sau khi mua
        } else {
          alert("Transaction was failured!");
        }
        resetForm();
      } else {
        const tx = await contract.sell(amount);
        console.log("Transaction was sent:", tx.hash);
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          alert(
            `Sell success ${amount.toFixed(2)} MEME COIN! Transaction: ${tx.hash}`
          );
          fetchBalance(account); // Cập nhật số dư sau khi mua
        } else {
          alert("Transaction was failured!");
        }
        resetForm();
      }
    } catch (error) {
      console.error("Transaction was failured:", error);
      alert("Transaction was failured!");
    } finally {
      setLoading(false);
    }
  };

  const handleAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseFloat(e.target.value) : null;
    console.log("Amount:", value);
    setAmount(value);
    debouncedSetAmount(value);
  };

  const debouncedSetAmount = useCallback(
    debounce(async (value: number | null) => {
      if (!contractABI || value === null || value <= 0) return;
      try {
        const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
        const contract = new ethers.Contract(
          CONTRACT_ADDRESS,
          contractABI,
          provider
        );
        const received = await contract.calculateToken(value);
        setReceived(parseFloat(received));
      } catch (error) {
        console.error("Cannot get received token:", error);
      }
    }, 500),
    []
  );

  const toggleMode = () => {
    setIsBuyMode((prevMode) => !prevMode);
    resetForm();
  };

  const resetForm = () => {
    setAmount(0);
    setReceived(0);
  };

  return (
    <div className="bg-black p-4 rounded-lg text-white space-y-4 shadow-md border border-gray-700 max-w-sm mx-auto">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-thin text-slate-500 mb-1 uppercase">
            {isBuyMode ? "You pay" : "You sell"}
          </label>
          <input
            type="number"
            value={amount ?? ""}
            onChange={handleAmountChange}
            placeholder="0.00"
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={toggleMode}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded-full transition"
            title="Switch mode"
          >
            <ArrowsUpDownIcon className="h-6 w-6 text-white" />
          </button>
        </div>

        <div>
          <label className="block text-sm font-thin text-slate-500 mb-1 uppercase">
            You receive
          </label>
          <input
            type="number"
            value={received}
            readOnly
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 cursor-not-allowed"
          />
        </div>

        {!account ? (
          <button
            onClick={connectWallet}
            className="w-full py-2 rounded-md transition text-white font-bold bg-green-500 hover:bg-green-600"
          >
            Connect Wallet
          </button>
        ) : (
          <button
            onClick={handleTransaction}
            disabled={loading}
            className={`w-full py-2 rounded-md transition text-white font-bold ${
              loading
                ? "bg-gray-500"
                : isBuyMode
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {loading
              ? "Transaction in progress..."
              : isBuyMode
                ? "BUY"
                : "SELL"}
          </button>
        )}
      </div>
    </div>
  );
}
