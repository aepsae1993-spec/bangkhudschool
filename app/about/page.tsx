import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SchoolLogo from "@/components/SchoolLogo";
import SectionTitle from "@/components/SectionTitle";
import { getSettings } from "@/lib/data";
import { Compass, Eye, Goal } from "lucide-react";

export const revalidate = 300;

export const metadata = {
  title: "เกี่ยวกับโรงเรียน",
  description: "ประวัติ วิสัยทัศน์ และพันธกิจของโรงเรียน",
};

const PILLARS = [
  {
    icon: Eye,
    title: "วิสัยทัศน์",
    text: "เป็นโรงเรียนคุณภาพที่พัฒนาผู้เรียนให้มีทักษะแห่งศตวรรษที่ 21 ควบคู่กับคุณธรรม",
  },
  {
    icon: Goal,
    title: "พันธกิจ",
    text: "จัดการศึกษาที่มุ่งเน้นผู้เรียนเป็นสำคัญ ด้วยกระบวนการเรียนรู้เชิงรุกและการใช้เทคโนโลยี",
  },
  {
    icon: Compass,
    title: "ปรัชญา",
    text: "ความรู้คู่คุณธรรม นำสู่ความเป็นเลิศในการดำเนินชีวิตและการเรียนรู้ตลอดชีวิต",
  },
];

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="เกี่ยวกับโรงเรียน"
        description={`${settings.school_name} โรงเรียนที่ดูแลและบ่มเพาะนักเรียนด้วยความใส่ใจมาอย่างยาวนาน`}
      />

      {/* Identity row */}
      <section className="container-x py-20">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-square rounded-[2rem] glass-strong flex items-center justify-center p-12">
              <div className="aurora opacity-50" />
              <div className="relative">
                <SchoolLogo size={220} />
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal>
              <span className="chip">เรื่องราวของเรา</span>
              <h2 className="mt-4 font-display text-3xl md:text-4xl font-semibold leading-tight">
                <span className="gold-text">
                  บ้านแห่งการเรียนรู้ที่อบอุ่น
                </span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-6 space-y-4 text-cream-100/80 leading-relaxed">
                <p>
                  {settings.school_name} เป็นโรงเรียนที่ก่อตั้งขึ้นด้วยจิตวิญญาณ
                  แห่งการสร้างคนให้เป็นทั้ง “คนเก่ง” และ “คนดี”
                  เราเชื่อว่าการศึกษาที่ดีต้องเริ่มจากบรรยากาศที่อบอุ่น
                  ครูที่ใส่ใจ และหลักสูตรที่ตอบโจทย์โลกจริง
                </p>
                <p>
                  ตลอดหลายทศวรรษที่ผ่านมา
                  เราได้ส่งต่อโอกาสและความรู้ให้กับนักเรียนนับพัน
                  ปลูกฝังคุณธรรม วินัย และความเป็นเลิศทางวิชาการ
                  เพื่อเป็นรากฐานของอนาคตที่มั่นคง
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="container-x py-20">
        <SectionTitle
          eyebrow="Our pillars"
          title="วิสัยทัศน์ · พันธกิจ · ปรัชญา"
        />
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {PILLARS.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="card h-full">
                <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 shadow-glow">
                  <p.icon size={22} />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-cream-100/75 leading-relaxed">
                  {p.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Timeline placeholder */}
      <section className="container-x py-20">
        <SectionTitle
          eyebrow="Heritage"
          title="เส้นทางแห่งการเติบโต"
          subtitle="เรื่องราวของโรงเรียนตลอดหลายทศวรรษ — จากวันแรก สู่อนาคต"
        />
        <div className="mt-14 relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold-300/40 to-transparent" />
          {[
            { year: "2509", text: "ก่อตั้งโรงเรียน บนพื้นที่อันร่มรื่นใกล้วัด" },
            { year: "2535", text: "ขยายหลักสูตรและพัฒนาอาคารเรียนใหม่" },
            { year: "2560", text: "นำเทคโนโลยีเข้าสู่ห้องเรียน เริ่มยุคดิจิทัล" },
            { year: "2569", text: "เดินหน้าสู่ทศวรรษใหม่ของการเรียนรู้" },
          ].map((m, i) => (
            <Reveal key={m.year} delay={i * 0.08}>
              <div
                className={`relative pl-12 md:pl-0 md:grid md:grid-cols-2 md:gap-12 mb-10 ${
                  i % 2 ? "md:[&>div:first-child]:order-2" : ""
                }`}
              >
                <div
                  className={`md:text-right ${
                    i % 2 ? "md:text-left" : ""
                  }`}
                >
                  <span className="font-display text-3xl gold-text">
                    {m.year}
                  </span>
                </div>
                <div className="card mt-3 md:mt-0">
                  <p className="text-cream-100/80">{m.text}</p>
                </div>
                <span className="absolute left-2 md:left-1/2 top-2 -translate-x-1/2 h-3 w-3 rounded-full bg-gold-400 shadow-glow" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
