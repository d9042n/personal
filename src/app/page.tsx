"use client";

import { FC, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Theme } from "@/types/theme";
import { useProfile } from "@/hooks/useProfile";
import { ThemeSwitcher } from "@/components/ui/theme-switcher";
import {
  GeometricSection,
  GradientSection,
  MinimalSection,
} from "@/components/landing";
import {
  GeometricError,
  GradientError,
  MinimalError,
} from "@/components/error";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const ERROR_COMPONENTS = {
  gradient: GradientError,
  geometric: GeometricError,
  minimal: MinimalError,
} as const;

const SECTION_COMPONENTS = {
  gradient: GradientSection,
  geometric: GeometricSection,
  minimal: MinimalSection,
} as const;

const ProfileContent: FC = () => {
  const [design, setDesign] = useState<Theme>("gradient");
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const { profileData, error, loading, loadProfile } = useProfile(username);

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
      <SectionComponent {...profileData.profile} />
    </main>
  );
};

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
