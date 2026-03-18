import "dotenv/config";
import express from "express";
import cors from "cors";
import "./db/db";
import authRouters from "./routes/auth.routes";
import blogRouter from "./routes/blog.routes";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
const port = 4000;

app.use("/auth", authRouters);
app.use("/", blogRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port} 🚀🚀`);
});
