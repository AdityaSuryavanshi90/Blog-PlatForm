"use client";

import { deleteBlogById } from "@/lib/services";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import toast from "react-hot-toast";

type BlogCardProps = {
  id: string;
  authorId: string;
  currentAuthorId?: string;
  title: string;
  content: string;
  authorName: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  onEdit: (blogId: string) => void;
  onDelete: (blogId: string) => void;
};

const BlogsCards = ({
  id,
  authorId,
  currentAuthorId,
  title,
  content,
  authorName,
  createdAt,
  updatedAt,
  imageUrl,
  onEdit = (blogId) => {},
  onDelete = (blogId) => {},
}: Partial<BlogCardProps>) => {
  const formatDateTime = (dateStr?: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const date = d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return `${date}, ${time}`;
  };

  const formattedCreatedAt = formatDateTime(createdAt);
  const formattedUpdatedAt = formatDateTime(updatedAt);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Color accent top bar */}
      <div className="h-1.5 bg-gradient-to-r from-cyan-500 to-blue-500" />

      <div className="p-6 flex flex-col gap-3 flex-1">
        {/* Author + Date */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xs font-bold capitalize">
            {authorName?.slice(0, 1)}
          </div>
          <span className="text-gray-600 text-xs font-medium capitalize">
            {authorName}
          </span>
          <span className="text-gray-300 text-xs">•</span>
          <span className="text-gray-400 text-xs">{formattedCreatedAt}</span>
        </div>

        {/* Updated At */}
        {updatedAt && (
          <p className="text-gray-400 text-xs">Updated: {formattedUpdatedAt}</p>
        )}
        {imageUrl && (
          <div className="w-12 h-10">
            <Image
              height={50}
              width={50}
              alt={title || "blog image"}
              src={imageUrl}
              className="w-10 h-12 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Title */}
        <h2 className="text-gray-900 text-lg font-bold leading-snug group-hover:text-cyan-700 transition-colors line-clamp-2">
          {title}
        </h2>

        {/* Content preview */}
        <div
          dangerouslySetInnerHTML={{ __html: content || "" }}
          className="text-gray-500 text-sm leading-relaxed line-clamp-6 flex-1 break-words [&_ol]:list-decimal [&_ol]:pl-4 [&_ul]:list-disc [&_ul]:pl-4 [&_li]:my-0 [&_li]:pl-0 [&_img]:max-w-full [&_img]:max-h-32 [&_img]:object-contain [&_img]:rounded"
        />

        {/* Read more + actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
          <Link href={`/blog-detail/${id}`}>
            <span className="text-cyan-600 text-xs font-semibold cursor-pointer hover:underline">
              Read more →
            </span>
          </Link>
          <div className="flex gap-2">
            {currentAuthorId === authorId && (
              <button
                onClick={() => onEdit(id || "")}
                className="px-3 py-1 text-xs font-medium rounded-md bg-cyan-50 text-cyan-700 border border-cyan-200 hover:bg-cyan-600 hover:text-white transition-colors cursor-pointer"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => onDelete(id || "")}
              className="px-3 py-1 text-xs font-medium rounded-md bg-red-50 text-red-600 border border-red-200 hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogsCards;
