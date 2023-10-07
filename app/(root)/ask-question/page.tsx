import Question from "@/components/form/Question";
import React from "react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { getUserbyid } from "@/lib/actions/user.action";

const Ask = async () => {
  // const { userId } = auth();
  const userId = "123456";
  if (!userId) redirect("/sign-in");
  const mongouser = await getUserbyid({ userId });
  console.log(mongouser._id);
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(mongouser._id)} />
      </div>
    </div>
  );
};

export default Ask;
