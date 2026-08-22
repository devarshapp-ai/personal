import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const socialImageUrl = new URL(`${basePath}/og.png`, `${siteUrl}/`).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Devarsh Vasa — Java Backend Engineer",
  description:
    "Java developer and Application Engineer at Oracle India—solving problems, learning, and staying curious beyond the screen.",
  openGraph: {
    title: "Devarsh Vasa — Java Backend Engineer",
    description: "I write Java, solve problems, and stay curious.",
    type: "website",
    images: [{ url: socialImageUrl, width: 1200, height: 630, alt: "Devarsh Vasa — Java Backend Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Devarsh Vasa — Java Backend Engineer",
    description: "I write Java, solve problems, and stay curious.",
    images: [socialImageUrl],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
