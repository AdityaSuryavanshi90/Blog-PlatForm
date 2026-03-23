import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByUserId,
  updateBlog,
  uploadImage,
} from "../controller/blog.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload } from "../multer";

const router = Router();
router.get("/blogs", getAllBlogs);
router.get("/blogs/user/", authMiddleware, getBlogsByUserId);
router.get("/blogs/:id", getBlogById);

router.post("/upload", authMiddleware, upload.single("image"), uploadImage);

router.post("/blogs", authMiddleware, createBlog);
router.delete("/blogs/:id", authMiddleware, deleteBlog);
router.put("/blogs/:id", authMiddleware, updateBlog);

export default router;
