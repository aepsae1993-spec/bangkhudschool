import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import PageHeader from "@/components/PageHeader";
import { getNews } from "@/lib/data";
import { NEWS_CATEGORIES } from "@/lib/categories";

export const revalidate = 60;

export const metadata = {
  title: "ข่าวสารและกิจกรรม",
};

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const all = await getNews(120);
  const selected = searchParams.cat ?? "";
  const news = selected ? all.filter((n) => n.category === selected) : all;

  // นับจำนวนข่าวในแต่ละหมวด
  const counts: Record<string, number> = {};
  for (const n of all) {
    if (n.category) counts[n.category] = (counts[n.category] || 0) + 1;
  }

  return (
    <>
      <PageHeader
        eyebrow="News"
        title="ข่าวสารและกิจกรรม"
        description="อัปเดตเรื่องราว ข่าวประชาสัมพันธ์ และกิจกรรมล่าสุด"
      />

      <section className="container-x py-12">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-10 justify-center">
          <Link
            href="/news"
            scroll={false}
            className={`px-4 py-2 rounded-full text-sm transition-all border ${
              !selected
                ? "bg-gold-400/15 text-gold-200 border-gold-300/40 shadow-glow"
                : "bg-white/[0.03] text-cream-100/70 border-white/10 hover:bg-white/[0.07]"
            }`}
          >
            ทั้งหมด
            <span className="ml-2 text-xs opacity-60">({all.length})</span>
          </Link>
          {NEWS_CATEGORIES.map((c) => {
            const active = selected === c;
            const count = counts[c] || 0;
            return (
              <Link
                key={c}
                href={`/news?cat=${encodeURIComponent(c)}`}
                scroll={false}
                className={`px-4 py-2 rounded-full text-sm transition-all border ${
                  active
                    ? "bg-gold-400/15 text-gold-200 border-gold-300/40 shadow-glow"
                    : "bg-white/[0.03] text-cream-100/70 border-white/10 hover:bg-white/[0.07]"
                }`}
              >
                {c}
                <span className="ml-2 text-xs opacity-60">({count})</span>
              </Link>
            );
          })}
        </div>

        {news.length === 0 ? (
          <div className="card text-center text-cream-100/70 py-20">
            {selected
              ? `ยังไม่มีข่าวในหมวด "${selected}"`
              : "ยังไม่มีข่าวสารในขณะนี้"}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((n, i) => (
              <NewsCard key={n.id} item={n} index={i} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
