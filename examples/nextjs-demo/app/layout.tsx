import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PD-Markdown SSR Demo",
  description: "Next.js SSR example for pd-markdown",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased max-w-4xl mx-auto p-8">
        {children}
      </body>
    </html>
  );
}
