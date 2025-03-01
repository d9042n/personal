"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { userApi } from "@/services/api";
import { useAuth } from "@/contexts/auth-context";
import type { ProfileFormData } from "@/types/api";
import { useRouter } from "next/navigation";

const socialLinksSchema = z.object({
  github: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  facebook: z.string().url().optional(),
  leetcode: z.string().url().optional(),
  hackerrank: z.string().url().optional(),
  medium: z.string().url().optional(),
  stackoverflow: z.string().url().optional(),
  portfolio: z.string().url().optional(),
  youtube: z.string().url().optional(),
  devto: z.string().url().optional(),
});

const profileSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email(),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  profile: z.object({
    name: z.string(),
    title: z.string(),
    description: z.string(),
    badge: z.string(),
    is_available: z.boolean(),
    social_links: socialLinksSchema,
  }),
}) satisfies z.ZodType<ProfileFormData>;

interface UserProfileDashboardProps {
  username: string;
}

export function UserProfileDashboard({ username }: UserProfileDashboardProps) {
  const router = useRouter();
  const { user, isAuthenticated, refreshToken } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username,
      profile: {
        is_available: false,
        social_links: {},
      },
    } as ProfileFormData,
  });

  useEffect(() => {
    setMounted(true);
    const fetchUserProfile = async () => {
      try {
        if (!isAuthenticated) {
          router.push("/login");
          return;
        }

        if (user?.username !== username) {
          toast.error("You can only edit your own profile");
          router.push(`/dashboard/${user?.username}`);
          return;
        }

        const data = await userApi.getProfile(username);
        form.reset(data);
      } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
          try {
            await refreshToken();
            const data = await userApi.getProfile(username);
            form.reset(data);
          } catch {
            toast.error("Session expired. Please log in again");
            router.push("/login");
          }
        } else {
          toast.error("Failed to load profile data");
        }
      }
    };

    fetchUserProfile();
  }, [username, form, isAuthenticated, user, router, refreshToken]);

  if (!mounted || !isAuthenticated || user?.username !== username) {
    return null;
  }

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      await userApi.updateProfile(username, data);
      toast.success("Your profile has been updated");
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        try {
          await refreshToken();
          await userApi.updateProfile(username, data);
          toast.success("Your profile has been updated");
        } catch {
          toast.error("Session expired. Please log in again");
          router.push("/login");
        }
      } else {
        toast.error("Failed to update profile");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="social">Social Links</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Information</CardTitle>
                <CardDescription>
                  Update your basic account information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      {...form.register("username")}
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" {...form.register("first_name")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" {...form.register("last_name")} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                <CardDescription>
                  Customize how others see you on the platform.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="profile.name">Display Name</Label>
                  <Input id="profile.name" {...form.register("profile.name")} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile.title">Title</Label>
                  <Input
                    id="profile.title"
                    {...form.register("profile.title")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile.description">Bio</Label>
                  <Textarea
                    id="profile.description"
                    {...form.register("profile.description")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile.badge">Badge</Label>
                  <Input
                    id="profile.badge"
                    {...form.register("profile.badge")}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="profile.is_available"
                    {...form.register("profile.is_available")}
                  />
                  <Label htmlFor="profile.is_available">
                    Available for hire
                  </Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>
                  Connect your social media profiles.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {(
                  Object.keys(socialLinksSchema.shape) as Array<
                    keyof typeof socialLinksSchema.shape
                  >
                ).map((platform) => (
                  <div key={platform} className="space-y-2">
                    <Label
                      htmlFor={`profile.social_links.${platform}`}
                      className="capitalize"
                    >
                      {platform}
                    </Label>
                    <Input
                      id={`profile.social_links.${platform}`}
                      {...form.register(`profile.social_links.${platform}`)}
                      placeholder={`Your ${platform} URL`}
                      type="url"
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </form>
  );
}
