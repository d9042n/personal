"use client";

import {FC, Suspense, useState} from "react";
import {useSearchParams} from "next/navigation";
import {Theme} from "@/types/theme";
import {useProfile} from "@/hooks/useProfile";
import {ThemeSwitcher} from "@/components/ui/theme-switcher";
import {ArtisticSection, GeometricSection, MinimalSection,} from "@/components/landing";
import {ArtisticError, GeometricError, MinimalError,} from "@/components/error";
import {LoadingSpinner} from "@/components/ui/loading-spinner";

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

const ProfileContent: FC = () => {
    const [design, setDesign] = useState<Theme>("geometric");
    const searchParams = useSearchParams();
    const username = searchParams.get("username");

    const {profileData, error, loading, loadProfile} = useProfile(username);

    if (loading) {
        return <LoadingSpinner/>;
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
            <ThemeSwitcher currentTheme={design} onThemeChange={setDesign}/>
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
        <Suspense fallback={<div>Loading...</div>}>
            <ProfileContent/>
        </Suspense>
    );
}
