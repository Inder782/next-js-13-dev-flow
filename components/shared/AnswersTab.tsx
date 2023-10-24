import { getuserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import AnswerCard from "../cards/AnswerCard";
import Pagination from "./Pagination";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}
const AnswerTab = async ({ userId, clerkId, searchParams }: Props) => {
  const result = await getuserAnswers({
    userId,
    page: searchParams.page ? +searchParams.page + 1 : 1,
  });
  return (
    <>
      {result?.answers.map((answer) => (
        <AnswerCard
          key={answer._id}
          clerkId={clerkId}
          _id={answer._id}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes.length}
          createdAt={answer.createdAt}
        />
      ))}
      <Pagination
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result?.isNextAnswer}
      />
    </>
  );
};

export default AnswerTab;
