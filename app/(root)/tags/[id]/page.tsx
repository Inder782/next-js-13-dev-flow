import { getQuestionbytagsid } from "@/lib/actions/tags.actions";
import React from "react";
import LocalSearchbar from "@/components/search/LocalSearch";
import Noresult from "@/components/shared/Noresult";
import Questioncard from "@/components/cards/Questioncard";
import Pagination from "@/components/shared/Pagination";
import { IQUESTION } from "@/database/question.model";
import { URLProps } from "@/types";
const Page = async ({ params, searchParams }: URLProps) => {
  const results = await getQuestionbytagsid({
    tagId: params.id,
    page: searchParams.page ? +searchParams.page + 1 : 1,
    searchQuery: searchParams.q,
  });
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">{results.tagTitle}</h1>
      </div>
      <div className="mt-11 w-full">
        <LocalSearchbar
          route={`/tags/${params.id}`}
          iconPosition="left"
          imgSrc="/assets/icons/search.svg"
          placeholder="Search for Tag questions"
          otherClasses="flex-1"
        />
        <div className="mt-10 flex w-full flex-col gap-6">
          {results.questions.length > 0 ? (
            results.questions.map((question: IQUESTION) => (
              <Questioncard
                key={question._id}
                _id={question._id}
                title={question.title}
                //@ts-ignore
                tags={question.tags}
                //@ts-ignore
                author={question.author}
                upvotes={question.upvotes}
                views={question.views}
                answers={question.answers}
                createdAt={question.createdAt}
              />
            ))
          ) : (
            <Noresult
              title="There is no Tags question to show"
              description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
             discussion. our query could be the next big thing others learn from. Get
             involved! 💡"
              link="/ask-question"
              Linktitle="Ask a question"
            />
          )}
        </div>
      </div>
      <Pagination
        pageNumber={searchParams.page ? +searchParams.page : 1}
        isNext={results?.isNext}
      />
    </>
  );
};

export default Page;
