import GalleryGrid from "@/components/GalleryGrid";
import PageHeader from "@/components/PageHeader";
import { getGallery } from "@/lib/data";

export const revalidate = 120;

export const metadata = { title: "ภาพกิจกรรม" };

export default async function GalleryPage() {
  const items = await getGallery(48);
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="ภาพกิจกรรม"
        description="บันทึกความทรงจำและช่วงเวลาที่งดงามจากกิจกรรมต่าง ๆ ของโรงเรียน"
      />
      <section className="container-x py-16">
        <GalleryGrid items={items} />
      </section>
    </>
  );
}
