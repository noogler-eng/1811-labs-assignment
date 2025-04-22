"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X, User, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./authProvider";
import Image from "next/image";

export function Navbar() {
  const router = useRouter();
  const { signOut, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-[#1A1A1A] backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white">Notes</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {user ? (
            <>
              {pathname.includes("/dashboard") ? (
                <Link
                  href="/"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="text-sm text-zinc-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-8 w-8 bg-white"
                  >
                    {user?.user_metadata?.avatar_url ? (
                      <Image
                        src={user?.user_metadata?.avatar_url || ""}
                        width={100}
                        height={100}
                        alt="Picture of the user"
                        className="rounded-full"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-zinc-900 border-zinc-800 text-zinc-200"
                >
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium text-white">
                      {user.email}
                    </p>
                    <p className="text-xs text-zinc-500">Logged in</p>
                  </div>
                  <DropdownMenuSeparator className="bg-zinc-800" />
                  <DropdownMenuItem
                    className="hover:bg-zinc-800 hover:text-white cursor-pointer text-red-400 hover:text-red-300"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Button
                asChild
                className="bg-zinc-100 text-black hover:bg-zinc-200"
              >
                <Link href="/signup">Sign up</Link>
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-zinc-800 bg-black">
          <div className="container flex flex-col space-y-3 py-4 px-4">
            {user ? (
              <>
                <div className="flex flex-col space-y-1 pb-2 mb-2 border-b border-zinc-800">
                  <p className="text-sm font-medium text-white">{user.email}</p>
                  <p className="text-xs text-zinc-500">Logged in</p>
                </div>
                <Link
                  href="/dashboard"
                  className="text-zinc-400 hover:text-white py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/settings"
                  className="text-zinc-400 hover:text-white py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left text-red-400 hover:text-red-300 py-2"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-zinc-400 hover:text-white py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="text-zinc-400 hover:text-white py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
                <Button
                  asChild
                  className="bg-zinc-100 text-black hover:bg-zinc-200 mt-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
