import { format } from "date-fns";
import { ethers } from "ethers";

interface DecodedData {
  sender: string;
  eth: string;
  amount: string;
  time: string;
  t_type: string;
  price: string;
}

interface TransactionsProps {
  decodedDataArray: DecodedData[];
}

export default function Transactions({ decodedDataArray }: TransactionsProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(parseFloat(timestamp) * 1000);
    return format(date, "MM/dd, hh:mm a");
  };

  const formatAmount = (amount: string) => {
    return parseFloat(amount).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 20,
    });
  };

  return (
    <div className="bg-black p-4 mb-4 rounded-lg overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="bg-gray-800 text-gray-400 uppercase">
          <tr>
            <th className="px-4 py-2 whitespace-nowrap">RANK</th>
            <th className="px-4 py-2 whitespace-nowrap">ETH</th>
            <th className="px-4 py-2 whitespace-nowrap">AMOUNT</th>
            <th className="px-4 py-2 whitespace-nowrap">TIME</th>
            <th className="px-4 py-2 whitespace-nowrap">PRICE</th>
            <th className="px-4 py-2 whitespace-nowrap">SENDER</th>
          </tr>
        </thead>
        <tbody>
          {decodedDataArray.map((tx, index) => (
            <tr
              key={index}
              className="border-b border-gray-700 hover:bg-gray-800 transition"
            >
              <td className="px-4 py-2 whitespace-nowrap">{index + 1}</td>
              <td className="px-4 py-2 whitespace-nowrap">
                {formatAmount(ethers.formatEther(tx.eth))}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {formatAmount(tx.amount)}
              </td>
              <td className="px-4 py-2 whitespace-nowrap">
                {formatTime(tx.time)}
              </td>
              <td className="px-4 py-2 text-green-400 whitespace-nowrap">
                {formatAmount(ethers.formatEther(tx.price))}
              </td>
              <td className="px-4 py-2 truncate whitespace-nowrap">
                {tx.sender}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
