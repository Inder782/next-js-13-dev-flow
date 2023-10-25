"use client";
import { GlobalSearchFilters } from "@/constants/filters";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { formUrlquery } from "@/lib/utils";

// build out the entire ui ux first
// then build the logic

// other approach -> build out some features of the frontend then connect with backend

const GlobalFilters = () => {
  const router = useRouter();
  const searchparams = useSearchParams();
  const typeParams = searchparams.get("type");

  const [active, setactive] = useState(typeParams || "");
  const handleTypeClick = (type: string) => {
    if (active === type) {
      setactive(type);
      const newUrl = formUrlquery({
        params: searchparams.toString(),
        key: "filter",
        value: null,
      });
      router.push(newUrl, { scroll: false });
    } else {
      setactive(type);
      const newUrl = formUrlquery({
        params: searchparams.toString(),
        key: "filter",
        value: type.toLowerCase(),
      });
      router.push(newUrl, { scroll: false });
    }
  };
  return (
    <div className="flex types-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type:</p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((type) => (
          <button
            type="button"
            key={type.value}
            className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize dark:text-light-800 dark:hover:text-primary-500 ${
              active === type.value
                ? "bg-primary-500 text-light-900"
                : "bg-light-700 text-dark-400 hover:text-primary-500 dark:bg-dark-500"
            }`}
            onClick={() => handleTypeClick(type.value)}
          >
            {type.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
