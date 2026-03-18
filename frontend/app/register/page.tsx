"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { registerServices } from "../../lib/services";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const {
    register,
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm();
  const [error, setError] = useState<string | any>("");
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const result = await registerServices(
        data.name,
        data.email,
        data.password,
      );
      localStorage.setItem("userData", JSON.stringify(result?.user));
      router.push("/login");
      (setError(""), reset());
      toast.success("Registered successfully! Please login to continue.");
      console.log(result);
    } catch (error: any) {
      const data = error?.response?.data;
      if (data?.error) {
        setError(data.error);
      } else {
        setError(data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
        {/* Header */}
        <div className="text-center ">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 text-sm mt-2">
            Join BlogPlatform and start writing
          </p>
        </div>

        {typeof error == "string" && error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        <form className="flex flex-col gap-5" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Name</label>
            <input
              {...register("name")}
              placeholder="John Doe"
              className="border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100 transition-all"
            />
            {error?.name && (
              <p className="text-red-500 text-xs">{error?.name}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              {...register("email")}
              placeholder="you@example.com"
              className="border border-gray-300 bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-900 outline-none focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-100 transition-all"
            />
            {error?.email && (
              <p className="text-red-500 text-xs">{error?.email}</p>
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
              <p className="text-red-500 text-xs">{error?.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-1 bg-cyan-600 cursor-pointer text-white text-sm font-semibold py-3 rounded-lg hover:bg-cyan-700 transition-colors"
          >
            {isSubmitting ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-500 text-center">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-cyan-600 font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
