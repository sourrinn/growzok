import type { MetadataRoute } from "next";
import { STANDARD_PROTOCOLS } from "@/lib/protocols";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://growzok.app";

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/protocols`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const protocolPages: MetadataRoute.Sitemap = STANDARD_PROTOCOLS.map((protocol) => ({
    url: `${baseUrl}/protocols/${protocol.key}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...protocolPages];
}
