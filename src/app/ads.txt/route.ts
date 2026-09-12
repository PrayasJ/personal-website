import { adsTxtBody } from "@/lib/ads";

export const dynamic = "force-static";

export function GET() {
  return new Response(adsTxtBody(), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
