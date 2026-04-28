import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { getSettings } from "@/lib/data";
import { Facebook, Mail, MapPin, Phone } from "lucide-react";

export const revalidate = 300;

export const metadata = { title: "ติดต่อโรงเรียน" };

export default async function ContactPage() {
  const s = await getSettings();
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="ติดต่อโรงเรียน"
        description="ยินดีต้อนรับทุกข้อสงสัยและคำแนะนำจากผู้ปกครองและชุมชน"
      />

      <section className="container-x py-16 grid lg:grid-cols-5 gap-8">
        <Reveal className="lg:col-span-2">
          <div className="card h-full space-y-6">
            <div className="flex gap-4">
              <div className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 flex items-center justify-center shadow-glow">
                <MapPin size={20} />
              </div>
              <div>
                <div className="text-sm text-gold-300/80 uppercase tracking-widest">
                  ที่อยู่
                </div>
                <div className="mt-1 text-cream-100/85">
                  {s.address || "—"}
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 flex items-center justify-center shadow-glow">
                <Phone size={20} />
              </div>
              <div>
                <div className="text-sm text-gold-300/80 uppercase tracking-widest">
                  โทรศัพท์
                </div>
                {s.phone ? (
                  <a
                    href={`tel:${s.phone}`}
                    className="mt-1 text-cream-100/85 hover:text-gold-200"
                  >
                    {s.phone}
                  </a>
                ) : (
                  "—"
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <div className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 flex items-center justify-center shadow-glow">
                <Mail size={20} />
              </div>
              <div>
                <div className="text-sm text-gold-300/80 uppercase tracking-widest">
                  อีเมล
                </div>
                {s.email ? (
                  <a
                    href={`mailto:${s.email}`}
                    className="mt-1 text-cream-100/85 hover:text-gold-200 break-all"
                  >
                    {s.email}
                  </a>
                ) : (
                  "—"
                )}
              </div>
            </div>
            {s.facebook && (
              <div className="flex gap-4">
                <div className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 flex items-center justify-center shadow-glow">
                  <Facebook size={20} />
                </div>
                <div>
                  <div className="text-sm text-gold-300/80 uppercase tracking-widest">
                    Facebook
                  </div>
                  <a
                    href={s.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 text-cream-100/85 hover:text-gold-200"
                  >
                    เพจของโรงเรียน
                  </a>
                </div>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-3">
          <div className="card h-full overflow-hidden p-0">
            <div className="aspect-video w-full">
              {s.map_embed ? (
                <iframe
                  src={s.map_embed}
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center text-cream-100/50 text-sm">
                  เพิ่ม Google Maps Embed URL ที่ site_settings.map_embed
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
