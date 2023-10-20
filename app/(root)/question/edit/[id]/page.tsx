import React from "react";
import Question from "@/components/form/Question";
import mongoose from "mongoose";
import { auth } from "@clerk/nextjs";
import { redirect, useParams } from "next/navigation";
import { getUserbyid } from "@/lib/actions/user.action";
import { getQuestionByid } from "@/lib/actions/question.action";
import { ParamsProps } from "@/types";

const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  await getUserbyid({ userId });
  const result = await getQuestionByid({ questionId: params.id });
  return (
    <>
      <h1 className="h1-bold text-dark-100_light900">Edit Question</h1>
      <div>
        <Question
          type="Edit"
          mongoUserId={userId}
          questionDetails={JSON.stringify(result)}
        />
      </div>
    </>
  );
};

export default Page;
