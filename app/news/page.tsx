import NewsCard from "@/components/NewsCard";
import PageHeader from "@/components/PageHeader";
import { getNews } from "@/lib/data";

export const revalidate = 60;

export const metadata = {
  title: "ข่าวสารและกิจกรรม",
};

export default async function NewsListPage() {
  const news = await getNews(60);
  return (
    <>
      <PageHeader
        eyebrow="News"
        title="ข่าวสารและกิจกรรม"
        description="อัปเดตเรื่องราว ข่าวประชาสัมพันธ์ และกิจกรรมล่าสุด"
      />
      <section className="container-x py-16">
        {news.length === 0 ? (
          <div className="card text-center text-cream-100/70 py-20">
            ยังไม่มีข่าวสารในขณะนี้
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
