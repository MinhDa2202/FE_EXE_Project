import React from 'react';
import s from './legal.module.scss';

const PrivacyPolicy = () => {
  return (
    <main className={s.legalPage}>
      <div className="container">
        <div className={s.hero}>
          <h1>Chính sách bảo mật</h1>
          <p className={s.lead}>
            Chúng tôi cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn. Tài liệu này
            giải thích cách chúng tôi thu thập, sử dụng và bảo vệ thông tin khi bạn sử dụng dịch vụ.
          </p>
          <div className={s.meta}>
            <span>Phiên bản 1.0</span>
            <span className={s.updatedAt}>Cập nhật: 08/2025</span>
          </div>
        </div>

        <div className={s.grid}>
          <aside className={s.tocCard}>
            <div className={s.tocTitle}>Mục lục</div>
            <nav className={s.tocList}>
              <a href="#collect">1. Thông tin thu thập</a>
              <a href="#use">2. Mục đích sử dụng</a>
              <a href="#share">3. Chia sẻ dữ liệu</a>
              <a href="#rights">4. Quyền của bạn</a>
              <a href="#security">5. Bảo mật</a>
              <a href="#cookie">6. Cookie & theo dõi</a>
              <a href="#update">7. Cập nhật</a>
            </nav>
          </aside>

          <div className={s.content}>
        <section id="collect">
          <h2>1. Thông tin chúng tôi thu thập</h2>
          <ul>
            <li>Thông tin tài khoản: họ tên, email, số điện thoại.</li>
            <li>Thông tin giao dịch: đơn hàng, thanh toán, địa chỉ giao nhận.</li>
            <li>Dữ liệu sử dụng: lịch sử duyệt, tương tác, đánh giá sản phẩm.</li>
          </ul>
        </section>

        <section id="use">
          <h2>2. Mục đích sử dụng</h2>
          <ul>
            <li>Cung cấp và vận hành dịch vụ mua bán, chăm sóc khách hàng.</li>
            <li>Cá nhân hoá trải nghiệm và gợi ý sản phẩm phù hợp.</li>
            <li>Ngăn chặn gian lận, đảm bảo an toàn hệ thống.</li>
          </ul>
        </section>

        <section id="share">
          <h2>3. Chia sẻ dữ liệu</h2>
          <p>
            Chúng tôi chỉ chia sẻ dữ liệu với đối tác vận chuyển, thanh toán và nhà cung cấp dịch vụ
            theo hợp đồng, tuân thủ pháp luật, và tối thiểu hoá dữ liệu cần thiết.
          </p>
        </section>

        <section id="rights">
          <h2>4. Quyền của bạn</h2>
          <ul>
            <li>Truy cập, cập nhật, xoá dữ liệu cá nhân.</li>
            <li>Từ chối nhận thông báo tiếp thị bất kỳ lúc nào.</li>
            <li>Gửi yêu cầu qua trang Liên hệ hoặc email hỗ trợ.</li>
          </ul>
        </section>

        <section id="security">
          <h2>5. Bảo mật</h2>
          <p>
            Dữ liệu được bảo vệ bằng mã hoá, kiểm soát truy cập và sao lưu định kỳ. Bạn vui lòng
            không chia sẻ thông tin đăng nhập cho người khác.
          </p>
        </section>

        <section id="cookie">
          <h2>6. Cookie và công nghệ theo dõi</h2>
          <p>
            Chúng tôi dùng cookie để ghi nhớ phiên đăng nhập, tuỳ chọn ngôn ngữ và đo lường hiệu suất.
            Bạn có thể tắt cookie trong trình duyệt; một số tính năng có thể không hoạt động tối ưu.
          </p>
        </section>

        <section id="update">
          <h2>7. Cập nhật</h2>
          <p>
            Chính sách có thể thay đổi để phù hợp quy định mới. Thời điểm cập nhật gần nhất sẽ được
            hiển thị ở cuối trang này.
          </p>
          <p className={s.updatedAt}>Cập nhật lần cuối: 08/2025</p>
        </section>
          </div>
        </div>

        <div className={s.cta}>
          Có câu hỏi về quyền riêng tư? Hãy đọc thêm tại mục <a href="/faq">FAQ</a> hoặc
          <a href="/contact"> liên hệ hỗ trợ</a>.
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;


