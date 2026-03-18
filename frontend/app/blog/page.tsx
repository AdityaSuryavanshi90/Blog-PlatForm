"use client";
import { createBlogs, getBlogById, updateBlogById } from "@/lib/services";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

export default function CreateBlogPage() {
  const [error, setError] = useState<string | any>("");
  const [value, setValue] = useState("");
  const {
    register,
    reset,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm();

  const router = useRouter();

  const quillRef = useRef<ReactQuill>(null);
  const searchparams = useSearchParams();
  const blogId = searchparams.get("id");

  const fetchBlogById = async () => {
    if (blogId) {
      const result = await getBlogById(blogId);
      reset({
        title: result?.blog?.title,
      });
      setValue(result?.blog?.content || "");
    }
  };
  useEffect(() => {
    fetchBlogById();
  }, [blogId]);

  const onSubmit = async (data: any) => {
    try {
      const textLength = quillRef.current?.getEditor().getLength() ?? 0;
      if (textLength <= 1) {
        return setError({ content: "Content is required" });
      }
      const result = blogId
        ? await updateBlogById(blogId, data.title, value)
        : await createBlogs(data.title, value);
      console.log(result);
      reset();
      setError("");

      router.push("/");
      toast.success(`Blog ${blogId ? "updated" : "created"} successfully!`);
    } catch (error: any) {
      const data = error?.response?.data;
      setError(data?.error || "something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center pt-14 ">
      <div className="w-full max-w-2xl rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-3 text-center text-gray-900">
          {blogId ? "Edit Blog" : "Create a Blog"}
        </h1>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input
              placeholder="Enter blog title..."
              className="border border-gray-300 bg-white rounded-md px-3 py-4 text-sm text-gray-900 outline-none focus:border-cyan-500"
              {...register("title")}
            />
            {error?.title && (
              <p className="text-red-500 text-sm">{error.title}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 ">
            <label className="text-sm font-medium text-gray-700">Content</label>
            {/* <textarea
              rows={10}
              placeholder="Write your blog content here..."
              className="border border-gray-300 bg-white rounded-md px-3 py-4 text-sm text-gray-900 outline-none focus:border-cyan-500 resize-none"
              {...register("content")}
            /> */}
            <div className="rounded-md overflow-hidden border border-gray-300 focus-within:border-cyan-500">
              <ReactQuill
                ref={quillRef}
                value={value}
                onChange={setValue}
                className="h-64"
              />
            </div>
            <div className="" />
            {error?.content && (
              <p className="text-red-500 text-sm">{error.content}</p>
            )}
          </div>

          <button
            type="submit"
            className=" bg-cyan-600 cursor-pointer text-white text-lg font-semibold py-2 rounded-md hover:bg-cyan-700"
          >
            {isSubmitting ? "Publishing..." : " Publish Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}
