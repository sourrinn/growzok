/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: [
          // Content Security Policy — prevents XSS injection
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // unsafe-eval needed by Next.js dev
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join("; "),
          },
          // Clickjacking protection
          { key: "X-Frame-Options", value: "DENY" },
          // MIME sniffing protection
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Referrer policy — don't leak paths to external sites
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // HSTS — force HTTPS
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Permissions policy — disable unused browser features
          {
            key: "Permissions-Policy",
            value: [
              "camera=()",
              "microphone=(self)", // needed for Web Audio API
              "geolocation=()",
              "payment=()",
            ].join(", "),
          },
        ],
      },
      {
        // Cache read-only API routes with ETags (avoids redundant MongoDB reads)
        source: "/api/habits",
        headers: [
          { key: "Cache-Control", value: "private, no-cache, must-revalidate" },
          { key: "Vary", value: "Authorization, Cookie" },
        ],
      },
      {
        // Long-lived cache for static calendar feed subscriptions
        source: "/api/calendar/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=1800, s-maxage=1800" },
        ],
      },
      {
        // CSP relaxation for web fonts on landing page
        source: "/",
        headers: [
          { key: "X-Robots-Tag", value: "index, follow" },
        ],
      },
    ];
  },
};

export default nextConfig;
