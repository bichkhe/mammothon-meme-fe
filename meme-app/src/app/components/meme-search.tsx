"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";

const MemeSearch = () => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="flex justify-between items-center p-4 text-white gap-2">
      <Input
        value={query}
        onChange={handleSearchChange}
        // placeholder="Search memes..."
      />
      {/* <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        placeholder="Search memes..."
      /> */}
      <div className="flex flex-col gap-2">
        <span>Page {page}</span>
        <Button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="w-full"
        >
          Previous
        </Button>
        <Button onClick={() => handlePageChange(page + 1)} className="w-full">
          Next
        </Button>
      </div>
    </div>
  );
};

export default MemeSearch;
