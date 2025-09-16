import React from 'react';
import s from './legal.module.scss';

const ReturnPolicy = () => {
  return (
    <main className={s.legalPage}>
      <div className="container">
        <div className={s.hero}>
          <h1>Chính sách trả hàng</h1>
          <p className={s.lead}>
            Chúng tôi hướng tới trải nghiệm mua sắm an tâm. Nếu sản phẩm không như mô tả hoặc lỗi nghiêm trọng,
            bạn có thể yêu cầu đổi/trả theo quy định dưới đây.
          </p>
          <div className={s.meta}><span>Áp dụng cho giao dịch nội địa</span></div>
        </div>

        <div className={s.grid}>
          <aside className={s.tocCard}>
            <div className={s.tocTitle}>Mục lục</div>
            <nav className={s.tocList}>
              <a href="#time">1. Thời hạn</a>
              <a href="#condition">2. Điều kiện</a>
              <a href="#process">3. Quy trình</a>
              <a href="#note">4. Lưu ý</a>
            </nav>
          </aside>

          <div className={s.content}>
        <section id="time">
          <h2>1. Thời hạn</h2>
          <p>Trong vòng 3 ngày kể từ khi nhận hàng đối với giao dịch nội địa.</p>
        </section>

        <section id="condition">
          <h2>2. Điều kiện</h2>
          <ul>
            <li>Còn đầy đủ phụ kiện, hoá đơn, tem/nhãn (nếu có).</li>
            <li>Không thuộc danh mục không hỗ trợ đổi trả (hàng tiêu hao, phần mềm,…).</li>
            <li>Video mở hộp để đối chiếu khi cần.</li>
          </ul>
        </section>

        <section id="process">
          <h2>3. Quy trình</h2>
          <ol>
            <li>Gửi yêu cầu tại mục Hỗ trợ hoặc Chat trực tuyến kèm chứng từ.</li>
            <li>Chúng tôi xác minh và phối hợp người bán để xử lý trong 3 ngày làm việc.</li>
            <li>Hoàn tiền qua phương thức thanh toán ban đầu hoặc đổi sản phẩm khác.</li>
          </ol>
        </section>

        <section id="note">
          <h2>4. Lưu ý</h2>
          <div className={s.note}>
            Hãy đóng gói cẩn thận khi gửi trả. Hư hỏng do vận chuyển không đúng cách có thể ảnh hưởng
            đến kết quả xử lý yêu cầu.
          </div>
        </section>
          </div>
        </div>

        <div className={s.cta}>
          Để tạo yêu cầu đổi/trả, vui lòng vào <a href="/support">Hỗ trợ khách hàng</a> hoặc
          <a href="/chat"> Chat trực tuyến</a> để được hướng dẫn chi tiết.
        </div>
      </div>
    </main>
  );
};

export default ReturnPolicy;


