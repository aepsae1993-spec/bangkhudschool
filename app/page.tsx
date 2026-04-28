import Link from "next/link";
import Hero from "@/components/Hero";
import NewsCard from "@/components/NewsCard";
import Reveal from "@/components/Reveal";
import SectionTitle from "@/components/SectionTitle";
import StatCard from "@/components/StatCard";
import { getNews, getSettings } from "@/lib/data";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

export const revalidate = 60;

const FEATURES = [
  {
    icon: GraduationCap,
    title: "หลักสูตรคุณภาพ",
    desc: "หลักสูตรครบรอบด้านที่บูรณาการความรู้สมัยใหม่กับคุณค่าทางวัฒนธรรมไทย",
  },
  {
    icon: Sparkles,
    title: "บรรยากาศการเรียนรู้",
    desc: "ห้องเรียนสร้างแรงบันดาลใจ พร้อมสื่อและเทคโนโลยีทันสมัย",
  },
  {
    icon: HeartHandshake,
    title: "ครูผู้ใส่ใจ",
    desc: "คณะครูมืออาชีพที่ดูแลนักเรียนเป็นรายบุคคล อย่างอบอุ่น",
  },
  {
    icon: Trophy,
    title: "เวทีแห่งความสำเร็จ",
    desc: "สนับสนุนนักเรียนสู่การแข่งขันและเวทีระดับเขต ระดับชาติ",
  },
  {
    icon: BookOpen,
    title: "อ่านออก เขียนได้ คิดเป็น",
    desc: "ปลูกฝังทักษะภาษา การคิดวิเคราะห์ และการเรียนรู้ด้วยตนเอง",
  },
  {
    icon: ShieldCheck,
    title: "คุณธรรมนำชีวิต",
    desc: "บ่มเพาะคุณธรรม จริยธรรม ความซื่อสัตย์ และความรับผิดชอบต่อสังคม",
  },
];

export default async function HomePage() {
  const [settings, news] = await Promise.all([getSettings(), getNews(6)]);

  return (
    <>
      <Hero
        schoolName={settings.school_name}
        motto={settings.motto}
        subtitle={settings.hero_subtitle}
      />

      {/* Stats */}
      <section className="container-x py-20 md:py-24">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard value={60} suffix="+" label="ปีแห่งการพัฒนา" />
          <StatCard value={420} label="นักเรียนปัจจุบัน" delay={0.1} />
          <StatCard value={32} label="ครูและบุคลากร" delay={0.2} />
          <StatCard value={100} suffix="%" label="ใส่ใจทุกคน" delay={0.3} />
        </div>
      </section>

      {/* Features */}
      <section className="container-x py-20 md:py-24">
        <SectionTitle
          eyebrow="Why us"
          title="เพราะที่นี่ ใส่ใจในทุกย่างก้าว"
          subtitle="เราเชื่อว่าโรงเรียนที่ดีคือบ้านหลังที่สอง — ที่ซึ่งทุกความฝันของเด็กจะได้รับการเพาะบ่ม"
        />

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.07}>
              <div className="card h-full">
                <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 shadow-glow">
                  <f.icon size={22} />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-cream-100/70 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* News */}
      <section className="container-x py-20 md:py-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <SectionTitle
            align="left"
            eyebrow="Latest"
            title="ข่าวสารและกิจกรรม"
            subtitle="ติดตามเรื่องราวล่าสุดจากรั้วอุ่นพิทยาคาร"
          />
          <Link href="/news" className="btn-ghost self-start md:self-end">
            ดูทั้งหมด <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((n, i) => (
            <NewsCard key={n.id} item={n} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-x py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] glass-strong p-10 md:p-16 text-center">
            <div className="aurora opacity-60" />
            <div className="relative">
              <h3 className="font-display text-3xl md:text-5xl font-semibold leading-tight">
                <span className="gold-text">
                  ก้าวต่อไปของลูกคุณ เริ่มต้นที่นี่
                </span>
              </h3>
              <p className="mt-4 max-w-2xl mx-auto text-cream-100/70">
                สมัครเรียน หรือสอบถามรายละเอียดเพิ่มเติม
                เราพร้อมตอบทุกคำถามด้วยใจ
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contact" className="btn-primary">
                  ติดต่อโรงเรียน <ArrowRight size={18} />
                </Link>
                <Link href="/about" className="btn-ghost">
                  ดูข้อมูลโรงเรียน
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
