import type { NextConfig } from "next";
import nextPWA from "next-pwa";

const withPWA = nextPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jasrphiflwwvwnmkzrhp.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

// بنستخدم as any عشان نكسر التعارض بين نسخ الـ NextConfig المؤقتة
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default withPWA(nextConfig as any);
