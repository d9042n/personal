"use client";

import { FC, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useProfile } from "@/hooks/useProfile";
import { Theme } from "@/types/theme";
import { useState } from "react";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import {
  ArtisticSection,
  GeometricSection,
  MinimalSection,
} from "@/components/landing";
import {
  ArtisticError,
  GeometricError,
  MinimalError,
} from "@/components/error";

// Map theme names to their respective components
const ERROR_COMPONENTS = {
  geometric: GeometricError,
  minimal: MinimalError,
  artistic: ArtisticError,
} as const;

const SECTION_COMPONENTS = {
  geometric: GeometricSection,
  minimal: MinimalSection,
  artistic: ArtisticSection,
} as const;

const DEFAULT_USERNAME =
  process.env.NEXT_PUBLIC_DEFAULT_PROFILE_USERNAME ?? "default";

const ProfileContent: FC = () => {
  const [design, setDesign] = useState<Theme>("geometric");
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username");
  const { profileData, error, loading, loadProfile } =
    useProfile(DEFAULT_USERNAME);

  // If username is provided in query, redirect to public profile
  if (username?.trim()) {
    router.replace(`/public/${username}`);
    return <LoadingSpinner />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  const ErrorComponent = ERROR_COMPONENTS[design];

  if (error || !profileData) {
    return (
      <ErrorComponent
        message={error ?? "No profile data available"}
        onRetry={loadProfile}
        onSwitchTheme={setDesign}
        currentTheme={design}
      />
    );
  }

  const SectionComponent = SECTION_COMPONENTS[design];

  return (
    <main>
      <ThemeSwitcher currentTheme={design} onThemeChange={setDesign} />
      <SectionComponent
        isAvailable={profileData.profile.is_available}
        badge={profileData.profile.badge}
        name={profileData.profile.name}
        title={profileData.profile.title}
        description={profileData.profile.description}
        socialLinks={profileData.profile.social_links}
      />
    </main>
  );
};

export default function HomePage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ProfileContent />
    </Suspense>
  );
}
