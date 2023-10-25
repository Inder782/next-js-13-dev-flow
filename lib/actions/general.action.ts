"use server";

import Question from "@/database/question.model";
import { SearchParams } from "../shared.types";
import { connectTodatabase } from "./mongoose";
import User from "@/database/user.model";
import ANSWERS from "@/database/answer.model";
import Tag from "@/database/tags.model";
import { model } from "mongoose";

export async function Globalsearch(params: SearchParams) {
  try {
    connectTodatabase();
    const { query, type } = params;
    const regexQuery = { $regex: query, $options: "i" };
    let results = [];
    const SearchableTypes = ["question", "answer", "user", "tags"];
    const modelsAndtypes = [
      { model: Question, searchField: "title", type: "question" },
      { model: User, searchField: "name", type: "user" },
      { model: ANSWERS, searchField: "content", type: "answer" },
      { model: Tag, searchField: "name", type: "tag" },
    ];
    const typeLower = type?.toLocaleLowerCase();
    if (!typeLower || !SearchableTypes.includes(typeLower)) {
      // search across everything
      for (const { model, searchField, type } of modelsAndtypes) {
        const queryresult = await model
          .find({ [searchField]: regexQuery })
          .limit(2);

        results.push(
          ...queryresult.map((item) => ({
            title:
              type === "answer"
                ? `Answers containing ${query}`
                : item[searchField],
            type,
            id:
              type === "user"
                ? item.clerkid
                : type === "answer"
                ? item.question
                : item._id,
          }))
        );
      }
    } else {
      const modelinfo = modelsAndtypes.find((item) => item.type === type);
      if (!modelinfo) {
        throw new Error("invalid search type");
      }
      const queryresult = await modelinfo.model
        .find({ [modelinfo.searchField]: regexQuery })
        .limit(8);

      results = queryresult.map((item) => ({
        title:
          type === "answer"
            ? `Answers containing ${query}`
            : item[modelinfo.searchField],
        type,
        id:
          type === "user"
            ? item.clerkid
            : type === "answer"
            ? item.question
            : item._id,
      }));
    }
    return JSON.stringify(results);
  } catch (error) {
    console.log(error);
    throw error;
  }
}
