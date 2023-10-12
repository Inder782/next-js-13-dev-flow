import { Schema, model, models, Document } from "mongoose";

export interface IANSWER extends Document {
  question: Schema.Types.ObjectId;
  content: string;
  upvoted: Schema.Types.ObjectId[];
  downvoted: Schema.Types.ObjectId[];
  author: Schema.Types.ObjectId;
  createdAt: Date;
}

const AnswerSchema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});
const ANSWERS = models.Answer || model("Answer", AnswerSchema);
export default ANSWERS;
