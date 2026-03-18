"use client";
import BlogsCards from "@/components/BlogsCards";
import {
  deleteBlogById,
  getAllBlogs,
  getCurrentUserBlogs,
} from "@/lib/services";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
  const [blogs, setBlogs] = useState<any>([]);
  const [currentUserBlogs, setCurrentUserBlogs] = useState<any>([]);
  const [error, setError] = useState<string | any>("");

  const [currentUserData, SetcurrentUserData] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState(false);
  const router = useRouter();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const data = await getAllBlogs();

      setBlogs(data?.blogs || []);
      setLoading(false);
      console.log("all blogs:", data.blogs, data.users);
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    }
  };

  const fetchCurrentUserBlogs = async () => {
    try {
      setLoading(true);
      SetcurrentUserData(JSON.parse(localStorage.getItem("user") || "{}"));
      if (!currentUserData?.id) {
        setLoading(false);
        return setError("Please Login To See Your Blogs");
      }

      const data = await getCurrentUserBlogs();

      setCurrentUserBlogs(data?.blogs || []);
      setLoading(false);
      console.log(" current user blogs", data?.blogs);
    } catch (error) {
      console.error("Failed to fetch current user's blogs:", error);
    }
  };

  useEffect(() => {
    setLoading(true);
    setBlogs([]);
    setCurrentUserBlogs([]);
    const timer = setTimeout(() => {
      category ? fetchCurrentUserBlogs() : fetchBlogs();
    }, 500);

    SetcurrentUserData(JSON.parse(localStorage.getItem("user") || "{}"));

    return () => clearTimeout(timer);
  }, [category]);

  const onEdit = (blogId: string) => {
    console.log("updaeblog", blogId);
    router.push(`/blog?id=${blogId}`);
  };
  const onDelete = async (blogId: string) => {
    console.log("deleteblog", blogId);
    if (currentUserData?.role !== "ADMIN") {
      return toast.error("Only Admin Can Delete Blogs");
    }
    if (blogId) {
      const result = await deleteBlogById(blogId);

      setBlogs((prev: any) =>
        prev.filter((blog: any) => blog.blogs.id !== blogId),
      );
      setCurrentUserBlogs((prev: any) =>
        prev.filter((blog: any) => blog.id !== blogId),
      );
      console.log(result?.data);
      toast.success("blogs deleted successfully");
    }
  };

  return (
    <div className="pt-20">
      <div className="mt-8">
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setCategory(false)}
            className={`cursor-pointer px-5 py-2 rounded-full text-sm font-semibold tracking-wider transition-all duration-200 ${
              !category
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-200"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            All Blogs
          </button>
          <button
            onClick={() => setCategory(true)}
            className={`cursor-pointer px-5 py-2 rounded-full text-sm font-semibold tracking-wider transition-all duration-200 ${
              category
                ? "bg-green-600 text-white shadow-md shadow-green-200"
                : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"
            }`}
          >
            My Blogs
          </button>
        </div>
        <div className="max-w-6xl mx-auto mt-7 px-4 ">
          {loading && blogs.length === 0 && (
            <div className="animate-bounce text-gray-400 text-center">loading blogs..</div>
          )}
          {category ? (
            <div>
              {!loading && !currentUserData?.id ? (
                <p className="text-xl text-center text-gray-800 capitalize">
                  You need to login first to see your blogs.{" "}
                  <span className="text-cyan-600 hover:text-blue-500">
                    <Link href="/login">Login</Link>
                  </span>
                </p>
              ) : !loading && currentUserBlogs.length === 0 ? (
                <p className="text-xl text-gray-700 capitalize">
                  No Blogs Has Been Created yet
                  <span className="text-cyan-600 hover:text-blue-500">
                    {" "}
                    <Link href={"/blog"}>Create Blog</Link>
                  </span>
                </p>
              ) : (
                <div className="flex flex-col gap-6">
                  {currentUserBlogs.map((blog: any) => (
                    <BlogsCards
                      authorId={blog?.authorId}
                      currentAuthorId={currentUserData?.id}
                      key={blog.id}
                      id={blog.id}
                      title={blog?.title}
                      content={blog?.content}
                      authorName={currentUserData?.name}
                      createdAt={blog?.createdAt}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {!loading && blogs.length === 0 ? (
                <p className="text-xl text-gray-700 capitalize">
                  No Blogs Has Been Created yet
                </p>
              ) : (
                <div className="flex flex-col gap-6">
                  {blogs.map((blog: any) => (
                    <BlogsCards
                      authorId={blog?.blogs?.authorId}
                      currentAuthorId={currentUserData?.id}
                      id={blog?.blogs?.id}
                      key={blog?.blogs?.id}
                      title={blog?.blogs?.title}
                      content={blog?.blogs?.content}
                      authorName={blog?.users?.name}
                      createdAt={blog.blogs?.createdAt}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
