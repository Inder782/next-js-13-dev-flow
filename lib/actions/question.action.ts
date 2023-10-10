"use server";

import Question from "@/database/question.model";
import { connectTodatabase } from "./mongoose";
import Tag from "@/database/tags.model";
import { CreateQuestionParams, GetQuestionsParams } from "../shared.types";
import User from "@/database/user.model";
import { revalidatePath } from "next/cache";

export async function getQuestion(params: GetQuestionsParams) {
  try {
    connectTodatabase();
    const questions = await Question.find({})
      .populate({ path: "tags", model: Tag })
      .populate({ path: "author", model: User })
      .sort({ createdAT: -1 });

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
        { $setOnInsert: { name: tag }, push: { question: question._id } },
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
