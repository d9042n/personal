"use client";

import type { FC } from "react";
import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  GeometricSection,
  GradientSection,
  MinimalSection,
} from "@/components/landing";
import { fetchProfile, type ProfileResponse, ApiError } from "@/services/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  GeometricError,
  GradientError,
  MinimalError,
} from "@/components/error";

const ProfileContent: FC = () => {
  const [design, setDesign] = useState<"gradient" | "geometric" | "minimal">(
    "gradient"
  );
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchProfile(username);
      setProfileData(data);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleThemeSwitch = (
    currentTheme: "gradient" | "geometric" | "minimal"
  ) => {
    switch (currentTheme) {
      case "gradient":
        setDesign("geometric");
        break;
      case "geometric":
        setDesign("minimal");
        break;
      case "minimal":
        setDesign("gradient");
        break;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    switch (design) {
      case "gradient":
        return (
          <GradientError
            message={error}
            onRetry={loadProfile}
            onSwitchTheme={() => handleThemeSwitch("gradient")}
          />
        );
      case "geometric":
        return (
          <GeometricError
            message={error}
            onRetry={loadProfile}
            onSwitchTheme={() => handleThemeSwitch("geometric")}
          />
        );
      case "minimal":
        return (
          <MinimalError
            message={error}
            onRetry={loadProfile}
            onSwitchTheme={() => handleThemeSwitch("minimal")}
          />
        );
    }
  }

  if (!profileData) {
    switch (design) {
      case "gradient":
        return (
          <GradientError
            message="No profile data available"
            onRetry={loadProfile}
            onSwitchTheme={() => handleThemeSwitch("gradient")}
          />
        );
      case "geometric":
        return (
          <GeometricError
            message="No profile data available"
            onRetry={loadProfile}
            onSwitchTheme={() => handleThemeSwitch("geometric")}
          />
        );
      case "minimal":
        return (
          <MinimalError
            message="No profile data available"
            onRetry={loadProfile}
            onSwitchTheme={() => handleThemeSwitch("minimal")}
          />
        );
    }
  }

  const { profile } = profileData;
  const socialLinks = {
    github: profile.github,
    linkedin: "", // Add these to API if needed
    twitter: "", // Add these to API if needed
  };

  return (
    <main>
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => handleThemeSwitch("gradient")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            design === "gradient"
              ? "bg-purple-500 text-white"
              : "bg-zinc-800 text-zinc-300"
          }`}
        >
          Gradient
        </button>
        <button
          onClick={() => handleThemeSwitch("geometric")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            design === "geometric"
              ? "bg-[#64ffda] text-[#0a192f]"
              : "bg-zinc-800 text-zinc-300"
          }`}
        >
          Geometric
        </button>
        <button
          onClick={() => handleThemeSwitch("minimal")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            design === "minimal"
              ? "bg-black text-white"
              : "bg-zinc-800 text-zinc-300"
          }`}
        >
          Minimal
        </button>
      </div>

      {(() => {
        switch (design) {
          case "gradient":
            return (
              <GradientSection
                name={profile.name}
                title={profile.title}
                description={profile.description}
                socialLinks={socialLinks}
                badge={profile.badge}
                isAvailable={profile.is_available}
              />
            );
          case "geometric":
            return (
              <GeometricSection
                name={profile.name}
                title={profile.title}
                description={profile.description}
                badge={profile.badge}
                isAvailable={profile.is_available}
              />
            );
          case "minimal":
            return (
              <MinimalSection
                name={profile.name}
                title={profile.title}
                description={profile.description}
                badge={profile.badge}
                isAvailable={profile.is_available}
              />
            );
        }
      })()}
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
