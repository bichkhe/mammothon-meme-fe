"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemeStore } from "@/store/meme";
import { ArrowBigLeft, ArrowBigRight } from "lucide-react";
import React, { useState } from "react";

const MemeSearch = () => {
  const [query, setQuery] = useState("");
  // const [page, setPage] = useState(1);
  const { setSearchText, setPage, currentPage } = useMemeStore();
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSearchText(value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="p-4 text-white bg-black rounded-xl gap-2 ">
      <span className="text-white">Search</span>
      <div className="flex items-center gap-2">
        <Input
          value={query}
          onChange={handleSearchChange}
          // placeholder="Search memes..."
          className="max-w-xl"
        />
        <div className="flex-1"></div>
        <div className="flex gap-2">
          <div>Current page: {currentPage}</div>
          <Button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="w-full"
          >
            <ArrowBigLeft />
          </Button>
          <Button
            onClick={() => handlePageChange(currentPage + 1)}
            className="w-full"
          >
            <ArrowBigRight />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemeSearch;
