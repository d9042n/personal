"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ProfileTab } from "@/components/dashboard/profile";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Authentication and authorization check
  useEffect(() => {
    if (!isClient || loading) {
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }

    // Check if trying to access another user's dashboard
    if (user.username !== params.username) {
      setError("You don't have permission to view this dashboard");
      // Redirect after a short delay to show the error message
      const timeout = setTimeout(() => {
        router.push(`/dashboard/${user.username}`);
      }, 2000);
      return () => clearTimeout(timeout);
    } else {
      setError(null);
    }
  }, [user, params.username, router, isClient, loading]);

  // Show loading state while checking authentication
  if (!isClient || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

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

  // If not authenticated, don't render anything
  if (!user) {
    return null;
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
