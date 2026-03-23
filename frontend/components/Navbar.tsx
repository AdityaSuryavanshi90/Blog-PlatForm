"use client";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Navbar() {
  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <NavbarContent />
    </Suspense>
  );
}

function NavbarSkeleton() {
  return (
    <nav className="w-full fixed top-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white shadow-sm">
      <div className="text-xl font-bold text-cyan-600">BlogPlatform</div>
      <div className="flex items-center gap-3">
        <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
      </div>
    </nav>
  );
}

function NavbarContent() {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  const search = useSearchParams();
  const updateblog = search.get("id");

  const pathname = usePathname();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUser(JSON.parse(localStorage.getItem("user") || "null"));
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    router.push("/login");
    toast.success("Logged out successfully!");
  };

  console.log("token,user", token, user);
  return (
    <nav className="w-full fixed top-0 border-b border-gray-200 px-6 py-4 flex items-center justify-between bg-white shadow-sm">
      <Link href={"/"} className="text-xl font-bold text-cyan-600">
        BlogPlatform
      </Link>
      <div className="flex items-center gap-3">
        {token ? (
          <>
            {!updateblog && (
              <Link
                href="/blog"
                className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700"
              >
                Create Blog
              </Link>
            )}

            <div className="px-4 py-2 flex gap-3 items-center text-sm font-medium text-gray-700 hover:text-red-500">
              <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center font-bold justify-center text-white">
                <p className="capitalize">{user?.name.slice(0, 1)}</p>
              </div>
              <p>{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
            >
              LogOut
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-cyan-600"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
