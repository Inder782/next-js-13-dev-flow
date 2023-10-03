import Image from "next/image";
import React from "react";
import { Input } from "../ui/input";

const GlobalSearch = () => {
  return (
    <div className="relative w-full max-w-[600px] max-lg:hidden ">
      <div className="flex relative background-light800_darkgradient min-h-[56px] grow rounded-xl items-center gap-1 px-4 ">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={25}
          height={25}
          className="cursor-pointer"
        />
        <Input
          type="text"
          placeholder="Seach anything Locally"
          className="background-light800_darkgradient border-none shadow-none no-focus outline-none"
        />
      </div>
    </div>
  );
};

export default GlobalSearch;
