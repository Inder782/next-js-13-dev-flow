"use server";

import User from "@/database/user.model";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "../shared.types";
import Tag, { ITAG } from "@/database/tags.model";
import { connectTodatabase } from "./mongoose";
import { FilterQuery } from "mongoose";
import console from "console";
import Question from "@/database/question.model";

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
    const { searchQuery, filter } = params;
    const query: FilterQuery<typeof Tag> = {};
    let sortedoptions = {};
    switch (filter) {
      case "popular":
        sortedoptions = { question: -1 };
        break;
      case "recent":
        sortedoptions = { createdAt: -1 };
        break;
      case "name":
        sortedoptions = { name: 1 };
        break;
      case "old":
        sortedoptions = { createdAt: 1 };
        break;
    }
    if (searchQuery) {
      query.$or = [{ name: { $regex: new RegExp(searchQuery, "i") } }];
    }
    const tags = await Tag.find(query).sort(sortedoptions);
    return { tags };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getQuestionbytagsid(params: GetQuestionsByTagIdParams) {
  try {
    await connectTodatabase();
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;
    const tagFilter: FilterQuery<ITAG> = { _id: tagId };
    const tag = await Tag.findOne(tagFilter).populate({
      path: "question",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: "_id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });
    if (!tag) {
      throw new Error("Tag not found");
    }
    const questions = tag.question;
    console.log(questions);
    return { tagTitle: tag.name, questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function GetpopularTags() {
  try {
    connectTodatabase();
    const populartags = await Tag.aggregate([
      { $project: { name: 1, numberofQuestion: { $size: "$question" } } },
      { $sort: { numberofQuestions: -1 } },
      { $limit: 5 },
    ]);
    return populartags; // sort in descending order
  } catch (error) {
    throw Error;
  }
}
