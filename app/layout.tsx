import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
export const metadata: Metadata = { title: { default: "Martin Li — Mechanical Engineering", template: "%s | Martin Li" }, description: "Martin Li is a mechanical engineering senior at UC Irvine. Explore his paid TRS electrical assembly experience, mechanical design skills, and aerospace, robotics, and community hardware projects.", icons: { icon: "/favicon.svg" } };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body><a className="skip-link" href="#main">Skip to content</a><SiteHeader />{children}<SiteFooter /></body></html>; }
