import type { NextConfig } from "next";

function buildCspHeader(isDev: boolean) {
  const directives = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
    "style-src 'self' 'unsafe-inline'",
    `connect-src 'self'${isDev ? " ws: wss:" : ""} https:`,
    "img-src 'self' data: blob: https:",
    "font-src 'self' data:",
    "manifest-src 'self'",
    "worker-src 'self' blob:",
    "media-src 'self' blob:",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ];
  return directives.join("; ");
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ["192.168.100.2", "192.168.100.2:3001"],

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4005/api/:path*",
      },
    ];
  },

  async headers() {
    const isDev = process.env.NODE_ENV !== "production";
    const csp = buildCspHeader(isDev);

    const baseHeaders = [
      { key: "Content-Security-Policy", value: csp },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-DNS-Prefetch-Control", value: "off" },
      { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(), payment=(), usb=()" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
      { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
    ] as const;

    const prodOnlyHeaders =
      process.env.NODE_ENV === "production"
        ? ([{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }] as const)
        : ([] as const);

    if (isDev) return [];

    return [
      {
        source: "/:path*",
        headers: [...baseHeaders, ...prodOnlyHeaders],
      },
    ];
  },
};

export default nextConfig;
