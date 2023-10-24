"use server";

import Question from "@/database/question.model";
import { connectTodatabase } from "./mongoose";
import Tag from "@/database/tags.model";
import {
  CreateQuestionParams,
  DeleteQuestionParams,
  EditQuestionParams,
  GetQuestionByIdParams,
  GetQuestionsParams,
  QuestionVoteParams,
} from "../shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import ANSWERS from "@/database/answer.model";
import Interactions from "@/database/interaction.model";
import { FilterQuery } from "mongoose";

export async function getQuestion(params: GetQuestionsParams) {
  try {
    connectTodatabase();
    const { searchQuery, filter } = params;
    const query: FilterQuery<typeof Question> = {};

    if (searchQuery) {
      query.$or = [
        { title: { $regex: new RegExp(searchQuery, "i") } },
        { content: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    let sortoptions = {};

    switch (filter) {
      case "newest":
        sortoptions = { createdAt: -1 };
        break;

      case "frequent":
        sortoptions = { views: -1 };
        break;

      case "unanswered":
        query.answers = { $size: 0 };
        break;

      default:
        break;
    }
    const questions = await Question.find(query)
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort(sortoptions);

    return { questions };
  } catch (error) {
    console.log(error);
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    connectTodatabase();
    const { title, content, tags, author, path } = params;
    // create the question
    const question = await Question.create({
      title,
      content,
      author,
    });
    const tagDocuments = [];
    for (const tag of tags) {
      const exisitingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $push: { question: question._id } },
        { upsert: true, new: true }
      );
      tagDocuments.push(exisitingTag._id);
    }
    await Question.findByIdAndUpdate(question._id, {
      $push: { tags: { $each: tagDocuments } },
    });
    revalidatePath(path);
    // create an interaction record for the user ask question
    // Increment an author reputation for creating a specicfic question
  } catch (error) {
    console.log(error);
  }
}

export async function getQuestionByid(params: GetQuestionByIdParams) {
  try {
    connectTodatabase();
    const { questionId } = params;
    const question = await Question.findById(questionId)
      .populate({ path: "tags", model: Tag, select: "_id name" })
      .populate({
        path: "author",
        model: User,
        select: "_id clerkId name picture",
      });
    return question;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function upvotequestion(params: QuestionVoteParams) {
  try {
    connectTodatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

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
    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });
    if (!question) {
      throw new Error("Question not found");
    }
    // here to increment users reputation

    revalidatePath(path); // this means reload the path
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function downvotequestion(params: QuestionVoteParams) {
  try {
    connectTodatabase();

    const { questionId, userId, hasupVoted, hasdownVoted, path } = params;

    let updateQuery = {};
    if (hasdownVoted) {
      updateQuery = { $pull: { downvotes: userId } };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = { $addToSet: { downvotes: userId } };
    }

    const question = await Question.findByIdAndUpdate(questionId, updateQuery, {
      new: true,
    });
    if (!question) {
      throw new Error("Question not found");
    }
    // here to increment users reputation
    revalidatePath(path); // this means reload the path
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function DeleteQuestion(params: DeleteQuestionParams) {
  try {
    connectTodatabase();

    const { questionId, path } = params;
    await Question.deleteOne({ id: questionId });
    await ANSWERS.deleteMany({ id: questionId });
    await Interactions.deleteMany({ question: questionId });
    await Tag.updateMany(
      { question: questionId },
      { $pull: { question: questionId } }
    );
    revalidatePath(path);
  } catch {}
}

export async function EditQuestion(params: EditQuestionParams) {
  try {
    connectTodatabase();
    const { questionId, title, content, path } = params;
    const question = await Question.findById(questionId).populate("tags");

    if (!question) {
      throw new Error("Question not Found");
    }
    question.title = title;
    question.content = content;

    await question.save();
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function Gethotquestions() {
  try {
    connectTodatabase();
    const hotquestions = await Question.find({})
      .sort({
        views: -1,
        upvotes: -1,
      })
      .limit(5);
    return hotquestions; // sort in descending order
  } catch (error) {
    throw Error;
  }
}
