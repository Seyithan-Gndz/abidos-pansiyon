import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Resepsiyon ekranının yerel ağdaki tablet/telefonlardan interaktif çalışması için.
  allowedDevOrigins: ["192.168.1.113"],
};
export default nextConfig;
