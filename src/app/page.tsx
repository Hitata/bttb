import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16">
      <div className="text-center mb-12">
        {session?.user ? (
          <>
            <h2 className="text-3xl font-bold">Xin chào, {session.user.name}!</h2>
            <p className="mt-2 text-muted-foreground">Chọn công cụ bên dưới để bắt đầu.</p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold">BBTB — Bát Tự Tứ Trụ</h2>
            <p className="mt-2 text-muted-foreground">Công cụ lập lá số Bát Tự trực tuyến.</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Link
          href="/bazi"
          className="rounded-lg border p-6 hover:bg-muted/50 transition-colors text-center"
        >
          <div className="text-3xl mb-3">&#9782;</div>
          <h3 className="text-lg font-semibold">Lập Lá Số</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Nhập ngày sinh để tính toán Tứ Trụ, Đại Vận, Thần Sát
          </p>
        </Link>

        <Link
          href="/bazi/cases"
          className="rounded-lg border p-6 hover:bg-muted/50 transition-colors text-center"
        >
          <div className="text-3xl mb-3">&#9733;</div>
          <h3 className="text-lg font-semibold">Celebrity Cases</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Phân tích Bát Tự của các nhân vật nổi tiếng
          </p>
        </Link>

      </div>
    </div>
  );
}
