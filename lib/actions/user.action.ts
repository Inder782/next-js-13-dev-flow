"use server";

import User from "@/database/user.model";
import { connectTodatabase } from "./mongoose";

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
