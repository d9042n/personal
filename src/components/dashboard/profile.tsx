import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUserDetails, UserProfile } from "@/services/user";
import { useAuth } from "@/contexts/auth-context";

export function ProfileTab() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!user) {
          router.push("/login");
          return;
        }

        const data = await getUserDetails(params.username as string);
        setProfile(data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
        if (
          err instanceof Error &&
          err.message === "No refresh token available"
        ) {
          router.push("/login");
        } else {
          setError(
            "Unable to load user information at the moment. Please try again later."
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [params.username, router, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!profile) {
    return null;
  }

  const { profile: userProfile } = profile.users;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex items-center space-x-4">
              {userProfile.badge && (
                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                  <Image
                    src={userProfile.badge}
                    alt={userProfile.name || profile.username}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-2xl font-semibold">
                  {userProfile.name ||
                    `${profile.first_name} ${profile.last_name}`}
                </h3>
                {userProfile.title && (
                  <p className="text-muted-foreground">{userProfile.title}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4">
              <div>
                <h4 className="font-medium mb-2">Email</h4>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>

              {userProfile.description && (
                <div>
                  <h4 className="font-medium mb-2">Bio</h4>
                  <p className="text-muted-foreground">
                    {userProfile.description}
                  </p>
                </div>
              )}

              {userProfile.social_links &&
                Object.keys(userProfile.social_links).length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Social Links</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(userProfile.social_links).map(
                        ([platform, url]) => (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline capitalize"
                          >
                            {platform}
                          </a>
                        )
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
