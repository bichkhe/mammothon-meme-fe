import React from "react";
import Logo from "./logo";
import { Button } from "@/components/ui/button";

const NavBar = () => {
  return (
    <nav className="w-full flex justify-between items-center gap-2">
      <Logo />
      <ul className="flex justify-between m-1 items-center gap-4 h-16 text-black shadow-md font-mono">
        <li className="hover:bg-slate-900 rounded-md hover:text-white">
          <a href="#home" className="p-2">
            Home
          </a>
        </li>
        <li className="hover:bg-slate-900 rounded-md hover:text-white">
          <a href="#home" className="p-2">
            Pools
          </a>
        </li>
        <li className="hover:bg-slate-900 rounded-md hover:text-white">
          <a href="#home" className="p-2">
            Launch
          </a>
        </li>
        <li className="hover:bg-slate-900 rounded-md hover:text-white">
          <a href="#home" className="p-2">
            Docs
          </a>
        </li>
        <li>
          <Button>Connect Wallet</Button>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
