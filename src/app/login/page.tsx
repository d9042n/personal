"use client";

import { LoginForm } from "@/components/ui/login-form";
import { useSearchParams } from "next/navigation";
import { Theme } from "@/types/theme";
import { AuthLayout } from "@/components/ui/auth-layout";
import { Suspense } from "react";

function LoginContent() {
  const searchParams = useSearchParams();
  const theme = (searchParams.get("theme") as Theme) || "geometric";

  const backgroundStyles = {
    geometric: "bg-[#0a192f]",
    minimal: "bg-gray-50",
    artistic: "bg-[#1a0b2e]",
  };

  return (
    <div
      className={`flex min-h-svh flex-col items-center justify-center p-6 md:p-10 ${backgroundStyles[theme]}`}
    >
      <AuthLayout>
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm theme={theme} />
        </div>
      </AuthLayout>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center">
          Loading...
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
