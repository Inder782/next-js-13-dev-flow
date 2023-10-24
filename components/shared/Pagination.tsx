"use client";

import React from "react";
import { Button } from "../ui/button";
import { formUrlquery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  pageNumber: number;
  isNext: boolean | [] | undefined;
}
const Pagination = ({ pageNumber, isNext }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const HandleNavigation = (direction: string) => {
    const NextPagenumber =
      direction === "prev" ? pageNumber - 1 : pageNumber + 1;
    const newUrl = formUrlquery({
      params: searchParams.toString(),
      key: "page",
      value: NextPagenumber.toString(),
    });
    router.push(newUrl);
  };

  return (
    <>
      <div className="flex w-full items-center justify-center gap-2 mt-5">
        <Button
          disabled={pageNumber === 1}
          onClick={() => {
            HandleNavigation("prev");
          }}
          className="light-borer-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        >
          <p className="body-medium text-dark200_light800">Prev</p>
        </Button>
        <div className="bg-primary-500 flex justify-center items-center rounded-md px-3.5 py-2">
          <p className="body-semibold text-light-900">{pageNumber}</p>
        </div>
        <Button
          disabled={!isNext}
          onClick={() => {
            HandleNavigation("next");
          }}
          className="light-borer-2 btn flex min-h-[36px] items-center justify-center gap-2 border"
        >
          <p className="body-medium text-dark200_light800">Next</p>
        </Button>
      </div>
    </>
  );
};

export default Pagination;
