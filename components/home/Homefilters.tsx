"use client";
import { HomePageFilters } from "@/constants/filters";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { formUrlquery } from "@/lib/utils";

const Homefilters = () => {
  const searchparams = useSearchParams();
  const [active, setactive] = useState("");
  const router = useRouter();
  const handleTypeClick = (item: string) => {
    if (active === item) {
      setactive(item);
      const newUrl = formUrlquery({
        params: searchparams.toString(),
        key: "filter",
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setactive(item);
      const newUrl = formUrlquery({
        params: searchparams.toString(),
        key: "filter",
        value: item.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <div className="mt-10 hidden flex-wrap gap-3 md:flex">
      {HomePageFilters.map((item) => {
        return (
          <Button
            key={item.value}
            onClick={() => {}}
            className={`body-medium rounded-lg px-6 py-3 capitalize shadow-none ${
              active === item.value
                ? "bg-primary-100 text-primary-500"
                : "bg-light-800 text-light-500"
            }`}
            onClickCapture={() => {
              handleTypeClick(item.value);
            }}
          >
            {item.name}
          </Button>
        );
      })}
    </div>
  );
};

export default Homefilters;
