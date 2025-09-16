import React from 'react';
import s from './help.module.scss';

const Support = () => {
  return (
    <main className={s.page}>
      <div className="container">
        <div className={s.hero}>
          <h1>Hỗ trợ khách hàng</h1>
          <p className={s.lead}>Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7 qua nhiều kênh.</p>
        </div>

        <div className={s.contentSingle}>
          <section className={s.card}>
            <h3>Gửi yêu cầu</h3>
            <p className={s.lead}>Điền thông tin chi tiết để chúng tôi hỗ trợ nhanh nhất.</p>
            <form className={s.form} onSubmit={(e) => e.preventDefault()}>
              <input className={s.input} placeholder="Họ và tên" required />
              <input className={s.input} placeholder="Email" type="email" required />
              <select className={s.select} defaultValue="Vấn đề đơn hàng">
                <option>Vấn đề đơn hàng</option>
                <option>Thanh toán</option>
                <option>Tài khoản</option>
                <option>Bảo mật</option>
                <option>Khác</option>
              </select>
              <input className={s.input} placeholder="Mã đơn (nếu có)" />
              <textarea className={s.textarea} placeholder="Mô tả chi tiết vấn đề..." />
              <div>
                <button className={s.btn}>Gửi yêu cầu</button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Support;


