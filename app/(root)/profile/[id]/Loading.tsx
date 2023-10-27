import React from "react";

import { Skeleton } from "@/components/ui/skeleton";
const Loading = async () => {
  return (
    <>
      <section>
        <div className="flex flex-col items-start gap-4 lg:flex-row">
          <Skeleton className="w-32 h-28 rounded-full" />

          <div className="mt-3">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="mt-3 h-7 w-28" />

            <div className="mt-3 flex gap-4">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-7 w-20" />
            </div>
            <Skeleton className="mt-8 h-7 w-9/12" />
          </div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-5 xs:grid-cols-2 md:grid-cols-4">
          <Skeleton className="h-28 rounded-md" />
          <Skeleton className="h-28 rounded-md" />
          <Skeleton className="h-28 rounded-md" />
          <Skeleton className="h-28 rounded-md" />
        </div>
      </section>
    </>
  );
};

export default Loading;
