"use client";

import { SignInForm } from "@/components/auth/SignInForm";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { useState } from "react";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        {mode === "signin" ? (
          <SignInForm onToggleMode={toggleMode} />
        ) : (
          <SignUpForm onToggleMode={toggleMode} />
        )}
      </div>
    </div>
  );
}
