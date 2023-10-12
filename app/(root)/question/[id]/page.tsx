import { getQuestionByid } from "@/lib/actions/question.action";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import Metric from "@/components/shared/Metric";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import ParseHTML from "@/components/shared/ParseHTML";
import RenderTag from "@/components/shared/RenderTag";
import Answer from "@/components/form/Answer";
import { auth } from "@clerk/nextjs";
import { getUserbyid } from "@/lib/actions/user.action";
import Allanswers from "@/components/shared/Allanswers";

const page = async ({ params }: any) => {
  const result = await getQuestionByid({ questionId: params.id });
  const { userId: clerkId } = auth();
  let mongouser;
  if (clerkId) {
    mongouser = await getUserbyid({ userId: clerkId });
  }
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sn:items-center sm:gap-2">
          <Link
            href={`/profile/${result.author.clearkId}`}
            className="flex items-center justify-start gap-1"
          >
            <Image
              src={result.author.picture}
              className="rounded-full"
              width={22}
              height={22}
              alt="user-pic"
            />
            <p className="paragraph-semibold text-dark300_light700">
              {result.author.name}
            </p>
          </Link>
          <div className="flex justify-end ">Voting here</div>
        </div>
        <h2 className="h2-semibold text-dark200_light800 mt-3.5 w-full text-left">
          {result.title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="Upvotes"
          value={`asked ${getTimestamp(result.createdAt)}`}
          title=" "
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={result.answers.length}
          title=" Answers"
          textStyles="small-medium text-dark400_light800"
        />
        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(result.views)}
          title=" Views"
          textStyles="small-medium text-dark400_light800"
        />
      </div>
      <ParseHTML data={result.content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {result.tags.map((tag: any) => (
          <RenderTag
            key={tag._id}
            _id={tag._id}
            name={tag.name}
            showCount={false}
          />
        ))}
      </div>
      <Allanswers
        questionId={result._id}
        authorId={JSON.stringify(mongouser._id)}
        totalAnswers={result.answers.length}
      />
      <Answer
        question={result.content}
        questionID={JSON.stringify(result._id)}
        authorId={JSON.stringify(mongouser._id)}
      />
    </>
  );
};

export default page;
