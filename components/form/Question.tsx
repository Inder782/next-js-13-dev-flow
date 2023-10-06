"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { Questionschema } from "@/lib/validations";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { createQuestion } from "@/lib/actions/question.action";
import { type } from "os";

const Question = () => {
  const editorRef = useRef(null);
  const type: any = "create";
  const [issubmitting, setissubmitting] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof Questionschema>>({
    resolver: zodResolver(Questionschema),
    defaultValues: {
      title: "",
      explaination: "",
      tags: [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof Questionschema>) {
    setissubmitting(true);

    try {
      await createQuestion({});
    } catch (error) {
    } finally {
      setissubmitting(false);
    }
  }

  const handleInputKeydown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: any
  ) => {
    if (e.key === "Enter" && field.name === "tags") {
      e.preventDefault();
      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if (tagValue !== "") {
        if (tagValue.length > 15) {
          return form.setError("tags", {
            type: "required",
            message: "Tag cannot be less than 15 charactors",
          });
        }
        if (!field.value.includes(tagValue as never)) {
          form.setValue("tags", [...field.value, tagValue]);
          tagInput.value = "";
          form.clearErrors("tags");
        } else {
          form.trigger();
        }
      }
    }
  };

  const handleTagRemove = (tag: string, field: any) => {
    const newtags = field.value.filter((t: string) => t !== tag);
    form.setValue("tags", newtags);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-full flex-col gap-10"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Question Title <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <Input
                  className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark-300 dark:text-light-850 min-h[56px] border"
                  {...field}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-dark-300 dark:text-light-900">
                Be specific and ask question as if you are asking to another
                person
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explaination"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">
                Detailed Explanation of your problem{" "}
                <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                {/* a beast todo editor*/}
                <Editor
                  apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                  onInit={(evt, editor) =>
                    //@ts-ignore
                    (editorRef.current = editor)
                  }
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange}
                  initialValue=""
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
                  }}
                />
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-light-500 dark:text-light-900">
                Introduce the problem and the title
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light900">
                Tags <span className="text-primary-500">*</span>
              </FormLabel>
              <FormControl className="mt-3.5">
                <>
                  <Input
                    className="no-focus paragraph-regular background-light700_dark300 light-border-2 text-dark-300 dark:text-light-850 min-h[56px] border"
                    placeholder="Add tags.."
                    onKeyDown={(e) => handleInputKeydown(e, field)}
                  />

                  {field.value.length > 0 && (
                    <div className="flex-start mt-2.5 gap-2.5">
                      {field.value.map((tag: any) => (
                        <Badge
                          key={tag}
                          className="subtle-medium background-light800_dark300 text-dark-500 dark:text-light-900 rounded-md px-4 py-2 capitalize flex items-center justify-center"
                          onClick={() => {
                            handleTagRemove(tag, field);
                          }}
                        >
                          {tag}
                          <Image
                            src="/assets/icons/close.svg"
                            alt="close icon"
                            width={12}
                            height={12}
                            className="cursor-pointer object-contain invert-0 dark:invert"
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </>
              </FormControl>
              <FormDescription className="body-regular mt-2.5 text-dark-300 dark:text-light-900">
                Add upto three tags to relate your problem
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="primary-gradient w-fit !text-light-900"
          disabled={issubmitting}
        >
          {issubmitting ? (
            <>{type === "edit" ? "Editing..." : "Posting..."}</>
          ) : (
            <>{type === "edit" ? "Edit question" : "Ask a question"}</>
          )}
        </Button>
      </form>
    </Form>
  );
};
export default Question;
