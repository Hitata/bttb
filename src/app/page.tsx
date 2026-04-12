import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <>
      {/* Hero Section */}
      <section className="section-light">
        <div className="mx-auto max-w-[1200px] px-4 py-20 text-center md:py-28">
          {session?.user ? (
            <>
              <h1 className="text-4xl font-semibold leading-[1.10] md:text-[52px]">
                Xin chào, {session.user.name}!
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-foreground-secondary">
                Chọn công cụ bên dưới để bắt đầu.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-semibold leading-[1.10] md:text-[52px]">
                Bát Tự Tử Bình
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-foreground-secondary">
                Công cụ phân tích Bát Tự, Tử Vi, Kinh Dịch và Human Design
              </p>
              <Link
                href="/signin"
                className="mt-8 inline-flex h-10 items-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_0_0_1px_var(--primary)] transition-colors hover:bg-primary/90"
              >
                Bắt Đầu
              </Link>
            </>
          )}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="section-light">
        <div className="mx-auto max-w-[1200px] px-4 pb-20 md:pb-28">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/bazi", icon: "☰", title: "Bát Tự", desc: "Nhập ngày sinh để tính toán Tứ Trụ, Đại Vận, Thần Sát" },
              { href: "/iching", icon: "☯", title: "Kinh Dịch", desc: "Gieo quẻ và giải nghĩa Kinh Dịch" },
              { href: "/tu-vi", icon: "⭐", title: "Tử Vi", desc: "Tử Vi Đẩu Số — lá số và học lý thuyết" },
              { href: "/human-design", icon: "◎", title: "Human Design", desc: "Thiết Kế Con Người — bodygraph và khóa học" },
              { href: "/numerology", icon: "✦", title: "Thần Số Học", desc: "Phân tích số học Pythagorean" },
              { href: "/bazi/cases", icon: "★", title: "Celebrity Cases", desc: "Phân tích Bát Tự của các nhân vật nổi tiếng" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-lg border border-border bg-card p-8 text-center transition-shadow hover:shadow-[rgba(0,0,0,0.05)_0px_4px_24px]"
              >
                <div className="mb-4 text-3xl">{item.icon}</div>
                <h3 className="text-xl font-semibold leading-[1.20]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground-secondary">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
