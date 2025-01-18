import React from "react";
import Image from "next/image";
const Logo = () => {
  return (
    <>
      <div className="logo m-4 flex items-center">
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
      </div>
    </>
  );
};

export default Logo;
