import { join } from "https://deno.land/std@0.176.0/path/mod.ts";

const manifest = {
  icons: [
    { src: "/icon-192.png", type: "image/png", sizes: "192x192" },
    { src: "/icon-512.png", type: "image/png", sizes: "512x512" },
  ],
} as const;

export function writeManifest(outdir: string) {
  Deno.writeTextFileSync(
    join(outdir, "manifest.webmanifest"),
    JSON.stringify(manifest, null, 2)
  );
}
