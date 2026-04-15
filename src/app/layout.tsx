import { Bebas_Neue, Manrope } from "next/font/google";

import type { Metadata } from "next";

import "./globals.css";

import { cn } from "@/lib/utils";

import { AdminContextProvider } from "@/context/admin-context";

import ReactQueryProvider from "@/components/providers/react-query-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

const bebasNeueHeading = Bebas_Neue({
   variable: "--font-heading",
   weight: ["400"],
   subsets: ["latin"],
   preload: true,
});

const manrope = Manrope({ subsets: ["latin"], variable: "--font-sans", preload: true });

export const metadata: Metadata = {
   title: "Abid Shah Khan | Frontend Developer",
   description:
      "Frontend Developer based in Karachi, specializing in React, Next.js, TypeScript, scalable UI architecture, React Query, and modern web experiences.",
   keywords: [
      "Abid Shah Khan",
      "Frontend Developer",
      "React Developer",
      "Next.js Developer",
      "TypeScript",
      "Tailwind CSS",
      "React Query",
      "Portfolio",
      "Karachi",
   ],
   authors: [{ name: "Abid Shah Khan" }],
   creator: "Abid Shah Khan",
   metadataBase: new URL("https://abid-khan-portfolio.vercel.app"),
   openGraph: {
      title: "Abid Shah Khan | Frontend Developer",
      description:
         "Explore the portfolio of Abid Shah Khan, a Frontend Developer building scalable and high-performance web applications.",
      url: "https://abid-khan-portfolio.vercel.app",
      siteName: "Abid Portfolio",
      type: "website",
   },
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html
         lang="en"
         className={cn(
            "h-full",
            "antialiased",
            "font-sans",
            manrope.variable,
            bebasNeueHeading.variable,
         )}
         suppressHydrationWarning
      >
         <body className="min-h-full flex flex-col">
            <ReactQueryProvider>
               <AdminContextProvider>
                  <ThemeProvider
                     attribute="class"
                     defaultTheme="system"
                     enableSystem
                     disableTransitionOnChange
                  >
                     <TooltipProvider>{children}</TooltipProvider>
                  </ThemeProvider>
               </AdminContextProvider>
            </ReactQueryProvider>
            <Toaster
               position="top-right"
               richColors
               toastOptions={{
                  style: {
                     background: "var(--card)",
                     color: "var(--card-foreground)",
                     border: "1px solid var(--border)",
                     borderRadius: "var(--radius)",
                  },
                  classNames: {
                     success: "!border-green-500 [&>[data-icon]]:text-green-500",
                     error: "!border-destructive [&>[data-icon]]:text-destructive",
                     warning: "!border-yellow-500 [&>[data-icon]]:text-yellow-500",
                     info: "!border-ring [&>[data-icon]]:text-ring",
                  },
                  duration: 2000,
               }}
            />
         </body>
      </html>
   );
}
