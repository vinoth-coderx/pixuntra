import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ToastProvider } from "@/components/providers/toast-provider";
import { LoginPromptProvider } from "@/components/providers/login-prompt-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Splash } from "@/components/layout/splash";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const display = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Pixuntra — Discover ideas worth looking at",
    template: "%s · Pixuntra",
  },
  description:
    "Pixuntra is a place to explore, save, and share visual ideas. A premium feed of curated images for creators.",
  applicationName: "Pixuntra",
  authors: [{ name: "Vinoth" }],
  creator: "Vinoth",
  keywords: [
    "pixuntra",
    "pinterest alternative",
    "image discovery",
    "mood board",
    "creative inspiration",
  ],
  openGraph: {
    title: "Pixuntra — Discover ideas worth looking at",
    description:
      "Explore, save and share visual ideas on Pixuntra. Built for creators.",
    siteName: "Pixuntra",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('pix-theme');
                  if (!t) {
                    t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  if (t === 'dark') document.documentElement.classList.add('dark');
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${sans.variable} ${display.variable} font-sans bg-bg text-fg min-h-screen flex flex-col`}
      >
        <Splash />
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <LoginPromptProvider>
                <Navbar />
                <main className="flex-1 w-full">{children}</main>
                <Footer />
              </LoginPromptProvider>
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
