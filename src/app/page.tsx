"use client";

import { FC, useState } from "react";
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

const ProfileContent: FC = () => {
  const [design, setDesign] = useState<Theme>("gradient");
  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const { profileData, error, loading, loadProfile } = useProfile(username);

  if (loading) return <LoadingSpinner />;

  if (error) {
    const ErrorComponent = {
      gradient: GradientError,
      geometric: GeometricError,
      minimal: MinimalError,
    }[design];

    return (
      <ErrorComponent
        message={error}
        onRetry={loadProfile}
        onSwitchTheme={setDesign}
        currentTheme={design}
      />
    );
  }

  if (!profileData) {
    const ErrorComponent = {
      gradient: GradientError,
      geometric: GeometricError,
      minimal: MinimalError,
    }[design];

    return (
      <ErrorComponent
        message="No profile data available"
        onRetry={loadProfile}
        onSwitchTheme={setDesign}
        currentTheme={design}
      />
    );
  }

  const { profile } = profileData;

  return (
    <main>
      <ThemeSwitcher currentTheme={design} onThemeChange={setDesign} />

      {(() => {
        switch (design) {
          case "gradient":
            return <GradientSection {...profile} />;
          case "geometric":
            return <GeometricSection {...profile} />;
          case "minimal":
            return <MinimalSection {...profile} />;
        }
      })()}
    </main>
  );
};

export default function HomePage() {
  return <ProfileContent />;
}
