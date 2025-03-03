import { Metadata } from "next";
import { Suspense } from "react";
import { UserProfileDashboard } from "@/components/UserProfileDashboard";
import { UserProfileSkeleton } from "@/components/UserProfileSkeleton";

type PageParams = {
  username: string;
};

type Props = {
  params: PageParams;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return {
    title: `${params.username}'s Dashboard`,
    description: "View and edit your profile information",
  };
}

export default function DashboardPage({ params }: Props) {
  return (
    <div className="container mx-auto py-8 px-4">
      <Suspense fallback={<UserProfileSkeleton />}>
        <UserProfileDashboard username={params.username} />
      </Suspense>
    </div>
  );
}
