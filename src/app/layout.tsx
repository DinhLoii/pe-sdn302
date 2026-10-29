import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "SDN302 Starter", description: "Environment setup for SDN302 practical practice." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="vi"><body>{children}</body></html>;
}