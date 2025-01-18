import React from "react";
import Logo from "./logo";
import Menu from "./menu";
import { MenuItems } from "../constant";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const NavBar = () => {
  return (
    <nav className="flex w-full justify-between items-center gap-2">
      <Logo />
      {/* <Menu /> */}
      <ul className="hidden md:flex justify-between m-1 items-center gap-4 h-16 text-black shadow-md font-mono">
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
    </nav>
  );
};

export default NavBar;
