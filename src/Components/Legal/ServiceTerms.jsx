import React from 'react';
import s from './legal.module.scss';

const ServiceTerms = () => {
  return (
    <main className={s.legalPage}>
      <div className="container">
        <div className={s.hero}>
          <h1>Điều khoản dịch vụ</h1>
          <p className={s.lead}>
            Các điều khoản này điều chỉnh mối quan hệ giữa người mua, người bán và nền tảng.
          </p>
        </div>

        <div className={s.grid}>
          <aside className={s.tocCard}>
            <div className={s.tocTitle}>Mục lục</div>
            <nav className={s.tocList}>
              <a href="#scope">1. Phạm vi dịch vụ</a>
              <a href="#fees">2. Phí và thanh toán</a>
              <a href="#support">3. Hỗ trợ và khiếu nại</a>
              <a href="#suspension">4. Tạm ngưng dịch vụ</a>
            </nav>
          </aside>

          <div className={s.content}>
        <section id="scope">
          <h2>1. Phạm vi dịch vụ</h2>
          <p>
            Chúng tôi cung cấp nền tảng trung gian kết nối người mua và người bán hàng cũ.
            Giao dịch, vận chuyển và bảo hành do các bên liên quan trực tiếp thoả thuận.
          </p>
        </section>

        <section id="fees">
          <h2>2. Phí và thanh toán</h2>
          <p>
            Một số dịch vụ có thể thu phí theo bảng giá công khai. Mọi khoản thanh toán được xử lý
            qua đối tác cổng thanh toán an toàn.
          </p>
        </section>

        <section id="support">
          <h2>3. Hỗ trợ và khiếu nại</h2>
          <p>
            Người dùng có thể liên hệ kênh hỗ trợ để được giải quyết tranh chấp. Chúng tôi sẽ phối hợp
            để bảo vệ quyền lợi chính đáng của các bên.
          </p>
        </section>

        <section id="suspension">
          <h2>4. Tạm ngưng dịch vụ</h2>
          <p>
            Chúng tôi có quyền tạm ngưng hoặc chấm dứt truy cập khi phát hiện vi phạm điều khoản,
            hành vi gian lận hoặc yêu cầu từ cơ quan có thẩm quyền.
          </p>
        </section>
          </div>
        </div>

        <div className={s.cta}>
          Cần hỗ trợ về phí dịch vụ hoặc khiếu nại? Hãy xem <a href="/faq">FAQ</a> hoặc
          <a href="/contact"> liên hệ</a> để được giải đáp nhanh chóng.
        </div>
      </div>
    </main>
  );
};

export default ServiceTerms;


