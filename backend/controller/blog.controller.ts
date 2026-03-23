import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { Blog, users } from "../db/schema";
import { createBlogSchema as blogSchema } from "../validations/blog.validation";

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await db
      .select()
      .from(Blog)
      .leftJoin(users, eq(Blog.authorId, users.id));

    return res
      .status(200)
      .json({ blogs, message: "Blogs retrieved successfully" });
  } catch (error: any) {
    return res
      .status(500)
      .json({ message: "Internal server error", errorMessage: error });
  }
};
export const uploadImage = async (req: any, res: any) => {
  try {
    const imageUrl = `http://localhost:4000/uploads/${req.file.filename}`;
    return res
      .status(200)
      .json({ img: imageUrl, message: "Image uploaded successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to upload image", errorMessage: error });
  }
};

export const getBlogsByUserId = async (req: any, res: any) => {
  try {
    const { userId } = req.user;
    const currentUserBlogs = await db
      .select()
      .from(Blog)
      .where(eq(Blog.authorId, userId));

    const currentUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    return res.status(200).json({
      blogs: currentUserBlogs,
      currentUser: currentUser,
      message: "User's blogs retrieved successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", errorMessage: error });
  }
};

export const createBlog = async (req: any, res: any) => {
  try {
    const result = blogSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: result.error.flatten().fieldErrors,
      });
    }
    const { title, content, imageUrl } = result.data;

    const newBlog = await db
      .insert(Blog)
      .values({
        title,
        content,
        authorId: req.user.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        imageUrl,
      })
      .returning();
    return res.status(201).json({
      blogData: newBlog,
      message: "blog created successfully",
      userRole: req.user.role,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", errorMessage: error });
  }
};

export const deleteBlog = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const [blog] = await db.select().from(Blog).where(eq(Blog.id, id));

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const isAdmin = req.user.role === "ADMIN";

    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "only Admins can delete the blog " });
    }

    const deletedBlog = await db
      .delete(Blog)
      .where(eq(Blog.id, id))
      .returning();

    return res
      .status(200)
      .json({ message: "Blog deleted successfully", deletdata: deletedBlog });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", errorMessage: error });
  }
};

export const updateBlog = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const result = blogSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "invalid input",
        error: result.error.flatten().fieldErrors,
      });
    }
    const { title, content } = result.data;

    const [blog] = await db.select().from(Blog).where(eq(Blog.id, id));

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    if (blog.authorId !== req.user.userId) {
      return res
        .status(403)
        .json({ message: "You can only update your own blog" });
    }
    const updateBlog = await db
      .update(Blog)
      .set({
        title,
        content,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(Blog.id, id))
      .returning();

    return res.status(200).json({
      blogData: updateBlog,
      message: "Blog updated successfully",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", errorMessage: error });
  }
};

export const getBlogById = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const [blog] = await db
      .select()
      .from(Blog)
      .where(eq(Blog.id, id))
      .leftJoin(users, eq(Blog.authorId, users.id));

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    return res
      .status(200)
      .json({ blog, message: "Blog retrieved successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", errorMessage: error });
  }
};
