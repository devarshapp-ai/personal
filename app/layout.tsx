import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const socialImageUrl = new URL(`${basePath}/og.png`, `${siteUrl}/`).toString();
const faviconIcoUrl = new URL(`${basePath}/favicon.ico`, `${siteUrl}/`).toString();
const favicon48Url = new URL(`${basePath}/favicon-48.png`, `${siteUrl}/`).toString();
const favicon96Url = new URL(`${basePath}/favicon-96.png`, `${siteUrl}/`).toString();
const appleIconUrl = new URL(`${basePath}/favicon.png`, `${siteUrl}/`).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Devarsh Vasa — Java Backend Engineer",
  description:
    "Java developer and Application Engineer at Oracle India—solving problems, learning, and staying curious beyond the screen.",
  keywords: [
    "Devarsh Vasa",
    "Devarsh Vasa Java developer",
    "Java backend developer India",
    "Application Engineer Oracle India",
    "Spring Boot developer",
    "Java developer Ahmedabad",
    "Java developer Gandhinagar",
  ],
  authors: [{ name: "Devarsh Vasa", url: siteUrl }],
  creator: "Devarsh Vasa",
  robots: { index: true, follow: true },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: faviconIcoUrl, type: "image/x-icon", sizes: "48x48" },
      { url: favicon48Url, type: "image/png", sizes: "48x48" },
      { url: favicon96Url, type: "image/png", sizes: "96x96" },
    ],
    shortcut: faviconIcoUrl,
    apple: [{ url: appleIconUrl, type: "image/png", sizes: "128x128" }],
  },
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
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Devarsh Vasa",
              url: siteUrl,
              image: socialImageUrl,
              jobTitle: "Application Engineer",
              worksFor: { "@type": "Organization", name: "Oracle India" },
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "LDRP Institute of Technology and Research",
              },
              knowsAbout: ["Java", "Spring Boot", "REST APIs", "SQL", "Redis", "Docker", "System Design"],
              sameAs: ["https://www.linkedin.com/in/devarsh-vasa/"],
            }),
          }}
        />
      </body>
    </html>
  );
}
