import { discussions } from "@/types";
import Link from "next/link";
import React from "react";
import Image from "next/image";
import RenderTag from "./RenderTag";
const discussion: discussions[] = [
  {
    id: 0,
    question:
      "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
  },
  {
    id: 1,
    question: "Can I get the course for free?",
  },
  {
    id: 2,
    question: "Redux Toolkit Not Updating State as Expected",
  },
  {
    id: 3,
    question: "Async/Await Function Not Handling Errors Properly",
  },
];

const populartags = [
  {
    _id: "1",
    name: "javascript",
    totalquestion: 5,
  },
  {
    _id: "2",
    name: "React",
    totalquestion: 5,
  },
  {
    _id: "3",
    name: "Vue",
    totalquestion: 5,
  },
  {
    _id: "4",
    name: "Next",
    totalquestion: 5,
  },
  {
    _id: "5",
    name: "Redux",
    totalquestion: 5,
  },
];

const RightSidebar = () => {
  return (
    <section
      className="background-light900_dark300 
        light-border custom-scrollbar sticky right-0 top-0
        flex h-screen w-[350px] flex-col overflow-y-auto border
        -l p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden "
    >
      <div className="">
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="mt-7 flex w-full flex-col gap-[30px]">
          {discussion.map((item) => (
            <Link
              href={`/questions/${item.id}`}
              className="flex cursor-pointer items-cener
                justify-between gap-7"
            >
              <p className="body-medium text-dark500_light700">
                {item.question}
              </p>
              <Image
                src="/assets/icons/chevron-right.svg"
                alt="chevron right"
                width={20}
                height={20}
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="mt-7 flex flex-col gap-4">
          {populartags.map((tag) => (
            <RenderTag
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              totalQuestions={tag.totalquestion}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
