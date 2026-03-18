import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByUserId,
  updateBlog,
} from "../controller/blog.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();
router.get("/blogs", getAllBlogs);
router.get("/blogs/user/", authMiddleware, getBlogsByUserId);
router.get("/blogs/:id", authMiddleware, getBlogById);

router.post("/blogs", authMiddleware, createBlog);
router.delete("/blogs/:id", authMiddleware, deleteBlog);
router.put("/blogs/:id", authMiddleware, updateBlog);

export default router;
