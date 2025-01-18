import React from "react";
import Logo from "./logo";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const NavBar = () => {
  return (
    <nav className="w-full flex justify-between items-center gap-2">
      <Logo />
      <ul className="flex justify-between m-1 items-center gap-4 h-16 text-black shadow-md font-mono">
        <li className="hover:bg-slate-900 rounded-md hover:text-white">
          <Link href="#home" className="p-2">
            Home
          </Link>
        </li>
        <li className="hover:bg-slate-900 rounded-md hover:text-white">
          <Link href="#home" className="p-2">
            Pools
          </Link>
        </li>
        <li className="hover:bg-slate-900 rounded-md hover:text-white">
          <Link href="#home" className="p-2">
            Launch
          </Link>
        </li>
        <li className="hover:bg-slate-900 rounded-md hover:text-white">
          <Link href="#home" className="p-2">
            Docs
          </Link>
        </li>
        <li>
          <Button>Connect Wallet</Button>
        
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
