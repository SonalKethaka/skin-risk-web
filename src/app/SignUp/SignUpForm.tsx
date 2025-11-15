"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IconBrandGoogle } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpWithEmail, loginWithGoogle } from "@/services/auth";

export default function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string | null;
    const password = formData.get("password") as string | null;

    if (!email || !password) {
      setError("Please fill in email and password.");
      setLoading(false);
      return;
    }

    try {
      await signUpWithEmail(email, password);
      router.push("/main/home"); // go to home after sign up
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Failed to sign up.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/main/home");
    } catch (err: any) {
      console.error(err);
      setError(err?.message ?? "Google sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/loginbackground.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/40 dark:bg-black/40" />

      <div className="relative z-10 w-full max-w-md rounded-none bg-white/40 p-4 shadow-lg backdrop-blur-md md:rounded-2xl md:p-8 dark:bg-black/40">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Welcome to <span style={{ color: "var(--color-primary)" }}>SafeSkin</span>
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Create an account to track your scans and history.
        </p>

        <form className="my-8" onSubmit={handleSubmit}>
          <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <LabelInputContainer>
              <Label htmlFor="firstname">First name</Label>
              <Input id="firstname" placeholder="Tyler" type="text" />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="lastname">Last name</Label>
              <Input id="lastname" placeholder="Durden" type="text" />
            </LabelInputContainer>
          </div>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              placeholder="projectmayhem@fc.com"
              type="email"
              autoComplete="email"
            />
          </LabelInputContainer>

          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
            />
          </LabelInputContainer>

          {error && (
            <p className="mb-3 text-sm text-red-500">
              {error}
            </p>
          )}

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] cursor-pointer transition hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_#27272a_inset,0px_-1px_0px_0px_#27272a_inset]"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign up →"}
            <BottomGradient />
          </button>

          <p className="mt-6 text-center">
            Already have an account?{" "}
            <Link
              href="/LogIn"
              className="cursor-pointer text-[var(--color-primary)] hover:underline"
            >
              Log in here
            </Link>
          </p>

          <div className="my-5 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-4">
            <button
              className="group/btn shadow-input relative flex h-10 w-full items-center justify-start space-x-2 rounded-md bg-gray-50 px-4 font-medium text-black cursor-pointer transition hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_#262626]"
              type="button"
              onClick={handleGoogle}
              disabled={loading}
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                Continue with Google
              </span>
              <BottomGradient />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-2", className)}>
    {children}
  </div>
);