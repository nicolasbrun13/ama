import type { NextConfig } from "next";

const ContentSecurityPolicy = [
  "default-src 'self'",
  // PayPal SDK + inline scripts Next.js
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.paypal.com https://www.paypalobjects.com",
  // Google Fonts + styles inline
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Google Fonts fichiers
  "font-src 'self' data: https://fonts.gstatic.com",
  // Images YouTube thumbnails + vidéos Mixkit + propres assets
  "img-src 'self' data: https://img.youtube.com https://assets.mixkit.co",
  // Vidéos Mixkit (VideoBackground)
  "media-src 'self' https://assets.mixkit.co",
  // Appels API PayPal depuis le navigateur (SDK)
  "connect-src 'self' https://*.paypal.com https://api-m.paypal.com https://api-m.sandbox.paypal.com",
  // iframes PayPal checkout + YouTube embeds
  "frame-src https://*.paypal.com https://www.youtube.com https://www.youtube-nocookie.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join('; ');

const securityHeaders = [
  {
    key:   'Content-Security-Policy',
    value: ContentSecurityPolicy,
  },
  {
    key:   'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key:   'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key:   'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key:   'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key:   'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.mixkit.co' },
      { protocol: 'https', hostname: 'img.youtube.com' },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
