import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import LocalSearch from "@/components/search/LocalSearch";
import LocalSearchbar from "@/components/search/LocalSearch";
import Filter from "@/components/shared/Filter";
import { HomePageFilters } from "@/constants/filters";
import Homefilters from "@/components/home/Homefilters";
import Noresult from "@/components/shared/Noresult";
import Questioncard from "@/components/cards/Questioncard";
const questions = [
  {
    _id: "1",
    title: "Cascading Deletes in SQLALchemy?",
    tags: [
      { _id: "1", name: "python" },
      { _id: "2", name: "javascript" },
    ],
    authors: {
      _id: "author1",
      name: "John Doe",
      picture: "url_to_picture",
    },
    upvotes: 10000000,
    views: 10000000,
    answers: [
      { answerId: "answer1", text: "Sample answer 1" },
      { answerId: "answer2", text: "Sample answer 2" },
    ],
    createdAt: new Date("2021-01-01T12:00:00.000Z"),
  },
  {
    _id: "2",
    title: "How to center a div",
    tags: [
      { _id: "3", name: "CSS" },
      { _id: "4", name: "javascript" },
    ],
    authors: {
      _id: "author2",
      name: "Jane Doe",
      picture: "url_to_picture",
    },
    upvotes: 1500,
    views: 120000,
    answers: [
      { answerId: "answer3", text: "Sample answer 3" },
      { answerId: "answer4", text: "Sample answer 4" },
    ],
    createdAt: new Date("2021-02-01T12:00:00.000Z"),
  },
];

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
        <div className="mt-10 flex w-full flex-col gap-6">
          {questions.length > 0 ? (
            questions.map((question) => (
              <Questioncard
                key={question._id}
                _id={question._id}
                title={question.title}
                tags={question.tags}
                authors={question.authors}
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
