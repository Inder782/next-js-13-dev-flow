"use server";

import User from "@/database/user.model";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "../shared.types";
import Tag from "@/database/tags.model";
import { connectTodatabase } from "./mongoose";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectTodatabase();
    const { userId } = params;
    const user = await User.findById(userId);

    if (!user) throw new Error("User not found");

    // find interaction for the user and group by tags
    // Interactions
    return [
      { _id: 1, name: "tags" },
      { _id: 2, name: "tag2" },
      { _id: 2, name: "tag2" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAlltags(params: GetAllTagsParams) {
  try {
    connectTodatabase();
    const tags = await Tag.find({});
    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
