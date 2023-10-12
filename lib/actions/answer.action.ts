"use server";

import ANSWERS from "@/database/answer.model";
import { CreateAnswerParams, GetAnswersParams } from "../shared.types";
import { connectTodatabase } from "./mongoose";
import Question from "@/database/question.model";

export async function CreateAnswer(params: CreateAnswerParams) {
  try {
    connectTodatabase();
    const { content, author, question, path } = params;
    // create the answer in the database

    const newanswer = await ANSWERS.create({
      content,
      author,
      question,
    });
    // ADD THE answer to the question answers array
    await Question.findByIdAndUpdate(question, {
      $push: { answers: newanswer._id },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function Getallanswers(params: GetAnswersParams) {
  try {
    connectTodatabase();
    const { questionId } = params;
    const answers = await ANSWERS.find({ question: questionId })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 });
    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
