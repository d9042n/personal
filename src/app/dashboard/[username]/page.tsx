import { Metadata } from "next";
import { Suspense } from "react";
import { UserProfileDashboard } from "@/components/UserProfileDashboard";
import { UserProfileSkeleton } from "@/components/UserProfileSkeleton";

interface PageProps {
  params: {
    username: string;
  };
}

export default function DashboardPage({ params }: PageProps) {
  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfileDashboard username={params.username} />
      </Suspense>
    </div>
  );
}

export const metadata: Metadata = {
  title: "User Profile Dashboard",
  description: "View and edit your profile information",
};
