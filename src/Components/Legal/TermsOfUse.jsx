import React from 'react';
import s from './legal.module.scss';

const TermsOfUse = () => {
  return (
    <main className={s.legalPage}>
      <div className="container">
        <div className={s.hero}>
          <h1>Điều khoản sử dụng</h1>
          <p className={s.lead}>
            Bằng việc truy cập hoặc sử dụng website, bạn đồng ý tuân thủ các điều khoản dưới đây.
            Vui lòng đọc kỹ trước khi sử dụng dịch vụ.
          </p>
          <div className={s.meta}><span>Có hiệu lực: 08/2025</span></div>
        </div>

        <div className={s.grid}>
          <aside className={s.tocCard}>
            <div className={s.tocTitle}>Mục lục</div>
            <nav className={s.tocList}>
              <a href="#account">1. Tài khoản</a>
              <a href="#prohibited">2. Hành vi bị cấm</a>
              <a href="#content">3. Nội dung & sở hữu</a>
              <a href="#liability">4. Giới hạn trách nhiệm</a>
              <a href="#changes">5. Thay đổi điều khoản</a>
            </nav>
          </aside>

          <div className={s.content}>
        <section id="account">
          <h2>1. Tài khoản</h2>
          <ul>
            <li>Người dùng chịu trách nhiệm bảo mật thông tin đăng nhập.</li>
            <li>Nghiêm cấm mạo danh, lạm dụng hoặc sử dụng tài khoản trái phép.</li>
          </ul>
        </section>

        <section id="prohibited">
          <h2>2. Hành vi bị cấm</h2>
          <ul>
            <li>Đăng tải nội dung vi phạm pháp luật, bản quyền, thuần phong mỹ tục.</li>
            <li>Can thiệp trái phép vào hệ thống, phát tán mã độc, spam.</li>
          </ul>
        </section>

        <section id="content">
          <h2>3. Nội dung và quyền sở hữu</h2>
          <p>
            Nội dung hiển thị thuộc quyền sở hữu của chúng tôi hoặc đối tác. Bạn chỉ được sử dụng cho
            mục đích cá nhân, không thương mại nếu chưa có sự đồng ý bằng văn bản.
          </p>
        </section>

        <section id="liability">
          <h2>4. Giới hạn trách nhiệm</h2>
          <p>
            Chúng tôi nỗ lực đảm bảo dịch vụ ổn định nhưng không cam kết không gián đoạn. Mọi thiệt hại
            gián tiếp phát sinh từ việc sử dụng nằm ngoài phạm vi trách nhiệm của chúng tôi.
          </p>
        </section>

        <section id="changes">
          <h2>5. Thay đổi điều khoản</h2>
          <p>
            Chúng tôi có thể cập nhật điều khoản, việc tiếp tục sử dụng đồng nghĩa bạn chấp nhận thay đổi.
          </p>
        </section>
          </div>
        </div>

        <div className={s.cta}>
          Bằng việc tiếp tục sử dụng dịch vụ, bạn xác nhận đã đọc và đồng ý với điều khoản trên.
          Nếu còn thắc mắc, vui lòng <a href="/contact">liên hệ</a>.
        </div>
      </div>
    </main>
  );
};

export default TermsOfUse;


