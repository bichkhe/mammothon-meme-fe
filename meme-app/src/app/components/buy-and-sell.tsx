"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";
import { ethers } from "ethers";
import contractABI from "@/contracts/MemeCoin.json";
import { debounce } from "lodash";

const CONTRACT_ADDRESS = "0xef7655770f76676B4323ddEb84ac5e1FfB7F6F7A";
const INFURA_PROJECT_ID = "e11fea93e1e24107aa26935258904434";
const SEPOLIA_RPC_URL = `https://base-sepolia.infura.io/v3/${INFURA_PROJECT_ID}`;

export default function BuyAndSell() {
  const [received, setReceived] = useState<number>(0);
  const [isBuyMode, setIsBuyMode] = useState<boolean>(true);
  const [amount, setAmount] = useState<number | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const isBuyModeRef = useRef(isBuyMode);
  const balanceRef = useRef(balance);

  // Tạo kiểu mở rộng Eip1193Provider với các thuộc tính riêng của ví
  interface ExtendedEip1193Provider extends ethers.Eip1193Provider {
    isMetaMask?: boolean;
    isCoinbaseWallet?: boolean;
    isTrust?: boolean;
    isBraveWallet?: boolean;
  }

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Cannot connect to Wallet!");
      return;
    }
    try {
      let provider: ethers.BrowserProvider | null = null;

      if (Array.isArray(window.ethereum.providers)) {
        // Ưu tiên chọn MetaMask khi có nhiều provider
        const metamaskProvider = window.ethereum.providers.find(
          (p: ExtendedEip1193Provider) => p.isMetaMask
        );
        if (metamaskProvider) {
          provider = new ethers.BrowserProvider(metamaskProvider);
          console.log("Selected MetaMask provider");
        } else {
          // Nếu không tìm thấy MetaMask, chọn provider đầu tiên
          provider = new ethers.BrowserProvider(
            window.ethereum.providers[0] as ethers.Eip1193Provider
          );
          console.log("Selected first available provider");
        }
      } else {
        // Nếu chỉ có một provider
        provider = new ethers.BrowserProvider(
          window.ethereum as unknown as ethers.Eip1193Provider
        );
        console.log("Selected single provider");
      }

      if (!provider) {
        alert("No provider available!");
        return;
      }

      const accounts = await provider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        console.log("Connected Account:", accounts[0]);
        fetchBalance(accounts[0]);
      } else {
        console.warn("No accounts found.");
      }
    } catch (error) {
      console.error("Cannot connect to Wallet:", error);
      alert("Failed to connect to MetaMask.");
    }
  };

  // Check connection and fetch balance when component mounted
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum) {
        try {
          let provider: ethers.BrowserProvider | null = null;

          if (Array.isArray(window.ethereum.providers)) {
            // Ưu tiên chọn MetaMask khi có nhiều provider
            const metamaskProvider = window.ethereum.providers.find(
              (p: ExtendedEip1193Provider) => p.isMetaMask
            );
            if (metamaskProvider) {
              provider = new ethers.BrowserProvider(metamaskProvider);
              console.log("Selected MetaMask provider");
            } else {
              // Nếu không tìm thấy MetaMask, chọn provider đầu tiên
              provider = new ethers.BrowserProvider(
                window.ethereum.providers[0] as ethers.Eip1193Provider
              );
              console.log("Selected first available provider");
            }
          } else {
            // Nếu chỉ có một provider
            provider = new ethers.BrowserProvider(
              window.ethereum as unknown as ethers.Eip1193Provider
            );
            console.log("Selected single provider");
          }

          if (provider) {
            const accounts = await provider.send("eth_requestAccounts", []);
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              console.log("Connected Account:", accounts[0]);
              fetchBalance(accounts[0]);
            } else {
              console.warn("No accounts found.");
            }
          }
        } catch (error) {
          console.error("Cannot check wallet connection:", error);
        }
      }
    };

    checkWalletConnection();
  }, []);

  const fetchBalance = async (userAddress: string) => {
    try {
      const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        provider
      );
      const balance = await contract.balanceOf(userAddress);
      setBalance(parseFloat(balance));
      console.log("User Address:", userAddress);
      console.log("Balance:", parseFloat(balance).toFixed(2));
    } catch (error) {
      console.error("Cannot get balance:", error);
    }
  };

  // Buy or Sell token
  const handleTransaction = async () => {
    if (!amount || !account || !contractABI.abi) {
      alert("Please connect wallet and enter amount!");
      return;
    }
    if (!isBuyMode && balance && balance < amount) {
      console.log("Balance:", balance);
      alert("You don't have enough balance to sell! Balance: " + balance);
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
        contractABI.abi,
        signer
      );

      if (isBuyMode) {
        const amountInWei = ethers.parseUnits(amount.toString(), 18);
        console.log("Amount in Wei:", amountInWei);

        // Listen to Buy event
        contract.once("Buy", (buyer, amountETH, amountToken) => {
          try {
            console.log("Buy event received:", {
              buyer,
              amountETH: ethers.formatEther(amountETH),
              amountToken: ethers.formatUnits(amountToken, 18),
            });

            if (buyer.toLowerCase() === account?.toLowerCase()) {
              alert(
                `You bought ${ethers.formatUnits(amountToken, 18)} MEME COIN for ${ethers.formatEther(amountETH)} ETH!`
              );
            }
          } catch (eventError) {
            console.error("Error while processing Buy event:", eventError);
            alert("An error occurred while processing the Buy event!");
          }
        });

        const tx = await contract.buy({ value: amountInWei });
        console.log("Transaction was sent:", tx.hash);
        const receipt = await tx.wait();

        if (receipt.status === 1) {
          alert(`Buy success! Transaction: ${tx.hash}`);
          console.log(`Buy success! Transaction: ${tx.hash}`);
          fetchBalance(account); // Cập nhật số dư sau khi mua
        } else {
          alert("Transaction failed!");
          console.log("Transaction failed!");
        }

        resetForm();
      } else {
        const tx = await contract.sell(amount);
        console.log("Transaction was sent:", tx.hash);
        const receipt = await tx.wait();
        if (receipt.status === 1) {
          alert(`Sell success! Transaction: ${tx.hash}`);
          console.log(`Sell success! Transaction: ${tx.hash}`);
          fetchBalance(account); // Cập nhật số dư sau khi mua
        } else {
          alert("Transaction failed!");
          console.log("Transaction failed!");
        }
        resetForm();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          "Transaction error:",
          JSON.stringify(error, Object.getOwnPropertyNames(error), 2)
        );

        if (typeof error === "object" && error !== null && "message" in error) {
          console.error("Error message:", error.message);
          if ("code" in error && error.code === "ACTION_REJECTED") {
            console.error("Error code:", error.code);
            alert("Transaction was rejected by the user.");
          } else if ("code" in error && error.code === "CALL_EXCEPTION") {
            alert("Transaction failed! Please check your balance.");
          } else if ("code" in error && error.code === "INVALID_ARGUMENT") {
            alert("Transaction failed! Invalid amount.");
          } else {
            alert(
              "An unexpected error occurred while processing the transaction."
            );
          }
        }
      } else {
        console.error("Unknown error:", error);
        alert("An unknown error occurred.");
      }
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

  const calculateReceivedToken = async (value: number | null) => {
    if (!contractABI.abi || value === null || value <= 0) return;
    try {
      const provider = new ethers.JsonRpcProvider(SEPOLIA_RPC_URL);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        provider
      );
      console.log("Current value of isBuyMode:", isBuyModeRef.current);
      if (isBuyModeRef.current) {
        const valueInWei = ethers.parseUnits(value.toString(), 18);
        const received = await contract.calculateToken(valueInWei);
        console.log("Received when buy:", received);
        setReceived(parseFloat(received));
      } else {
        const received = await contract.calculateTokenSell(value);
        console.log(
          "Received when sell:",
          parseFloat(ethers.formatEther(received))
        );
        setReceived(parseFloat(ethers.formatEther(received)));
      }
    } catch (error) {
      console.error("Cannot get received token:", error);
    }
  };

  const debouncedSetAmount = useCallback(
    debounce((value: number | null) => {
      calculateReceivedToken(value);
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

  useEffect(() => {
    console.log("Loading updated:", loading);
  }, [loading]);

  useEffect(() => {
    balanceRef.current = balance;
  }, [balance]);

  useEffect(() => {
    isBuyModeRef.current = isBuyMode;
    console.log("isBuyMode changed:", isBuyMode);
    if (isBuyMode) {
      setAmount(0);
      setReceived(0);
    } else {
      setAmount(balanceRef.current);
      calculateReceivedToken(balanceRef.current);
    }
  }, [isBuyMode]);

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
