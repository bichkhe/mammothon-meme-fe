import React from "react";
import Image from "next/image";
const Logo = () => {
  return (
    <>
      <div className="logo h-16 w-16 m-4">
        <Image src="logo.png" alt="Logo" />
      </div>
      <div className="text-xl font-bold"> Rust Warriors</div>
    </>
  );
};

export default Logo;
