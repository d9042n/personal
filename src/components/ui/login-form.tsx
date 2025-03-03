import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Theme } from "@/types/theme";
import { GeometricSpotlight } from "../landing/geometric-spotlight";
import { MinimalShape } from "../landing/minimal-shape";
import { ArtisticShape } from "../landing/artistic-shape";
import { Fira_Code, Inter, Playfair_Display } from "next/font/google";
import { Facebook, Github } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-fira-code",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair-display",
});

const themeStyles = {
  geometric: {
    background: "bg-[#0a192f]",
    card: "bg-[#112240] border-[#233554]",
    text: "text-[#ccd6f6]",
    mutedText: "text-[#8892b0]",
    input:
      "bg-[#0a192f] border-[#233554] text-[#ccd6f6] focus:border-[#64ffda]",
    button:
      "bg-transparent border-2 border-[#64ffda] text-[#64ffda] hover:bg-[#64ffda]/10",
    font: firaCode.className,
    socialButton:
      "bg-[#0a192f] border-[#233554] text-[#ccd6f6] hover:border-[#64ffda] hover:text-[#64ffda] transition-all duration-300",
    divider: "border-[#233554]",
    dividerBg: "bg-[#112240]",
    dividerText: "text-[#ccd6f6]",
  },
  minimal: {
    background: "bg-white",
    card: "bg-white border-gray-200",
    text: "text-gray-900",
    mutedText: "text-gray-600",
    input: "bg-white border-gray-200 text-gray-900 focus:border-gray-900",
    button: "bg-black text-white hover:bg-gray-800",
    font: inter.className,
    socialButton:
      "bg-white border-gray-200 text-gray-900 hover:border-gray-900 hover:bg-gray-50 transition-all duration-300",
    divider: "border-gray-200",
    dividerBg: "bg-white",
    dividerText: "text-gray-600",
  },
  artistic: {
    background: "bg-[#1a0b2e]",
    card: "bg-[#1a0b2e]/50 border-white/10",
    text: "text-white",
    mutedText: "text-white/60",
    input: "bg-white/5 border-white/10 text-white focus:border-[#ff6b6b]",
    button:
      "bg-transparent border-2 border-[#ff6b6b] text-[#ff6b6b] hover:bg-[#ff6b6b]/10",
    font: playfairDisplay.className,
    socialButton:
      "bg-white/5 border-white/10 text-white hover:border-[#ff6b6b] hover:text-[#ff6b6b] transition-all duration-300",
    divider: "border-white/10",
    dividerBg: "bg-[#1a0b2e]",
    dividerText: "text-white/60",
  },
} as const;

export function LoginForm({
  className,
  theme = "geometric",
  ...props
}: React.ComponentProps<"div"> & { theme: Theme }) {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    username_or_email: "",
    password: "",
  });

  const styles = themeStyles[theme];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.username_or_email, formData.password);
    } catch {
      // Error is handled by the auth context
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  return (
    <div
      className={cn("flex flex-col gap-6", styles.font, className)}
      {...props}
    >
      <Card className={cn("overflow-hidden border", styles.card)}>
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit} className="p-6 md:p-8">
            {error && (
              <div
                className={cn(
                  "text-red-500 text-sm mb-4 text-center",
                  styles.text
                )}
              >
                {error}
              </div>
            )}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className={cn("text-2xl font-bold", styles.text)}>
                  Welcome back
                </h1>
                <p className={cn("text-sm", styles.mutedText)}>
                  Sign in to your account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username_or_email" className={styles.text}>
                  Username or Email
                </Label>
                <Input
                  id="username_or_email"
                  type="text"
                  required
                  className={styles.input}
                  value={formData.username_or_email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className={styles.text}>
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className={styles.input}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <Button
                type="submit"
                className={styles.button}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>

              <div className="relative text-center text-sm">
                <div
                  className={cn(
                    "absolute inset-x-0 top-1/2 h-px -translate-y-1/2",
                    styles.divider
                  )}
                />
                <span
                  className={cn(
                    "relative z-10 px-4",
                    styles.dividerText,
                    styles.dividerBg
                  )}
                >
                  Or continue with
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 rounded-md transition-all duration-300",
                    styles.socialButton
                  )}
                  onClick={() => console.log("GitHub login")}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Github className="h-5 w-5" />
                  </motion.div>
                  <span className="sr-only">Login with GitHub</span>
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 rounded-md transition-all duration-300",
                    styles.socialButton
                  )}
                  onClick={() => console.log("Google login")}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                        fill="currentColor"
                      />
                    </svg>
                  </motion.div>
                  <span className="sr-only">Login with Google</span>
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-11 rounded-md transition-all duration-300",
                    styles.socialButton
                  )}
                  onClick={() => console.log("Facebook login")}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Facebook className="h-5 w-5" />
                  </motion.div>
                  <span className="sr-only">Login with Facebook</span>
                </Button>
              </div>

              <div className="text-center text-sm">
                <span className={styles.mutedText}>
                  Don&apos;t have an account?{" "}
                </span>
                <Link
                  href={`/register?theme=${theme}`}
                  className={cn("underline underline-offset-4", styles.text)}
                >
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    className="inline-block"
                  >
                    Sign up
                  </motion.span>
                </Link>
              </div>
            </div>
          </form>
          <div className="relative hidden md:block">
            {theme === "geometric" && (
              <>
                <GeometricSpotlight
                  delay={0.3}
                  width={300}
                  height={80}
                  rotate={12}
                  gradient="from-[#64ffda]/[0.15]"
                  className="right-[-5%] top-[20%]"
                />
                <GeometricSpotlight
                  delay={0.5}
                  width={250}
                  height={60}
                  rotate={-15}
                  gradient="from-[#64ffda]/[0.15]"
                  className="left-[-5%] bottom-[20%]"
                />
              </>
            )}
            {theme === "minimal" && (
              <>
                <MinimalShape
                  delay={0.2}
                  size={150}
                  className="right-[10%] top-[20%]"
                />
                <MinimalShape
                  delay={0.4}
                  size={100}
                  className="left-[15%] bottom-[20%]"
                />
              </>
            )}
            {theme === "artistic" && (
              <>
                <ArtisticShape
                  delay={0.3}
                  width={150}
                  height={150}
                  rotate={12}
                  gradient="from-[#ff6b6b]/[0.3]"
                  className="right-[10%] top-[20%]"
                />
                <ArtisticShape
                  delay={0.5}
                  width={100}
                  height={100}
                  rotate={-15}
                  gradient="from-[#ff0080]/[0.3]"
                  className="left-[10%] bottom-[20%]"
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
