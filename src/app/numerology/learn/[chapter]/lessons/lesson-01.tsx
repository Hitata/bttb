export function Lesson01() {
  return (
    <div className="space-y-8">
      <p className="text-sm leading-relaxed">
        Thần số học (Numerology) là một hệ thống cổ đại tin rằng các con số mang năng lượng rung động riêng,
        và từ ngày sinh cùng tên gọi của bạn, ta có thể giải mã bản chất, tài năng, thử thách và hướng đi cuộc đời.
      </p>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Nguồn gốc: Pythagorean</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Hệ thống Pythagorean (phương Tây) được đặt theo tên nhà toán học Hy Lạp Pythagoras (570–495 TCN),
          người tin rằng &ldquo;vạn vật đều là số&rdquo;. Ông phát hiện mối quan hệ giữa số và âm thanh,
          từ đó phát triển hệ thống gán giá trị số cho chữ cái (A=1, B=2... I=9, J=1...).
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed mt-2">
          Ngày nay, thần số học Pythagorean là hệ thống phổ biến nhất trên thế giới,
          sử dụng ngày sinh và tên khai sinh để tính các con số cốt lõi.
        </p>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">Ý tưởng cốt lõi</h4>
        <div className="space-y-3">
          <div className="rounded-lg border p-3">
            <h5 className="font-medium text-sm">Mỗi số mang một năng lượng</h5>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Từ 1 đến 9, mỗi con số đại diện cho một nguyên mẫu (archetype) — một bộ tính cách,
              điểm mạnh, và thử thách riêng. Số 11, 22, 33 là &ldquo;số bậc thầy&rdquo; với năng lượng khuếch đại.
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <h5 className="font-medium text-sm">Rút gọn về bản chất</h5>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Phép tính cơ bản của thần số học là rút gọn (reduce) — cộng các chữ số lại cho đến khi
              còn một chữ số duy nhất. Ví dụ: 1990 → 1+9+9+0 = 19 → 1+9 = 10 → 1+0 = 1.
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <h5 className="font-medium text-sm">Hai nguồn dữ liệu</h5>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              <strong>Ngày sinh</strong> — cho biết bạn là ai về mặt bản chất (không thay đổi).
              <br />
              <strong>Tên khai sinh</strong> — cho biết bạn thể hiện ra sao và khao khát điều gì.
            </p>
          </div>
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-3">So sánh với các hệ thống khác</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-3 font-medium">Hệ thống</th>
                <th className="text-left py-2 pr-3 font-medium">Đầu vào</th>
                <th className="text-left py-2 pr-3 font-medium">Đầu ra</th>
                <th className="text-left py-2 font-medium">Độ phức tạp</th>
              </tr>
            </thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-dashed">
                <td className="py-2 pr-3 font-medium text-foreground">Thần Số Học</td>
                <td className="py-2 pr-3">Ngày sinh + Tên</td>
                <td className="py-2 pr-3">~10 con số cốt lõi</td>
                <td className="py-2">Thấp — dễ học</td>
              </tr>
              <tr className="border-b border-dashed">
                <td className="py-2 pr-3">Kinh Dịch</td>
                <td className="py-2 pr-3">Câu hỏi + gieo quẻ</td>
                <td className="py-2 pr-3">64 quẻ × 6 hào</td>
                <td className="py-2">Trung bình</td>
              </tr>
              <tr className="border-b border-dashed">
                <td className="py-2 pr-3">Tử Vi Đẩu Số</td>
                <td className="py-2 pr-3">Ngày giờ sinh (âm lịch)</td>
                <td className="py-2 pr-3">12 cung + 100+ sao</td>
                <td className="py-2">Cao</td>
              </tr>
              <tr>
                <td className="py-2 pr-3">Human Design</td>
                <td className="py-2 pr-3">Ngày giờ sinh + nơi sinh</td>
                <td className="py-2 pr-3">Bodygraph phức tạp</td>
                <td className="py-2">Rất cao</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
          Thần số học là điểm khởi đầu đơn giản nhất — chỉ cần ngày sinh là đủ để bắt đầu,
          thêm tên để có bức tranh đầy đủ hơn. Không cần giờ sinh hay nơi sinh.
        </p>
      </div>

      <div className="rounded-lg bg-muted/50 p-4">
        <h4 className="font-semibold text-sm mb-2">Khóa học này sẽ dạy gì?</h4>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Qua 12 bài học, bạn sẽ học cách tính và hiểu tất cả các con số trong hệ thống thần số học Pythagorean:
          Số Đường Đời, Số Ngày Sinh, Số Biểu Đạt, Linh Hồn, Nhân Cách, Trưởng Thành,
          Chu Kỳ Cá Nhân, Thử Thách, và Đỉnh Cao. Cuối khóa, bạn sẽ có thể đọc một hồ sơ số học hoàn chỉnh.
        </p>
      </div>
    </div>
  )
}
