"use client";

import Question from "@/components/form/Question";
import React from "react";

const Ask = () => {
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question />
      </div>
    </div>
  );
};

export default Ask;
