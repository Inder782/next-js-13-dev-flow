import * as z from "zod";

export const Questionschema = z.object({
  title: z.string().min(5).max(130),
  explaination: z.string(),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});
