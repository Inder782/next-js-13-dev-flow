"use server";

import User from "@/database/user.model";
import { connectTodatabase } from "./mongoose";
import {
  CreateUserParams,
  DeleteAnswerParams,
  DeleteUserParams,
  GetAllUsersParams,
  UpdateUserParams,
} from "../shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

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

export async function UpdateUser(userData: UpdateUserParams) {
  try {
    connectTodatabase();
    const { clerkId, updateData, path } = userData;
    await User.findByIdAndUpdate({ clerkId }, updateData), { new: true };
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    return error;
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
    // const { page = 1, pageSize = 20, filter, searchQuery } = params;
    const users = await User.find({}).sort({ createdAt: -1 });
    return { users };
  } catch (error) {
    console.log(error);
  }
}
