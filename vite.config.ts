// @ts-check
import preact from "@preact/preset-vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const config = defineConfig({
  plugins: [
    preact(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: [
        // "favicon.svg",
        "assets/favicon.ico",
        // "robots.txt",
        "assets/apple-touch-icon.png",
        "data/*.json",
      ],
      manifest: {
        name: "Clordle",
        display: "standalone",
        start_url: "/",
        short_name: "CW",
        theme_color: "#4a90e2",
        background_color: "#4a90e2",
        icons: [
          {
            src: "assets/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "assets/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "assets/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});

export default config;
