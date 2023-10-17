"use server";

import Question from "@/database/question.model";
import { ViewQuestionParams } from "../shared.types";
import { connectTodatabase } from "./mongoose";
import Intreraction from "@/database/interaction.model";

export async function viewquestion(params: ViewQuestionParams) {
  try {
    await connectTodatabase();
    const { questionId, userId } = params;
    //update view count
    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });
    if (userId) {
      const exisitng_interaction = await Intreraction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });
      if (exisitng_interaction) return console.log("user has already viewed");

      await Intreraction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
