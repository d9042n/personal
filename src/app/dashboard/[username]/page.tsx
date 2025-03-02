import { Metadata } from "next";
import { Suspense } from "react";
import { UserProfileDashboard } from "@/components/UserProfileDashboard";
import { UserProfileSkeleton } from "@/components/UserProfileSkeleton";

export const metadata: Metadata = {
  title: "User Profile Dashboard",
  description: "View and edit your profile information",
};

interface PageProps {
  params: {
    username: string;
  };
}

export default async function DashboardPage({ params }: PageProps) {
  const username = await Promise.resolve(params.username);

  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfileDashboard username={username} />
      </Suspense>
    </div>
  );
}
