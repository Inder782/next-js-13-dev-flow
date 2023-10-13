"use client";
import {
  upvotequestion,
  downvotequestion,
} from "@/lib/actions/question.action";
import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

interface Props {
  type: string;
  itemId: string;
  userId: string;
  upvotes: number;
  downvotes: number;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  hasSaved?: boolean;
}
const Votes = ({
  type,
  itemId,
  userId,
  upvotes,
  downvotes,
  hasupVoted,
  hasdownVoted,
  hasSaved,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const handleVote = async (action: string) => {
    if (!userId) {
      return;
    }
    if (action === "upvote") {
      if (type === "Question") {
        await upvotequestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        // await upvoteAnswer({
        //     questionId: JSON.parse(itemId),
        //     userId: JSON.parse(userId),
        //     hasupVoted,
        //     hasdownVoted,
        //     path: pathname,
        //   });
      }
      // todo: show a toast
      return;
    }
    if (action === "downvote") {
      if (type === "Question") {
        await downvotequestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        // await downvoteAnswer({
        //     questionId: JSON.parse(itemId),
        //     userId: JSON.parse(userId),
        //     hasupVoted,
        //     hasdownVoted,
        //     path: pathname,
        //   });
      }
      // todo: show a toast
    }
  };
  const handlesave = () => {};
  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gpa-1.5">
          <Image
            src={
              hasupVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }
            alt="upvote"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={() => {
              handleVote("upvote");
            }}
          />
          <div className="flex-center background-light700_dark400 min-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(upvotes)}
            </p>
          </div>
        </div>
        <div className="flex-center gpa-1.5">
          <Image
            src={
              hasdownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }
            alt="downvote"
            width={18}
            height={18}
            onClick={() => handleVote("downvote")}
            className="cursor-pointer"
          />
          <div className="flex-center background-light700_dark400 min-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(downvotes)}
            </p>
          </div>
        </div>
      </div>
      <Image
        src={hasSaved ? "/assets/icons/star.svg" : "/assets/icons/star-red.svg"}
        alt="saved"
        width={18}
        height={18}
        onClick={() => handlesave()}
      />
    </div>
  );
};

export default Votes;
