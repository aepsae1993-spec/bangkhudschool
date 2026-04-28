import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x py-32 text-center">
      <div className="font-display text-7xl gold-text">404</div>
      <p className="mt-4 text-cream-100/70">ไม่พบหน้าที่คุณต้องการ</p>
      <Link href="/" className="btn-primary mt-8">
        กลับหน้าแรก
      </Link>
    </section>
  );
}
