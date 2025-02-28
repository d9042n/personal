"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ProfileTab } from "@/components/dashboard/profile";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function DashboardPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Authorization check - ensure user can only access their own dashboard
  useEffect(() => {
    if (user && user.username !== params.username) {
      setError("You don't have permission to view this dashboard");
      // Redirect after a short delay to show the error message
      const timeout = setTimeout(() => {
        router.push(`/dashboard/${user.username}`);
      }, 2000);
      return () => clearTimeout(timeout);
    } else {
      setError(null);
    }
  }, [user, params.username, router]);

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-8">
        <nav className="space-y-2">
          <a
            href="#profile"
            className="block px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Profile
          </a>
          {/* Add more navigation items here */}
        </nav>
        <main>
          <ProfileTab />
        </main>
      </div>
    </div>
  );
}
