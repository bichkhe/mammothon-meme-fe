import { ArrowRight } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";

interface MemeItemProps {
  // Define the props for the MemeItem component
  addr: string;
  icon: string;
  name: string;
  marketCap: string;
  price: string;
  last_swap_at: string;
  current_minted_token: number;
}

const formatAmount = (amount: string) => {
  return parseFloat(amount).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 20,
  });
};
const MemeItem = ({
  icon,
  name,
  addr,
  price,
  current_minted_token,
}: MemeItemProps) => {
  const router = useRouter();

  const handleRedirect = () => {
    router.push(`/meme/market?addr=${addr}`);
  };

  return (
    <div
      className="meme-item hover:border-blue-500 hover:border-4 bg-black p-4 text-white border-2 border-gray-700 hover:text-blue-600 cursor-pointer"
      onClick={handleRedirect}
    >
      <div className="meme-header">
        <div className="flex justify-between">
          <span className="text-2xl text-gray-400">101</span>
          <ArrowRight className="text-2xl text-gray-400" />
        </div>

        <div className="flex flex-col gap-4 justify-center items-center">
          {/* <Smile className="h-12 w-12" /> */}
          <img src={icon} alt={name} className="h-16 w-16" />
          <span className="text-2xl font-semibold uppercase overflow-hidden">
            {name}
          </span>
        </div>
      </div>
      <div className="flex gap-4 mt-5">
        <div className="flex flex-col overflow-auto">
          <span className="body-sm  text-light-gray group-hover:text-ec-blue uppercase p-[1px] transition-all font-thin text-slate-500">
            Market Cap
          </span>
          <span className="text-sm text-cyan-500 overflow-hidden">
            {current_minted_token &&
              price &&
              formatAmount(
                (parseFloat(price) * current_minted_token) / 1e18
              ).toString()}
            {!current_minted_token && 0} ETH
          </span>
        </div>
        <div className="flex flex-col">
          <span className="body-sm font-forma text-light-gray group-hover:text-ec-blue uppercase p-[1px] transition-all font-thin text-slate-500">
            Last Price
          </span>
          <span className="text-sm text-cyan-500 overflow-hidden">
            {formatAmount(price / 1e18)} ETH
          </span>
        </div>
      </div>
    </div>
  );
};

export default MemeItem;
