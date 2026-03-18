"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { loginServices } from "../../lib/services";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const [error, setError] = useState<string | any>("");
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const result = await loginServices(data.email, data.password);
      console.log(result);
      const token = result?.token;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(result?.userData));
      setError("");
      router.push("/");
      toast.success("Logged in successfully!");
    } catch (error: any) {
      const data = error?.response?.data;

      if (data?.error) {
        setError(data?.error);
        console.log("error", error);
      } else {
        setError(data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-2">
            Login to your BlogPlatform account
          </p>
        </div>

        {typeof error === "string" && error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              {...register("email")}
              placeholder="you@example.com"
              className="border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100 transition-all"
            />
            {error?.email && (
              <p className="text-red-500 text-xs">{error.email}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100 transition-all"
            />
            {error?.password && (
              <p className="text-red-500 text-xs">{error.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-1 bg-cyan-600 cursor-pointer text-white text-sm font-semibold py-3 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500 text-center">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-cyan-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
