import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";
import React from "react";
import { MenuItems } from "../constant";

const Menu = () => {
  return (
    <ul className="flex justify-between m-1 items-center gap-4 h-16 text-black shadow-md font-mono">
      {MenuItems.map((item) => (
        <li
          className="hover:bg-slate-900 rounded-md hover:text-white"
          key={item.name}
        >
          <Link href="#home" className="p-2">
            {item.name}
          </Link>
        </li>
      ))}
      <li>
        <Button>Connect Wallet</Button>
      </li>
    </ul>
  );
};

export default Menu;
