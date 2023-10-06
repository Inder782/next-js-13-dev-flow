"use server";

import { connectTodatabase } from "./mongoose";

export async function createQuestion(params: any) {
  try {
    connectTodatabase();
  } catch (error) {}
}
