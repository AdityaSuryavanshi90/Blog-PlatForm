import "dotenv/config";
import express from "express";
import cors from "cors";
import "./db/db";
import authRouters from "./routes/auth.routes";
import blogRouter from "./routes/blog.routes";

const app = express();

// CORS configuration for production
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());

app.use("/uploads", express.static("uploads"));

const port = process.env.PORT || 4000;

app.use("/auth", authRouters);
app.use("/", blogRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port} 🚀🚀`);
});
