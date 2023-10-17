import { Schema, models, model, Document } from "mongoose";

export interface ITAG extends Document {
  name: string;
  description: string;
  question: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
  createdON: Date;
}

const TagsSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  question: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  createdON: { type: Date, default: Date.now },
});

const Tag = models.Tag || model<ITAG>("Tag", TagsSchema);

export default Tag;
