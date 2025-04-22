"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/authProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();

  const login = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await signIn({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError(null);

      const { error } = await signInWithGoogle();

      if (error) {
        setError(error.message);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred with Google login");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      login();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-zinc-200">
      <div className="w-full max-w-6xl flex items-center justify-center bg-black">
        <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-lg overflow-hidden">
          {/* Left Side: Authentication Form */}
          <div className="w-full md:w-1/2 bg-zinc-900 p-8">
            <Card className="bg-zinc-900 border-zinc-800 text-zinc-200 shadow-lg">
              <CardHeader>
                <CardTitle className="text-center text-3xl text-white">
                  Login
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-zinc-950 border-zinc-800 text-zinc-200 placeholder:text-zinc-600"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-zinc-950 border-zinc-800 text-zinc-200 placeholder:text-zinc-600"
                />
                <Button
                  onClick={login}
                  className="w-full bg-zinc-100 text-black hover:bg-zinc-200"
                  disabled={loading || !email || !password}
                >
                  {loading ? "Logging in..." : "Login with Email"}
                </Button>
                <div className="flex items-center justify-center space-x-2">
                  <div className="h-px w-full bg-zinc-800" />
                  <span className="text-sm text-zinc-500">or</span>
                  <div className="h-px w-full bg-zinc-800" />
                </div>
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-zinc-800 text-zinc-200 bg-zinc-800"
                  onClick={handleGoogleLogin}
                >
                  <FcGoogle className="text-lg" />
                  Login with Google
                </Button>
                {error && (
                  <p className="text-sm text-red-500 text-center">{error}</p>
                )}
                <p className="text-center text-sm text-zinc-400">
                  {`Don't have an account?`}{" "}
                  <a href="/signup" className="text-blue-500 hover:underline">
                    Sign Up
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Side: Simple Design (Optional) */}
          <div className="hidden md:block w-1/2 bg-zinc-800 p-8 flex flex-col items-center justify-center">
            <h2 className="text-4xl text-white">Welcome Back</h2>
            <p className="mt-4 text-zinc-400">
              Sign in to continue using our platform.
            </p>
            <div className="mt-8 text-zinc-500 text-center">
              <p>
                Experience the best of our services with a smooth, secure login.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
