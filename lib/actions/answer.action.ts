"use server";

import ANSWERS from "@/database/answer.model";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "../shared.types";
import { connectTodatabase } from "./mongoose";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import Interactions from "@/database/interaction.model";

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
    const { questionId, sortBy, page = 1, pageSize = 10 } = params;
    let sortedoptions = {};
    const skipAmount = (page - 1) * pageSize;

    switch (sortBy) {
      case "highestUpvotes":
        sortedoptions = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortedoptions = { downvotes: -1 };
        break;
      case "recent":
        sortedoptions = { createdAt: -1 };
        break;
      case "old":
        sortedoptions = { createdAt: 1 };
        break;
    }
    const answers = await ANSWERS.find({ question: questionId })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("author", "_id clerkId name picture")
      .sort(sortedoptions);
    const totalAnswer = await ANSWERS.countDocuments({ question: questionId });
    const isNextAnswer = totalAnswer > skipAmount + answers.length;
    return { answers, isNextAnswer };
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

export async function DeleteAnswer(params: DeleteAnswerParams) {
  try {
    connectTodatabase();

    const { answerId, path } = params;
    const answer = await ANSWERS.findById(answerId);
    if (!answer) {
      throw new Error("Answer not found");
    }
    await ANSWERS.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answer: answerId } }
    );
    await Interactions.deleteMany({ question: answerId });
    revalidatePath(path);
  } catch {}
}
