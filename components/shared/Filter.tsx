"use client";
import React from "react";

interface Props {
  filters: {
    name: string;
    value: string;
  }[];
  otherClasses?: string;
  containerClasses?: string;
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select";
import { formUrlquery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const Filter = ({ filters, otherClasses, containerClasses }: Props) => {
  const searchparams = useSearchParams();
  const router = useRouter();

  const paramfilter = searchparams.get("filter");

  const handleUpdateparams = (value: string) => {
    const newurl = formUrlquery({
      params: searchparams.toString(),
      key: "filter",
      value,
    });
    router.push(newurl, { scroll: false });
  };
  return (
    <div className={`relative ${containerClasses}`}>
      <Select
        onValueChange={handleUpdateparams}
        defaultValue={paramfilter || undefined}
      >
        <SelectTrigger
          className={`${otherClasses} body-regular light-border background-light800_dark300 text-dark500_light700 border px-5 py-2.5`}
        >
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder="Select a Filter" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup className=" background-light800_dark300 text-dark500_light700 ">
            {filters.map((item) => {
              return (
                <SelectItem key={item.value} value={item.value}>
                  {item.name}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
