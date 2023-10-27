import React from "react";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filters";
import { Getallanswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import Pagination from "./Pagination";

interface Props {
  questionId: string;
  userid: string;
  totalAnswers: string;
  page?: number;
  filter?: string | undefined;
}
const Allanswers = async ({
  questionId,
  userid,
  totalAnswers,
  page,
  filter,
}: Props) => {
  const results = await Getallanswers({
    questionId,
    page: page ? +page : 1,
    sortBy: filter,
  });
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between ">
        <h3 className="primary-text-gradient">{totalAnswers} Answers</h3>
        <Filter filters={AnswerFilters} />
      </div>
      <div>
        {results.answers.map((answer) => (
          <article key={answer._id} className="light-border border-b py-10">
            <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center">
              <Link
                href={`/profile/${answer.author.clerkId}`}
                className="flex flex-1 items-start gap-1 sm:items-center"
              >
                <Image
                  src={answer.author.picture}
                  width={18}
                  height={18}
                  alt="user"
                  className="rounded full object-cover max-sm:mt-0.5"
                />
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="body-semibold text-dark300_light700">
                    {answer.author.name}{" "}
                  </p>
                  <p className="small-regular text-light400_light500 mt-0.5 line-clamp-1 ml-0.5 ">
                    <span className="mx-sm:hidden">
                      {""}- answered {""} {getTimestamp(answer.createdAt)}
                    </span>
                  </p>
                </div>
              </Link>
              <div className="flex justify-end">
                <Votes
                  type="Answer"
                  itemId={JSON.stringify(answer._id)}
                  userId={JSON.stringify(userid)}
                  upvotes={answer.upvotes.length}
                  downvotes={answer.downvotes.length}
                  hasupVoted={answer.upvotes.includes(userid)}
                  hasdownVoted={answer.downvotes.includes(userid)}
                />
              </div>
            </div>

            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
      <Pagination
        pageNumber={page ? +page : 1}
        isNext={results?.isNextAnswer}
      />
    </div>
  );
};

export default Allanswers;
