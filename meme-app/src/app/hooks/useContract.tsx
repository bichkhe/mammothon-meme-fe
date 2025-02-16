import { useReadContract } from "wagmi";
import contractABI from "@/contracts/MyContractABI.json";

const memeContractAddress = "0x133";
const useContract = () => {
  const result = useReadContract({
    contractABI,
    address: memeContractAddress,
    functionName: "totalSupply",
  });

  if (result.error) {
    console.error(result.error);
    return `Error: ${result.error}`;
  }

  return result;
};

export default useContract;
