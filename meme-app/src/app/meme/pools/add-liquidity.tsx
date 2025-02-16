import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const AddLiquidity = () => {
  return (
    <div className="p-8 w-[80%]">
      <div className="text-xl"> ADD LIQUIDITY </div>
      <div className="border-2">
        <div className="p-1 border-b-2">
          <span className="text-sm text-gray-500">
            YOU DEPOSIT (BALANCE: 0){" "}
          </span>
          <Input type="number" value={1} className="border-none" />
        </div>
        <div className="p-1 border-b-2">
          <span className="text-sm text-gray-500">
            YOU DEPOSIT (BALANCE: 0){" "}
          </span>
          <br />
          <span className="pl-3 text-sm">0 </span>
        </div>
        <div className="p-1">
          <span className="text-sm text-gray-500">YOU GET (BALANCE: 0) </span>
          <br />
          <span className="pl-3 text-sm">0 </span>
        </div>
      </div>

      <div className="flex m-3 justify-center">
        <Button className="text-xl"> CONNECT WALLET </Button>
      </div>

      <div className="text-xl"> RESERVES </div>
      <div className="border-2">
        <div className="relative p-1 flex">
          <Image
            src="https://cdn-icons-png.flaticon.com/512/648/648270.png"
            alt="apt"
            width={24}
            height={24}
          />
          <span className="absolute pr-1 right-0"> 1000.123 </span>
        </div>
        <div className="relative p-1 flex">
          <Image
            src="https://cdn-icons-png.flaticon.com/512/1078/1078454.png"
            alt="coin"
            width={24}
            height={24}
          />
          <span className="absolute pr-1 right-0"> 333542.123 </span>
        </div>
      </div>
    </div>
  );
};

export default AddLiquidity;
