"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { usePathname, useSearchParams } from "next/navigation";
import { formUrlquery, removekeyfromquery } from "@/lib/utils";

interface CustomInputProps {
  route: string;
  iconPosition: string;
  imgSrc: string;
  placeholder: string;
  otherClasses: string;
}
const LocalSearchbar = ({
  route,
  iconPosition,
  imgSrc,
  placeholder,
  otherClasses,
}: CustomInputProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchparams = useSearchParams();

  const query = searchparams.get("q");
  const [search, setSearch] = useState(query || "");

  useEffect(() => {
    const dealayDebounceFn = setTimeout(() => {
      if (search) {
        const newurl = formUrlquery({
          params: searchparams.toString(),
          key: "q",
          value: search,
        });
        router.push(newurl, { scroll: false });
      } else {
        console.log(route, pathname);
        if (pathname === route) {
          const newUrl = removekeyfromquery({
            params: searchparams.toString(),
            keytoRemove: ["q"],
          });
          router.push(newUrl, { scroll: false });
        }
      }
    }, 300);
    return () => clearTimeout(dealayDebounceFn);
  }, [search, route, pathname, searchparams]);
  return (
    <div
      className={`background-light800_darkgradient relative flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4${otherClasses}`}
    >
      {iconPosition === "left" && (
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
      <Input
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className="paragraph-regular no-focus placeholder background-light800_darkgradient text-dark-800 dark:text-light-800 border-none shadow-none outline-none"
      />
      {iconPosition === "right" && (
        <Image
          src="/assets/icons/search.svg"
          alt="search"
          width={24}
          height={24}
          className="cursor-pointer"
        />
      )}
    </div>
  );
};

export default LocalSearchbar;
