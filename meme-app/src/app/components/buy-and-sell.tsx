"use client";
import { useState } from "react";
import { ArrowsUpDownIcon } from "@heroicons/react/24/solid";

export default function BuyAndSell() {
  const [amount, setAmount] = useState<number>(0);
  const [received, setReceived] = useState<number>(0);
  const [exchangeRate] = useState<number>(98.84);
  const [isBuyMode, setIsBuyMode] = useState<boolean>(true);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(value);
    setReceived(value * exchangeRate);
  };

  const handleTransaction = () => {
    if (amount > 0) {
      const action = isBuyMode ? "Buy" : "Sell";
      alert(`${action} success ${received.toFixed(2)} MEME COIN! 🚀`);
      resetForm();
    } else {
      alert("Please enter a valid amount!");
    }
  };

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
            value={amount || amount.toFixed(2)}
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
            value={received.toFixed(2)}
            readOnly
            className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 cursor-not-allowed"
          />
        </div>

        <button
          onClick={handleTransaction}
          className={`w-full py-2 rounded-md transition text-white font-bold ${
            isBuyMode
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isBuyMode ? "BUY" : "SELL"}
        </button>
      </div>

      <div className="text-center pt-4 border-t border-gray-600">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition">
          Connect Wallet
        </button>
      </div>
    </div>
  );
}
