import { users } from "../db/schema";
import { db } from "../db/db";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
import { loginSchema, registerSchema } from "../validations/auth.validation";
const bcrypt = require("bcrypt");

export const register = async (req: any, res: any) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "invalid input",
        error: result.error.flatten().fieldErrors,
      });
    }
    const { name, email, password, role } = result.data;

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role,
      })
      .returning({
        name: users.name,
        email: users.email,
      });
    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const login = async (req: any, res: any) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: "invalid input",
        error: result.error.flatten().fieldErrors,
      });
    }
    const { email, password } = result.data;

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!existingUser) {
      return res.status(400).json({ message: "Email not found" });
    }
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      {
        userId: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" },
    );

    const { password: _, ...userData } = existingUser;
    return res
      .status(200)
      .json({ message: "Login successful", userData: userData, token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};
