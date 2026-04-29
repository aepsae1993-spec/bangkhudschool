import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { getNewsBySlug } from "@/lib/data";

export const revalidate = 60;

const fmt = (d: string) =>
  new Date(d).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const item = await getNewsBySlug(params.slug);
  return { title: item?.title ?? "ข่าวสาร" };
}

export default async function NewsDetail({
  params,
}: {
  params: { slug: string };
}) {
  const item = await getNewsBySlug(params.slug);
  if (!item) notFound();

  return (
    <>
      <PageHeader
        eyebrow={item.category ?? "News"}
        title={item.title}
        description={fmt(item.published_at)}
      />
      <article className="container-x py-16 max-w-3xl">
        {item.cover_url && (
          <div className="mb-10 rounded-3xl overflow-hidden bg-ink-900/60 border border-white/5 ring-1 ring-gold-300/10 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.cover_url}
              alt={item.title}
              className="w-full max-h-[75vh] object-contain"
            />
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-cream-100/60 mb-8">
          <CalendarDays size={16} />
          <time>{fmt(item.published_at)}</time>
        </div>

        <div className="prose prose-invert max-w-none text-cream-100/85 leading-loose whitespace-pre-line">
          {item.content || item.excerpt || "—"}
        </div>

        <div className="mt-14">
          <Link href="/news" className="btn-ghost">
            <ArrowLeft size={16} /> กลับสู่ข่าวทั้งหมด
          </Link>
        </div>
      </article>
    </>
  );
}
