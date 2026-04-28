import type { Metadata } from "next";
import { Prompt, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSettings } from "@/lib/data";

const prompt = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "โรงเรียนวัดบางขุด(อุ่นพิทยาคาร)",
    template: "%s · โรงเรียนวัดบางขุด(อุ่นพิทยาคาร)",
  },
  description:
    "เว็บไซต์ทางการของโรงเรียนวัดบางขุด(อุ่นพิทยาคาร) — บ่มเพาะปัญญา สร้างคนดี ด้วยจิตวิญญาณแห่งการเรียนรู้ตลอดชีวิต",
  openGraph: {
    title: "โรงเรียนวัดบางขุด(อุ่นพิทยาคาร)",
    description: "เว็บไซต์ทางการของโรงเรียน",
    type: "website",
    locale: "th_TH",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  return (
    <html lang="th" className={`${prompt.variable} ${playfair.variable}`}>
      <body>
        <Navbar schoolName={settings.school_name} />
        <main className="relative">{children}</main>
        <Footer settings={settings} />
      </body>
    </html>
  );
}
