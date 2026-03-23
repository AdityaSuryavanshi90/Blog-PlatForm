"use client";
import { getBlogById } from "@/lib/services";
import Link from "next/link";
import React, { use, useEffect, useState } from "react";

interface pageProps {
  params: Promise<{ id: string }>;
}

const page = ({ params }: pageProps) => {
  const { id } = use(params);
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [authors, setAuthors] = useState<any>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const result = await getBlogById(id);
        setBlog(result.blog?.blogs);
        setAuthors(result.blog?.users);
      } catch (err) {
        setError("Failed to load blog. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " at " +
      d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center">
          <p className="text-red-500 text-lg font-medium">
            {error || "Blog not found."}
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-cyan-600 hover:underline text-sm"
          >
            ← Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-cyan-600 transition-colors mb-8"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blogs
        </Link>

        {/* Blog Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500" />

          <div className="p-8 flex flex-col gap-6">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-900 leading-tight capitalize">
              {blog.title}
            </h1>

            {/* Meta info */}
            <div className="flex flex-col gap-3 border-b border-gray-100 ">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-sm font-bold capitalize">
                  {authors?.name?.charAt(0)}
                </div>
                <span className="text-gray-600 text-sm font-medium capitalize">
                  {authors?.name}
                </span>
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                <span>
                  <span className="font-semibold text-sm text-gray-500">
                    Published:
                  </span>{" "}
                  {formatDate(blog.createdAt)}
                </span>
                {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                  <span>
                    <span className="font-semibold text-sm text-gray-500">
                      Updated:
                    </span>{" "}
                    {formatDate(blog.updatedAt)}
                  </span>
                )}
              </div>
            </div>

            {/* Blog Content (Quill HTML) */}
            <div className="flex  flex-col">
              <p className="font-semibold text-xl">content:</p>
              <div
                className="prose prose-gray max-w-none text-gray-800 leading-relaxed  capitalize break-words"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
