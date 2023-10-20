import React from "react";

import { auth } from "@clerk/nextjs";
import { redirect, useParams } from "next/navigation";
import { getUserbyid } from "@/lib/actions/user.action";
import { getQuestionByid } from "@/lib/actions/question.action";
import { ParamsProps } from "@/types";
import Profile from "@/components/form/Profile";

const Page = async ({ params }: ParamsProps) => {
  const { userId } = auth();
  if (!userId) redirect("/sign-in");
  const mongoUser = await getUserbyid({ userId });
  return (
    <>
      <h1 className="h1-bold text-dark-100_light900">Edit Profile</h1>
      <div>
        <Profile clerkId={userId} user={JSON.stringify(mongoUser)} />
      </div>
    </>
  );
};
export default Page;
