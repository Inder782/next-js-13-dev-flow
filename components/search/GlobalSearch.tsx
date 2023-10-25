"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { formUrlquery, removekeyfromquery } from "@/lib/utils";
import GlobalResult from "../shared/GlobalResult";

const GlobalSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchparams = useSearchParams();

  const query = searchparams.get("global");
  const [search, setSearch] = useState(query || "");
  const [isOpen, setisOpen] = useState(false);
  const searchContainerRef = useRef(null);
  useEffect(() => {
    const handleoutsideclick = (event: any) => {
      if (
        searchContainerRef.current &&
        //@ts-ignore
        !searchContainerRef.current.contains(event.target)
      ) {
        setisOpen(false);
        setSearch("");
      }
    };
    setisOpen(false);
    document.addEventListener("click", handleoutsideclick);
    return () => {
      document.removeEventListener("click", handleoutsideclick);
    };
  }, [pathname]);

  useEffect(() => {
    const dealayDebounceFn = setTimeout(() => {
      if (search) {
        const newurl = formUrlquery({
          params: searchparams.toString(),
          key: "global",
          value: search,
        });
        router.push(newurl, { scroll: false });
      } else {
        console.log(router, pathname);
        if (query) {
          const newUrl = removekeyfromquery({
            params: searchparams.toString(),
            keytoRemove: ["global"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(dealayDebounceFn);
  }, [search, router, pathname, searchparams, query]);
  return (
    <div
      className="relative w-full max-w-[600px] max-lg:hidden "
      ref={searchContainerRef}
    >
      <div className="flex relative background-light800_darkgradient min-h-[56px] grow rounded-xl items-center gap-1 px-4">
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={25}
          height={25}
          className="cursor-pointer"
        />
        <Input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!isOpen) setisOpen(true);

            if (e.target.value === "" && isOpen) setisOpen(false);
          }}
          placeholder="Seach anything Globally"
          className="background-light800_darkgradient text-dark-900 dark:text-light-800 border-none shadow-none no-focus outline-none"
        />
      </div>
      {isOpen && <GlobalResult />}
    </div>
  );
};

export default GlobalSearch;
