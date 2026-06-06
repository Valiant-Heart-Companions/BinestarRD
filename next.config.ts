import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

// Provider photos are served from Supabase Storage's public object endpoint.
// Derive the host from the configured project URL, falling back to the known
// project ref so images still optimize when the env var is absent at build.
const supabaseHost = (() => {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL ??
        'https://nigjhvhpyowruhxytdpy.supabase.co',
    ).hostname;
  } catch {
    return 'nigjhvhpyowruhxytdpy.supabase.co';
  }
})();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHost,
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default withBundleAnalyzer(nextConfig);
