"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { FieldError } from "react-hook-form";

// Schema for social links validation
const socialLinksSchema = z.object({
  github: z.string().url().optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  twitter: z.string().url().optional().or(z.literal("")),
  facebook: z.string().url().optional().or(z.literal("")),
  leetcode: z.string().url().optional().or(z.literal("")),
  hackerrank: z.string().url().optional().or(z.literal("")),
  medium: z.string().url().optional().or(z.literal("")),
  stackoverflow: z.string().url().optional().or(z.literal("")),
  portfolio: z.string().url().optional().or(z.literal("")),
  youtube: z.string().url().optional().or(z.literal("")),
  devto: z.string().url().optional().or(z.literal("")),
});

// Schema for profile validation
const profileSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().optional(),
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  profile: z.object({
    name: z.string().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    badge: z.string().optional(),
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

  const {
    formState: { errors, isDirty },
  } = form;

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

  // Clean and prepare form data for submission
  const prepareFormData = (data: ProfileFormData): ProfileFormData => {
    // Start with required fields
    const cleanedData: ProfileFormData = {
      username,
      profile: {
        is_available: data.profile.is_available,
        social_links: {}, // Will be populated with non-empty links
      },
    };

    // Add non-empty email, first_name, last_name if they exist
    if (data.email?.trim()) cleanedData.email = data.email;
    if (data.first_name?.trim()) cleanedData.first_name = data.first_name;
    if (data.last_name?.trim()) cleanedData.last_name = data.last_name;

    // Add non-empty profile fields if they exist
    if (data.profile.name?.trim()) cleanedData.profile.name = data.profile.name;
    if (data.profile.title?.trim())
      cleanedData.profile.title = data.profile.title;
    if (data.profile.description?.trim())
      cleanedData.profile.description = data.profile.description;
    if (data.profile.badge?.trim())
      cleanedData.profile.badge = data.profile.badge;

    // Handle social links - make sure we're accessing the correct property
    if (data.profile.social_links) {
      const links = data.profile.social_links;
      const nonEmptyLinks = Object.entries(links).reduce(
        (acc, [key, value]) => {
          // Only include links that have a non-empty value
          if (value && value.trim() !== "") {
            acc[key] = value.trim();
          }
          return acc;
        },
        {} as Record<string, string>
      );

      // Only set social_links if we have any non-empty links
      if (Object.keys(nonEmptyLinks).length > 0) {
        cleanedData.profile.social_links = nonEmptyLinks;
      }
    }

    return cleanedData;
  };

  const onSubmit = async (data: ProfileFormData) => {
    if (!isDirty) {
      toast.info("No changes to save");
      return;
    }

    const cleanedData = prepareFormData(data);

    setIsLoading(true);
    try {
      await userApi.updateProfile(username, cleanedData);
      toast.success("Your profile has been updated");
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        try {
          await refreshToken();
          await userApi.updateProfile(username, cleanedData);
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
          <Button type="submit" disabled={isLoading || !isDirty}>
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
                    {errors.username && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.username.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...form.register("email")}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" {...form.register("first_name")} />
                    {errors.first_name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.first_name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" {...form.register("last_name")} />
                    {errors.last_name && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.last_name.message}
                      </p>
                    )}
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
                  {errors.profile?.name && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.profile.name.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile.title">Title</Label>
                  <Input
                    id="profile.title"
                    {...form.register("profile.title")}
                  />
                  {errors.profile?.title && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.profile.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile.description">Bio</Label>
                  <Textarea
                    id="profile.description"
                    {...form.register("profile.description")}
                  />
                  {errors.profile?.description && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.profile.description.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profile.badge">Badge</Label>
                  <Input
                    id="profile.badge"
                    {...form.register("profile.badge")}
                  />
                  {errors.profile?.badge && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.profile.badge.message}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Controller
                    name="profile.is_available"
                    control={form.control}
                    render={({ field }) => (
                      <Switch
                        id="profile.is_available"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    )}
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
                ).map((key) => (
                  <div key={key} className="space-y-2">
                    <Label
                      htmlFor={`profile.social_links.${key}`}
                      className="capitalize"
                    >
                      {key}
                    </Label>
                    <Input
                      id={`profile.social_links.${key}`}
                      {...form.register(`profile.social_links.${key}`)}
                      placeholder={`Enter your ${key} URL`}
                      type="url"
                    />
                    {errors.profile?.social_links?.[key] && (
                      <p className="text-sm text-red-500 mt-1">
                        {
                          (errors.profile.social_links[key] as FieldError)
                            ?.message
                        }
                      </p>
                    )}
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
