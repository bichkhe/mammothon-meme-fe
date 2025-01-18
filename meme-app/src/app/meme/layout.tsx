import React from "react";
import NavBar from "../components/navbar"; // Adjust the import path as necessary
const MainHomeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen min-h-screen max-h-screen overflow-auto bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <NavBar />
      <div className="flex flex-col w-full h-full">{children}</div>
    </div>
  );
};

export default MainHomeLayout;
