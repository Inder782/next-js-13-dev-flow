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
    const { searchQuery, filter } = params;
    const query: FilterQuery<typeof User> = {};

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
    const user = await User.find(query).sort(sortoptions);
    return { user };
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
    const savedquestion = user.saved;
    return { question: savedquestion };
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
    const { userId, page = 1, pageSize = 10 } = params;
    const totalQuestions = await Question.countDocuments({ author: userId });
    const userquestions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .populate("tags", "_id name")
      .populate("author", "_id clerkId name picture");
    return { totalQuestions, questions: userquestions };
  } catch {}
}

export async function getuserAnswers(params: GetUserStatsParams) {
  try {
    connectTodatabase();

    const { userId, page = 1, pageSize = 10 } = params;
    const totalAnswers = await ANSWERS.countDocuments({ author: userId });
    const useranswers = await ANSWERS.find({ author: userId })
      .sort({ upvotes: 1 })
      .populate("author", "_id clerkid name picture")
      .populate({ path: "question", model: "Question", select: "id title" });
    return { totalAnswers, answers: useranswers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
