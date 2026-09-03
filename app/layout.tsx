import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title:"Abidos Pansiyon — Oda Planı", description:"Resepsiyon oda takip ekranı" };

export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="tr"><body>{children}</body></html>; }
