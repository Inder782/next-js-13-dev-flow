import LocalSearchbar from "@/components/search/LocalSearch";
import Filter from "@/components/shared/Filter";
import { QuestionFilters } from "@/constants/filters";
import Noresult from "@/components/shared/Noresult";
import Questioncard from "@/components/cards/Questioncard";

import { auth } from "@clerk/nextjs";
import { Getsavedquestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
export default async function Home({ searchParams }: SearchParamsProps) {
  const { userId } = auth();
  if (!userId) {
    return null;
  }
  const result: any = await Getsavedquestions({
    clerkId: userId,
    searchQuery: searchParams.q,
  });
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">Saved questions</h1>
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
          filters={QuestionFilters}
          otherClasses="mt-10 min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />

        <div className="mt-10 flex w-full flex-col gap-6">
          {result.question.length > 0 ? (
            result.question.map((question: any) => (
              <Questioncard
                key={question._id}
                _id={question._id}
                title={question.title}
                tags={question.tags}
                author={question.author}
                upvotes={question.upvotes}
                views={question.views}
                answers={question.answers}
                createdAt={question.createdAt}
              />
            ))
          ) : (
            <Noresult
              title="There is no Questions to show"
              description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
            discussion. our query could be the next big thing others learn from. Get
            involved! 💡"
              link="/ask-question"
              Linktitle="Ask a question"
            />
          )}
        </div>
      </div>
    </>
  );
}
