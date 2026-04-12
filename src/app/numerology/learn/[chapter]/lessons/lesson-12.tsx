import Link from 'next/link'

export function Lesson12() {
  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed">
        Bạn đã học tất cả các con số trong hệ thống thần số học Pythagorean. Bài cuối cùng này
        sẽ hướng dẫn cách <strong>tổng hợp</strong> tất cả thành một bức tranh hoàn chỉnh —
        giống như một nhà tư vấn thần số học thực thụ.
      </p>

      <div>
        <h4 className="font-semibold text-sm mb-3">Thứ tự đọc hồ sơ</h4>
        <div className="space-y-2">
          {[
            { num: 1, name: 'Số ��ường Đời', question: 'Bạn là ai? Con đường cuộc đời là gì?', priority: 'Quan trọng nhất' },
            { num: 2, name: 'Số Biểu Đạt', question: 'Bạn thể hiện ra sao? Tài năng tự nhiên?', priority: 'Rất quan trọng' },
            { num: 3, name: 'Số Linh Hồn', question: 'Bạn thực sự khao khát điều gì?', priority: 'Rất quan trọng' },
            { num: 4, name: 'Số Nhân Cách', question: 'Người khác nhìn bạn nh�� thế nào?', priority: 'Quan trọng' },
            { num: 5, name: 'Số Ngày Sinh', question: 'Tài năng bẩm sinh cụ thể?', priority: 'Bổ trợ' },
            { num: 6, name: 'Số Trưởng Thành', question: 'Nửa sau cuộc đời hướng đến đâu?', priority: 'Bổ trợ' },
            { num: 7, name: 'Chu Kỳ Cá Nhân', question: 'Đang ở đâu trong chu kỳ hiện tại?', priority: 'Thời điểm' },
            { num: 8, name: 'Thử Thách & Đỉnh Cao', question: 'Giai đoạn đời đang trải qua?', priority: 'Thời điểm' },
          ].map((item) => (
            <div key={item.num} className="rounded-lg border p-3 flex items-start gap-3">
              <span className="shrink-0 flex size-7 items-center justify-center rounded-full bg-muted text-xs font-mono font-medium text-muted-foreground">
                {item.num}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h5 className="font-semibold text-xs">{item.name}</h5>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                    {item.priority}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.question}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">Cách tổng hợp</h4>
        <div className="space-y-3">
          <div className="rounded-lg border p-4">
            <h5 className="font-semibold text-sm mb-1">1. Xác định bản chất cốt lõi</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Bắt đầu với <strong>Số Đường Đ��i</strong> — đây là nền tảng.
              Sau đó xem Số Biểu Đạt có hài hòa hay xung đột không.
              Ví dụ: Đường Đời 7 (nội tâm) + Biểu Đạt 3 (giao tiếp) = người sâu sắc nhưng biết cách chia sẻ.
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h5 className="font-semibold text-sm mb-1">2. Tìm mâu thuẫn nội tâm</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">
              So sánh <strong>Linh Hồn</strong> (muốn gì) v��i <strong>Nhân Cách</strong> (thể hiện ra sao).
              Nếu khác nhau nhiều, người này có thể cảm thấy &ldquo;không phải mình&rdquo; trong mắt người khác.
              V�� dụ: Linh Hồn 9 (muốn giúp đời) + Nhân Cách 8 (vẻ ngoài quyền lực) = lòng từ bi ẩn sau vẻ mạnh mẽ.
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h5 className="font-semibold text-sm mb-1">3. Xem hướng phát triển</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Số Trưởng Thành</strong> cho biết đích đến dài hạn.
              <strong> Thử Thách</strong> hiện tại cho biết cần vượt qua gì.
              <strong> Đỉnh Cao</strong> hiện t��i cho biết cơ hội đang mở ra.
            </p>
          </div>

          <div className="rounded-lg border p-4">
            <h5 className="font-semibold text-sm mb-1">4. Đặt trong bối cảnh thời gian</h5>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Cuối cùng, xem <strong>Năm Cá Nhân</strong> hiện tại để hiểu năng lượng ngắn hạn.
              Năm 1? Bắt đầu mới. Năm 9? Kết thúc và buông bỏ.
              Lời khuyên phải phù hợp với chu kỳ.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">Ví dụ: Hồ sơ mẫu</h4>
        <div className="rounded-lg bg-muted/50 p-4 space-y-3">
          <div className="text-xs font-medium">Nguyễn Văn Anh — sinh 15/3/1990</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { label: 'Đư��ng Đời', value: 1 },
              { label: 'Biểu Đạt', value: 6 },
              { label: 'Linh Hồn', value: 7 },
              { label: 'Nhân Cách', value: 8 },
              { label: 'Ngày Sinh', value: 6 },
              { label: 'Trưởng Thành', value: 7 },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                  {value}
                </span>
                <span className="text-[10px] text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
          <div className="text-xs text-muted-foreground leading-relaxed pt-2 border-t">
            <p>
              <strong>Tổng hợp:</strong> Đường Đời 1 (lãnh đạo, độc lập) kết h��p Biểu Đạt 6 (chăm sóc, trách nhiệm)
              — người dẫn dắt bằng sự quan tâm. Linh Hồn 7 khao khát hiểu biết sâu sắc, nhưng Nhân Cách 8
              tạo vẻ ngoài quy���n lực. Ngày Sinh 6 củng cố năng lượng chăm sóc.
              Số Trưởng Thành 7 cho thấy nửa sau cuộc đời sẽ hướng về tâm linh và tri thức.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 text-center">
        <h4 className="font-semibold text-sm mb-2">Bạn đã hoàn thành khóa học!</h4>
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">
          Giờ hãy thử tính hồ sơ thần số học đầy đủ cho chính bạn hoặc người thân.
        </p>
        <Link
          href="/numerology"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Tính thần số →
        </Link>
      </div>
    </div>
  )
}
