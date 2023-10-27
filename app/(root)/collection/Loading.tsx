import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <section className=" ">
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="mt-11 justify-between gap-5 max-sm:flex-col sm:items-center">
        <div className="mt-10 min-h-[56px] sm:min-w-[170px]">
          <Skeleton className="h-12 min-w-[650px]" />
          <Skeleton className="mt-10 h-14 w-28" />
        </div>
        <div className="flex flex-wrap mt-10 gap-4 ">
          {[1, 2, 3].map((item) => (
            <Skeleton key={item} className="flex h-32 w-[3200px] " />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Loading;
