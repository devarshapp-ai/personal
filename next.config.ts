import type { NextConfig } from "next";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/").at(-1) ?? "";
const repositoryOwner = process.env.GITHUB_REPOSITORY_OWNER ?? "";
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === "true";
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
const isUserSiteRepository =
  repositoryName.toLowerCase() ===
  `${repositoryOwner.toLowerCase()}.github.io`;
const basePath =
  isGitHubPagesBuild &&
  !configuredSiteUrl &&
  repositoryName &&
  !isUserSiteRepository
    ? `/${repositoryName}`
    : "";
const siteUrl =
  configuredSiteUrl ??
  (isGitHubPagesBuild && repositoryOwner
    ? `https://${repositoryOwner}.github.io${basePath}`
    : "http://localhost:3000");

const nextConfig: NextConfig = {
  output: "export",
  // An absolute prefix keeps the emitted `_next` directory at the artifact
  // root while still pointing browsers at the repository URL on GitHub Pages.
  assetPrefix: isGitHubPagesBuild ? siteUrl : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_SITE_URL: siteUrl,
  },
};

export default nextConfig;
