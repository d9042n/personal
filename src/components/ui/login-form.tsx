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
  },
  minimal: {
    background: "bg-white",
    card: "bg-white border-gray-200",
    text: "text-gray-900",
    mutedText: "text-gray-600",
    input: "bg-white border-gray-200 text-gray-900 focus:border-gray-900",
    button: "bg-black text-white hover:bg-gray-800",
    font: inter.className,
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
  },
} as const;

export function LoginForm({
  className,
  theme = "geometric",
  ...props
}: React.ComponentProps<"div"> & { theme: Theme }) {
  const styles = themeStyles[theme];

  return (
    <div
      className={cn("flex flex-col gap-6", styles.font, className)}
      {...props}
    >
      <Card className={cn("overflow-hidden border", styles.card)}>
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className={cn("text-2xl font-bold", styles.text)}>
                  Welcome back
                </h1>
                <p className={cn("text-balance", styles.mutedText)}>
                  Login to your account
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className={styles.text}>
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className={styles.input}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className={styles.text}>
                    Password
                  </Label>
                  <a
                    href="#"
                    className={cn(
                      "ml-auto text-sm hover:underline",
                      styles.mutedText
                    )}
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  className={styles.input}
                />
              </div>
              <Button type="submit" className={styles.button}>
                Login
              </Button>
              <div className="text-center text-sm">
                <span className={styles.mutedText}>
                  Don&apos;t have an account?{" "}
                </span>
                <a
                  href="#"
                  className={cn("underline underline-offset-4", styles.text)}
                >
                  Sign up
                </a>
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
