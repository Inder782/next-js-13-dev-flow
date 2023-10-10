import React from "react";
import LocalSearchbar from "@/components/search/LocalSearch";
import Filter from "@/components/shared/Filter";
import { UserFilters } from "@/constants/filters";
import { getAllusers } from "@/lib/actions/user.action";
import Link from "next/link";
import Usercard from "@/components/cards/Usercard";

const Page = async () => {
  const results = await getAllusers({});
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">All users</h1>
      <div className="mt-11 justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchbar
          route="/"
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Amazing Minds"
          otherClasses="flex-1"
        />
        <Filter
          filters={UserFilters}
          otherClasses="mt-10 min-h-[56px] sm:min-w-[170px]"
        />
      </div>
      <section className="mt-12 flex flex-wrap gap-4">
        {results?.users.length > 0 ? (
          results?.users.map((user) => (
            <Usercard key={user._id} user={user}></Usercard>
          ))
        ) : (
          <div className="paragraph-regular text-dark200_light800 mx-auto max-w-4xl text-center">
            <p>No Users yet</p>
            <Link href="/sign-up" className="mt-2 font-bold text-accent-blue">
              Join to be the first
            </Link>
          </div>
        )}
      </section>
    </>
  );
};

export default Page;
