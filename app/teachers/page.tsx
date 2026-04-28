import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { getTeachers } from "@/lib/data";
import { Mail, Phone, User } from "lucide-react";

export const revalidate = 300;

export const metadata = { title: "บุคลากร" };

export default async function TeachersPage() {
  const teachers = await getTeachers();

  // group by department
  const groups = teachers.reduce<Record<string, typeof teachers>>((acc, t) => {
    const k = t.department || "บุคลากรทั่วไป";
    (acc[k] ||= []).push(t);
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        eyebrow="People"
        title="คณะผู้บริหารและครู"
        description="ทีมงานคุณภาพที่ใส่ใจดูแลและพัฒนานักเรียนของเราในทุก ๆ ด้าน"
      />

      <section className="container-x py-16 space-y-16">
        {Object.entries(groups).map(([dept, list], gi) => (
          <div key={dept}>
            <Reveal>
              <h2 className="font-display text-2xl md:text-3xl mb-8">
                <span className="gold-text">{dept}</span>
              </h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {list.map((t, i) => (
                <Reveal key={t.id} delay={(gi * 4 + i) * 0.05}>
                  <div className="card text-center h-full">
                    <div className="mx-auto h-28 w-28 rounded-full overflow-hidden ring-1 ring-gold-300/40 bg-gradient-to-br from-ink-700 to-ink-900 flex items-center justify-center">
                      {t.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={t.photo_url}
                          alt={t.full_name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User size={42} className="text-gold-300/60" />
                      )}
                    </div>
                    <h3 className="mt-5 font-semibold">{t.full_name}</h3>
                    {t.position && (
                      <div className="text-sm text-gold-200 mt-1">
                        {t.position}
                      </div>
                    )}
                    <div className="mt-3 flex items-center justify-center gap-2 text-sm text-cream-100/70">
                      {t.email && (
                        <a
                          href={`mailto:${t.email}`}
                          className="hover:text-gold-200"
                          aria-label="email"
                        >
                          <Mail size={16} />
                        </a>
                      )}
                      {t.phone && (
                        <a
                          href={`tel:${t.phone}`}
                          className="hover:text-gold-200"
                          aria-label="phone"
                        >
                          <Phone size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
