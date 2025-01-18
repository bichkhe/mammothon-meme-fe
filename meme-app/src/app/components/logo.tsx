import React from "react";
import Image from "next/image";
import { MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
const Logo = () => {
  return (
    <>
      <div className="logo m-4 flex items-center justify-between flex-1 md:flex-none">
        <Image
          src="/logo.png"
          alt="Logo"
          width={100}
          height={100}
          className="mr-2"
        />{" "}
        <span className="text-xl font-bold hidden md:block">
          {" "}
          Rust Warriors
        </span>
        <Button variant="ghost" className="md:hidden" asChild>
          <MenuIcon size={50} className="md:hidden min-w-[30px]" />
        </Button>
      </div>
    </>
  );
};

export default Logo;
