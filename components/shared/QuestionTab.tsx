import { getuserQuestions } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import React from "react";
import QuestionCard from "../cards/Questioncard";
import Questioncard from "../cards/Questioncard";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string;
}
const QuestionTab = async ({ userId, clerkId }: Props) => {
  const result = await getuserQuestions({ userId, page: 1 });
  return (
    <>
      {result?.questions.map((question) => (
        <Questioncard
          key={question._id}
          _id={question._id}
          clerkId={clerkId}
          title={question.title}
          tags={question.tags}
          author={question.author}
          upvotes={question.upvotes}
          views={question.views}
          answers={question.answers}
          createdAt={question.createdAt}
        />
      ))}
    </>
  );
};

export default QuestionTab;
