"use client";

import type { NextPage } from "next";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { GeometricSection, GradientSection } from "@/components/landing";
import { fetchProfile, type ProfileResponse, ApiError } from "@/services/api";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { GeometricError, GradientError } from "@/components/error";

const ProfileContent: React.FC = () => {
  const [design, setDesign] = useState<"gradient" | "geometric">("gradient");
  const [profileData, setProfileData] = useState<ProfileResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const username = searchParams.get("username");

  const loadProfile = async () => {
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
  };

  useEffect(() => {
    loadProfile();
  }, [username]); // username is stable from useSearchParams

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return design === "gradient" ? (
      <GradientError
        message={error}
        onRetry={loadProfile}
        onSwitchTheme={() => setDesign("geometric")}
      />
    ) : (
      <GeometricError
        message={error}
        onRetry={loadProfile}
        onSwitchTheme={() => setDesign("gradient")}
      />
    );
  }

  if (!profileData) {
    return design === "gradient" ? (
      <GradientError
        message="No profile data available"
        onRetry={loadProfile}
        onSwitchTheme={() => setDesign("geometric")}
      />
    ) : (
      <GeometricError
        message="No profile data available"
        onRetry={loadProfile}
        onSwitchTheme={() => setDesign("gradient")}
      />
    );
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
          onClick={() => setDesign("gradient")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            design === "gradient"
              ? "bg-purple-500 text-white"
              : "bg-zinc-800 text-zinc-300"
          }`}
        >
          Gradient
        </button>
        <button
          onClick={() => setDesign("geometric")}
          className={`px-4 py-2 rounded-lg transition-colors ${
            design === "geometric"
              ? "bg-[#64ffda] text-[#0a192f]"
              : "bg-zinc-800 text-zinc-300"
          }`}
        >
          Geometric
        </button>
      </div>

      {design === "gradient" ? (
        <GradientSection
          name={profile.name}
          title={profile.title}
          description={profile.description}
          socialLinks={socialLinks}
          badge={profile.badge}
          isAvailable={profile.is_available}
        />
      ) : (
        <GeometricSection
          name={profile.name}
          title={profile.title}
          description={profile.description}
          badge={profile.badge}
          isAvailable={profile.is_available}
        />
      )}
    </main>
  );
};

export default function HomePage() {
  return <ProfileContent />;
}
