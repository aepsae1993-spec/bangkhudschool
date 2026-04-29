import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import StatCard from "@/components/StatCard";
import { GRADE_ORDER, getClassrooms, gradeIndex } from "@/lib/data";
import type { Classroom } from "@/lib/types";
import { GraduationCap, Users } from "lucide-react";

export const revalidate = 120;

export const metadata = { title: "ข้อมูลนักเรียน" };

function sumOf(rows: Classroom[]) {
  const m = rows.reduce((s, r) => s + r.male_count, 0);
  const f = rows.reduce((s, r) => s + r.female_count, 0);
  return { m, f, total: m + f };
}

export default async function StudentsPage() {
  const rooms = (await getClassrooms()).slice().sort((a, b) => {
    const ga = gradeIndex(a.grade);
    const gb = gradeIndex(b.grade);
    if (ga !== gb) return ga - gb;
    return a.room.localeCompare(b.room, "th", { numeric: true });
  });

  const totals = sumOf(rooms);

  // group by grade
  const byGrade = rooms.reduce<Record<string, Classroom[]>>((acc, r) => {
    (acc[r.grade] ||= []).push(r);
    return acc;
  }, {});

  // split kindergarten vs primary
  const kinder = GRADE_ORDER.filter((g) => g.startsWith("อ.") && byGrade[g]);
  const primary = GRADE_ORDER.filter((g) => g.startsWith("ป.") && byGrade[g]);

  return (
    <>
      <PageHeader
        eyebrow="Students"
        title="ข้อมูลนักเรียน"
        description="ภาพรวมจำนวนนักเรียนทั้งโรงเรียน แยกตามระดับชั้นและห้องเรียน"
      />

      {/* Top stats */}
      <section className="container-x py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <StatCard value={totals.total} label="นักเรียนทั้งหมด" />
          <div className="card text-center">
            <div className="font-display text-4xl md:text-5xl bg-gradient-to-r from-blue-300 to-blue-500 bg-clip-text text-transparent">
              {totals.m.toLocaleString()}
            </div>
            <div className="mt-2 text-cream-100/70 text-sm tracking-wider uppercase">
              นักเรียนชาย
            </div>
            <div className="text-xs text-cream-100/40 mt-1">
              {totals.total ? Math.round((totals.m / totals.total) * 100) : 0}% ของนักเรียนทั้งหมด
            </div>
          </div>
          <div className="card text-center">
            <div className="font-display text-4xl md:text-5xl bg-gradient-to-r from-pink-300 to-pink-500 bg-clip-text text-transparent">
              {totals.f.toLocaleString()}
            </div>
            <div className="mt-2 text-cream-100/70 text-sm tracking-wider uppercase">
              นักเรียนหญิง
            </div>
            <div className="text-xs text-cream-100/40 mt-1">
              {totals.total ? Math.round((totals.f / totals.total) * 100) : 0}% ของนักเรียนทั้งหมด
            </div>
          </div>
        </div>
      </section>

      {/* By level */}
      {kinder.length > 0 && (
        <SectionByLevel title="ระดับอนุบาล" grades={kinder} byGrade={byGrade} />
      )}
      {primary.length > 0 && (
        <SectionByLevel title="ระดับประถมศึกษา" grades={primary} byGrade={byGrade} />
      )}

      {/* Detailed table */}
      <section className="container-x py-20">
        <Reveal>
          <h2 className="font-display text-2xl md:text-3xl mb-6">
            <span className="gold-text">รายละเอียดทุกห้องเรียน</span>
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="card p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-cream-100/60 text-left bg-white/[0.02]">
                    <th className="px-5 py-3 font-medium">ห้อง</th>
                    <th className="px-5 py-3 font-medium">ครูประจำชั้น</th>
                    <th className="px-5 py-3 font-medium text-right">ชาย</th>
                    <th className="px-5 py-3 font-medium text-right">หญิง</th>
                    <th className="px-5 py-3 font-medium text-right">รวม</th>
                  </tr>
                </thead>
                <tbody>
                  {rooms.map((r) => (
                    <tr key={r.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-5 py-3 font-medium text-gold-200">{r.grade}/{r.room}</td>
                      <td className="px-5 py-3 text-cream-100/70">{r.teacher_name ?? "—"}</td>
                      <td className="px-5 py-3 text-right text-blue-300 font-medium">{r.male_count}</td>
                      <td className="px-5 py-3 text-right text-pink-300 font-medium">{r.female_count}</td>
                      <td className="px-5 py-3 text-right font-semibold">
                        {r.male_count + r.female_count}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gold-400/[0.04]">
                    <td className="px-5 py-3 font-semibold text-gold-200" colSpan={2}>
                      รวมทั้งหมด {rooms.length} ห้อง
                    </td>
                    <td className="px-5 py-3 text-right text-blue-300 font-semibold">{totals.m}</td>
                    <td className="px-5 py-3 text-right text-pink-300 font-semibold">{totals.f}</td>
                    <td className="px-5 py-3 text-right font-bold gold-text">{totals.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}

function SectionByLevel({
  title,
  grades,
  byGrade,
}: {
  title: string;
  grades: string[];
  byGrade: Record<string, Classroom[]>;
}) {
  return (
    <section className="container-x py-12">
      <Reveal>
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-ink-950 flex items-center justify-center shadow-glow">
            <GraduationCap size={20} />
          </div>
          <h2 className="font-display text-2xl md:text-3xl">
            <span className="gold-text">{title}</span>
          </h2>
        </div>
      </Reveal>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {grades.map((g, i) => {
          const list = byGrade[g];
          const t = sumOf(list);
          return (
            <Reveal key={g} delay={i * 0.06}>
              <div className="card h-full">
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-display font-bold gold-text">{g}</div>
                  <div className="chip">{list.length} ห้อง</div>
                </div>
                <div className="mt-5 flex items-center gap-2 text-cream-100/70 text-sm">
                  <Users size={14} /> รวมทั้งระดับชั้น
                </div>
                <div className="mt-1 text-3xl font-display gold-text">{t.total}</div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-blue-400/10 border border-blue-300/20 p-3">
                    <div className="text-blue-300 text-[10px] tracking-wider uppercase">
                      ชาย
                    </div>
                    <div className="text-blue-200 text-lg font-semibold">{t.m}</div>
                  </div>
                  <div className="rounded-xl bg-pink-400/10 border border-pink-300/20 p-3">
                    <div className="text-pink-300 text-[10px] tracking-wider uppercase">
                      หญิง
                    </div>
                    <div className="text-pink-200 text-lg font-semibold">{t.f}</div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10 space-y-1.5">
                  {list.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between text-xs text-cream-100/70"
                    >
                      <span className="text-gold-200/90">
                        {r.grade}/{r.room}
                      </span>
                      <span>
                        <span className="text-blue-300">ช {r.male_count}</span>
                        {" / "}
                        <span className="text-pink-300">ญ {r.female_count}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
