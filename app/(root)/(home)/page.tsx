import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import LocalSearch from "@/components/search/LocalSearch";
import LocalSearchbar from "@/components/search/LocalSearch";
import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import Homefilters from "@/components/home/Homefilters";

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask-Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for questions"
          otherClasses="flex-1"
        />
        <Filter
          filters={HomePageFilters}
          otherClasses="mt-10 min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
        <Homefilters />
      </div>
    </>
  );
}
