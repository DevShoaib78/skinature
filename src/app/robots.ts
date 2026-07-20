import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  // Pre-launch: with SITE_NOINDEX set (the founders-testing phase on the real
  // domain, no password gate), tell crawlers to skip the whole site. Remove the
  // env var at real launch. The middleware sends a matching X-Robots-Tag header.
  if (process.env.SITE_NOINDEX) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
    };
  }
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/cart", "/checkout", "/search", "/admin", "/review"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
