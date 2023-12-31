"use client";
import React, { useRef, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { AnswerSchema } from "@/lib/validations";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Editor } from "@tinymce/tinymce-react";
import { useTheme } from "@/context/ThemeProvider";
import { Button } from "../ui/button";
import Image from "next/image";
import { CreateAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";
import { useToast } from "../ui/use-toast";

interface Props {
  question: string;
  questionID: string;
  authorId: string;
}
const Answer = ({ question, questionID, authorId }: Props) => {
  const [isSubmittingAi, setisSubmittingAi] = useState(false);
  const pathname = usePathname();
  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });
  const [issubmit, setissubmit] = useState(false);
  const handleCreateAnswer = async (values: z.infer<typeof AnswerSchema>) => {
    setissubmit(true);

    try {
      await CreateAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionID),
        path: pathname,
      });
      form.reset();
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setissubmit(false);
    }
  };
  const { toast } = useToast();
  const editorRef = useRef(null);
  const { mode } = useTheme();
  const generateAnswer = async () => {
    if (!authorId) return;
    setisSubmittingAi(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chatgpt`,
        { method: "POST", body: JSON.stringify({ question }) }
      );
      const aiAnswer = await response.json();
      //convert to html format

      const formattedanswer = aiAnswer.reply;
      if (editorRef.current) {
        const editor = editorRef.current as any;
        editor.setContent(
          "This function fetches the Openai and gives you the answer from chatgpt... unfortunately i dont have a key yet :<"
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setisSubmittingAi(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2 ">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="btn light-border-2 gap-1.5 rounded-md px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          onClick={() => {
            generateAnswer;
            toast({
              title: "Waiting for Chatgpt to response",
              description: "Generating an ai answer for you ",
            });
          }}
        >
          {isSubmittingAi ? (
            <>Generating....</>
          ) : (
            <>
              <Image
                src="/assets/icons/stars.svg"
                alt="start"
                width={12}
                height={12}
                className="object-contain"
              />
              Generate An AI answer
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          className="mt-6 flex w-full flex-col gap-10"
          onSubmit={form.handleSubmit(handleCreateAnswer)}
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  {/* a beast todo editor*/}
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) =>
                      //@ts-ignore
                      (editorRef.current = editor)
                    }
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                      ],

                      toolbar:
                        "undo redo | " +
                        "codesample | bold italic backcolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist outdent indent | " +
                        "removeformat | help",
                      content_style:
                        "body { font-family:Inter,Arial,sans-serif; font-size:16px }",

                      skin: mode === "dark" ? "oxide-dark" : "oxide",
                      content_css: mode === "dark" ? "dark" : "light",
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              className="primary-gradient w-fit "
              onClick={() => {
                toast({ title: "Submitting your answer , Please wait !" });
              }}
            >
              {issubmit ? "Submitting" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
