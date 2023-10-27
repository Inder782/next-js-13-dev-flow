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
  RecommendedParams,
} from "../shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";
import ANSWERS from "@/database/answer.model";
import Interactions from "@/database/interaction.model";
import { FilterQuery } from "mongoose";
import { Inter } from "next/font/google";

export async function getQuestion(params: GetQuestionsParams) {
  try {
    connectTodatabase();
    const { searchQuery, filter, page = 1, pageSize = 2 } = params;

    const skipAmount = (page - 1) * pageSize;

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
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortoptions);
    const totalQuestion = await Question.countDocuments(query);
    const isNext = totalQuestion > skipAmount + questions.length;
    return { questions, isNext };
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
    await Interactions.create({
      user: author,
      action: "ask_question",
      question: question._id,
      tags: tagDocuments,
    });
    // Increment an author reputation for creating a specicfic question
    await User.findByIdAndUpdate(author, { $inc: { reputation: 5 } });
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
    // here to increment users reputation by +1 or up and -1 for downvote
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -1 : 1 },
    });

    // increment the user repo by +10 or -10 for receivng a downvote or a upvote

    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });
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
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -2 : -2 },
    });
    await User.findByIdAndUpdate(question.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });
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

export async function recommendation(params: RecommendedParams) {
  try {
    await connectTodatabase();
    const { userId, page = 1, pageSize = 20, searchQuery } = params;
    // find the user

    const user = await User.findOne({ clerkid: userId });
    if (!user) {
      throw new Error("user not found");
    }
    const skipAmount = (page - 1) * pageSize;

    const userinteaction = await Interactions.find({ user: user._id })
      .populate("tags")
      .exec();

    const usertags = userinteaction.reduce((tags, interactions) => {
      if (interactions.tags) {
        tags = tags.concat(interactions.tags);
      }
      return tags;
    }, []);
    //@ts-ignore
    const distinctusertags = [...new Set(usertags.map((tag: any) => tag._id))];
    const query: FilterQuery<typeof Question> = {
      $and: [
        { tags: { $in: distinctusertags } },
        { author: { $ne: user._id } },
      ],
    };
    if (searchQuery) {
      query.$or = [
        { title: { regex: searchQuery, $options: "i" } },
        { content: { $regex: searchQuery, $options: "i" } },
      ];
    }
    const totalQuestion = await Question.countDocuments(query);
    const recommendedQuestion = await Question.find(query)
      .populate({
        path: "tags",
        model: Tag,
      })
      .populate({
        path: "author",
        model: User,
      })
      .skip(skipAmount)
      .limit(pageSize);

    const isNext = totalQuestion > skipAmount + recommendedQuestion.length;
    return { questions: recommendedQuestion, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
