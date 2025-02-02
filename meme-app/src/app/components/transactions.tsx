interface Transaction {
  rank: number;
  apt: number;
  price: string;
  amount: number;
  time: string;
  sender: string;
}

const transactions: Transaction[] = [
  {
    rank: 1,
    apt: 0.495,
    price: "0.00000982",
    amount: 98.84,
    time: "01/31, 05:26 AM",
    sender: "qptosnoob",
  },
  {
    rank: 2,
    apt: 0.297,
    price: "0.00000964",
    amount: 29.8,
    time: "01/28, 09:12 PM",
    sender: "0x4DA5...BC29",
  },
  {
    rank: 3,
    apt: 10.89,
    price: "0.00000912",
    amount: 1213.41,
    time: "01/29, 03:04 PM",
    sender: "0x609B...A80E",
  },
  {
    rank: 4,
    apt: 9.9,
    price: "0.00000895",
    amount: 1082.17,
    time: "01/28, 11:20 AM",
    sender: "didky",
  },
  {
    rank: 5,
    apt: 0.465,
    price: "0.00000932",
    amount: 51.56,
    time: "01/28, 01:33 PM",
    sender: "mudossrm",
  },
];

export default function Transactions() {
  return (
    <div className="bg-black p-4 mb-4 rounded-lg overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="bg-gray-800 text-gray-400 uppercase">
          <tr>
            <th className="px-4 py-2">RANK</th>
            <th className="px-4 py-2">APT</th>
            <th className="px-4 py-2">AMOUNT</th>
            <th className="px-4 py-2">TIME</th>
            <th className="px-4 py-2">PRICE</th>
            <th className="px-4 py-2">SENDER</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx) => (
            <tr
              key={tx.rank}
              className="border-b border-gray-700 hover:bg-gray-800 transition"
            >
              <td className="px-4 py-2">{tx.rank}</td>
              <td className="px-4 py-2">{tx.apt}</td>
              <td className="px-4 py-2">{tx.amount.toFixed(2)}</td>
              <td className="px-4 py-2">{tx.time}</td>
              <td className="px-4 py-2 text-green-400">{tx.price}</td>
              <td className="px-4 py-2 truncate">{tx.sender}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
