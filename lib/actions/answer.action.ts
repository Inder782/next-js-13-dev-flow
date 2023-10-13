"use server";

import ANSWERS from "@/database/answer.model";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  GetAnswersParams,
} from "../shared.types";
import { connectTodatabase } from "./mongoose";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";

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

export async function upvoteanswer(params: AnswerVoteParams) {
  try {
    connectTodatabase();
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { upvotes: userId } };
    }
    const answer = await ANSWERS.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) {
      throw Error("cant find an answer");
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function Downvoteanswer(params: AnswerVoteParams) {
  try {
    connectTodatabase();
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
    let updateQuery = {};
    if (hasdownVoted) {
      updateQuery = { $pull: { downvote: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }
    const answer = await ANSWERS.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });
    if (!answer) {
      throw Error("cant find an answer");
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
