import React from "react";
import LocalSearchbar from "@/components/search/LocalSearch";
import Filter from "@/components/shared/Filter";
import { UserFilters } from "@/constants/filters";
import Link from "next/link";
import Noresult from "@/components/shared/Noresult";
import { getAlltags } from "@/lib/actions/tags.actions";
import { SearchParamsProps } from "@/types";

const Page = async ({ searchParams }: SearchParamsProps) => {
  const result = await getAlltags({
    searchQuery: searchParams.q,
  });
  console.log(result);
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All Tags</h1>
      <div className="mt-11 justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/tags"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for tags"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses="mt-10 min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {result.tags.length > 0 ? (
          result.tags.map((tag) => (
            <Link
              href={`/tags/${tag._id}`}
              key={tag._id}
              className="shadow-light100_dark800"
            >
              <article className="background-light900_dark200 shadow-sm flex w-full flex-col rounded-2xl border px-8 py-8 sm:w-[260px]">
                <div className="background-light800_dark400 w-fit rounded-xl px-5 py-1.5">
                  <p className="paragraph-semibold text-dark300_light900">
                    {tag.name}
                  </p>
                </div>
                <p className="paragraph-semibold text-dark300_light900 mt-3.5">
                  <span className="body-semibold primary-text-gradient mr-2.5">
                    {tag.question.length} Questions
                  </span>
                </p>
              </article>
            </Link>
          ))
        ) : (
          <Noresult
            title="No tags found"
            description="It looks like there are not tags around"
            link="/ask-questions"
            Linktitle="ask a question"
          />
        )}
      </section>
    </>
  );
};

export default Page;
