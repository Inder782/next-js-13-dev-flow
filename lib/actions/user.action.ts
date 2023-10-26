"use server";

import User from "@/database/user.model";
import { connectTodatabase } from "./mongoose";
import {
  CreateUserParams,
  DeleteAnswerParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "../shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tags.model";
import { FilterQuery } from "mongoose";
import ANSWERS from "@/database/answer.model";
import { skip } from "node:test";

export async function getUserbyid(params: any) {
  try {
    connectTodatabase();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error);
    return error;
  }
}
export async function CreateUser(userparams: CreateUserParams) {
  try {
    connectTodatabase();

    const newUser = await User.create(userparams);
    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function UpdateUser(params: UpdateUserParams) {
  try {
    connectTodatabase();
    const { clerkId, updateData, path } = params;
    console.log(updateData);
    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteuser(userData: DeleteUserParams) {
  try {
    connectTodatabase();
    const { clerkId } = userData;
    const user = await User.findByIdAndDelete({ clerkId });
    if (!user) {
      throw new Error("User not found");
    }

    //Delete user from database
    // delete user ansewr question comments etc from the database
    const userQuestionID = await Question.find({ author: user._id }).distinct(
      "_id"
    );
    //delete user questions
    await Question.deleteMany({ author: user._id });

    const deleteuser = await User.findOneAndDelete(user._id);
    return deleteuser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getAllusers(params: GetAllUsersParams) {
  try {
    connectTodatabase();
    const { searchQuery, filter, page = 1, pageSize = 10 } = params;
    const query: FilterQuery<typeof User> = {};

    const skipAmount = (page - 1) * pageSize;
    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }
    let sortoptions = {};

    switch (filter) {
      case "new_users":
        sortoptions = { joinedAt: -1 };
        break;
      case "old_users":
        sortoptions = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortoptions = { reputation: 1 };
        break;
    }
    const user = await User.find(query)
      .skip(skipAmount)
      .limit(pageSize)
      .sort(sortoptions);
    const totaluser = await User.countDocuments(query);
    const isNext = totaluser > skipAmount + user.length;
    return { user, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function togglesavequestion(params: ToggleSaveQuestionParams) {
  try {
    connectTodatabase();
    const { userId, questionId, path } = params;
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    const isquestionsaved = user.saved.includes(questionId);

    if (isquestionsaved) {
      await User.findByIdAndUpdate(
        userId,
        { $pull: { saved: questionId } },
        { new: true }
      );
    } else {
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { saved: questionId } },
        { new: true }
      );
    }
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function Getsavedquestions(params: GetSavedQuestionsParams) {
  try {
    const { clerkId, page = 1, pageSize = 10, filter, searchQuery } = params;

    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};
    let sortedoptions = {};
    const skipAmount = (page - 1) * pageSize;
    switch (filter) {
      case "most_recent":
        sortedoptions = { createdAt: -1 };
        break;
      case "oldest":
        sortedoptions = { createdAt: 1 };
        break;
      case "most_voted":
        sortedoptions = { upvotes: -1 };
        break;
      case "most_viewed":
        sortedoptions = { views: -1 };
        break;
      case "most_answered":
        sortedoptions = { answers: -1 };
        break;
    }
    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      options: {
        skip: skipAmount,
        limit: pageSize,
        sort: sortedoptions,
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    if (!user) {
      throw new Error("user not found");
    }
    const totalanswer = await ANSWERS.countDocuments(query);
    const isNext = totalanswer > skipAmount + user.saved.length;
    const savedquestion = user.saved;
    return { question: savedquestion, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getuserinfo(params: GetUserByIdParams) {
  try {
    connectTodatabase();
    const { userId } = params;

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      throw new Error("user not found");
    }
    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswer = await ANSWERS.countDocuments({ author: user._id });

    return {
      user,
      totalAnswer,
      totalQuestions,
    };
  } catch {}
}

export async function getuserQuestions(params: GetUserStatsParams) {
  try {
    connectTodatabase();
    const { userId, page = 1, pageSize = 100 } = params;
    const skipAmount = (page - 1) * pageSize;
    const totalQuestions = await Question.countDocuments({ author: userId });
    const userquestions = await Question.find({ author: userId })
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");

    const isNextQuestion = totalQuestions > skipAmount + userquestions.length;
    return { totalQuestions, questions: userquestions, isNextQuestion };
  } catch {}
}

export async function getuserAnswers(params: GetUserStatsParams) {
  try {
    connectTodatabase();

    const { userId, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    const totalAnswers = await ANSWERS.countDocuments({ author: userId });
    const useranswers = await ANSWERS.find({ author: userId })
      .skip(skipAmount)
      .limit(pageSize)
      .sort({ upvotes: 1 })
      .populate("author", "_id clerkid name picture")
      .populate({ path: "question", model: "Question", select: "id title" });
    const isNextAnswer = totalAnswers > skipAmount + useranswers.length;
    return { totalAnswers, answers: useranswers, isNextAnswer };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
