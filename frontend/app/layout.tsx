import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Genesis — AI-Powered Reality Engine",
  description:
    "Transform mathematical equations and scientific theories into real-time interactive 3D simulations. Bridge ideas, mathematics, physics, and reality.",
  keywords: ["AI", "physics simulation", "mathematics", "3D", "reality engine", "scientific computing"],
  authors: [{ name: "Genesis Team" }],
  openGraph: {
    title: "Genesis — AI-Powered Reality Engine",
    description: "Transform mathematical equations into interactive 3D simulations.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV"
          crossOrigin="anonymous"
        />
      </head>
      <body className="cosmos-bg overflow-hidden">
        {children}
      </body>
    </html>
  );
}
