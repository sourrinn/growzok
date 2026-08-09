import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://growzok.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/protocols", "/protocols/"],
        disallow: [
          "/dashboard",
          "/reports",
          "/account",
          "/admin",
          "/api",
          "/login",
          "/register",
          "/habit",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
