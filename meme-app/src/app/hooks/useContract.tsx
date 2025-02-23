import { useReadContract } from "wagmi";
import memeContractABI from "@/contracts/MemeContract.json";

const memeContractAddress = "0xf3DB161c2Af54157772e734fb17f6bC1217D36A5";
const useContract = (functionName: string, args: string[]) => {
  const result = useReadContract({
    abi: memeContractABI,
    address: memeContractAddress,
    functionName: functionName,
    args: args,
  });

  if (result.error) {
    console.error(result.error);
    return `Error: ${result.error}`;
  }

  return result;
};

export default useContract;
