import React, { useState } from 'react';
import s from './help.module.scss';

const FAQ = () => {
  const [active, setActive] = useState(-1);
  const [category, setCategory] = useState('Tài khoản');
  const faqs = [
    {
      q: 'Tài khoản và đăng nhập',
      a: 'Bạn có thể đăng ký nhanh bằng email hoặc số điện thoại. Hãy bảo mật mật khẩu và bật xác thực 2 bước nếu có.',
      category: 'Tài khoản',
    },
    {
      q: 'Quên mật khẩu thì làm thế nào?',
      a: 'Sử dụng chức năng Quên mật khẩu để nhận liên kết đặt lại qua email. Nếu không nhận được, hãy kiểm tra thư mục Spam.',
      category: 'Tài khoản',
    },
    {
      q: 'Làm sao đổi email hoặc số điện thoại?',
      a: 'Vào Trang cá nhân > Cài đặt > Thông tin tài khoản để cập nhật. Hệ thống có thể yêu cầu xác minh qua mã OTP.',
      category: 'Tài khoản',
    },
    {
      q: 'Bảo vệ tài khoản như thế nào?',
      a: 'Dùng mật khẩu mạnh, không chia sẻ OTP, chỉ đăng nhập trên thiết bị tin cậy và thoát sau khi sử dụng máy công cộng.',
      category: 'Tài khoản',
    },
    {
      q: 'Mua hàng an toàn',
      a: 'Luôn kiểm tra mô tả, đánh giá người bán và sử dụng kênh chat chính thức để trao đổi. Tránh thanh toán ngoài nền tảng.',
      category: 'Mua hàng',
    },
    {
      q: 'Quy trình đổi trả',
      a: 'Gửi yêu cầu trong 3 ngày kể từ khi nhận hàng kèm video mở hộp. Chúng tôi sẽ phối hợp người bán xử lý trong 3 ngày làm việc.',
      category: 'Mua hàng',
    },
    {
      q: 'Làm sao kiểm tra tình trạng đơn hàng?',
      a: 'Vào mục Đơn mua để xem trạng thái vận chuyển theo thời gian thực. Bạn cũng có thể nhận thông báo qua email.',
      category: 'Mua hàng',
    },
    {
      q: 'Giao dịch an toàn khi gặp trực tiếp',
      a: 'Hẹn ở nơi công cộng, đi cùng người thân, kiểm tra kỹ sản phẩm và chỉ thanh toán khi đã hài lòng.',
      category: 'Mua hàng',
    },
    {
      q: 'Quy tắc đăng tin bán hàng',
      a: 'Mô tả trung thực, hình ảnh thật, không vi phạm pháp luật và bản quyền. Tin vi phạm có thể bị gỡ bỏ.',
      category: 'Bán hàng',
    },
    {
      q: 'Tối ưu tin đăng để bán nhanh',
      a: 'Chọn tiêu đề rõ ràng, mô tả chi tiết, ảnh sắc nét nhiều góc, đặt giá cạnh tranh và phản hồi tin nhắn nhanh.',
      category: 'Bán hàng',
    },
    {
      q: 'Phí hoa hồng và rút tiền',
      a: 'Phí hoa hồng áp dụng theo bảng giá. Số dư có thể rút về tài khoản ngân hàng đã xác minh trong 1-2 ngày làm việc.',
      category: 'Bán hàng',
    },
    {
      q: 'Phí dịch vụ',
      a: 'Một số dịch vụ có thể thu phí theo bảng giá công khai. Tất cả thanh toán thông qua cổng thanh toán an toàn.',
      category: 'Thanh toán',
    },
    {
      q: 'Hỗ trợ phương thức thanh toán nào?',
      a: 'Thẻ ngân hàng, ví điện tử và chuyển khoản nhanh. Mọi giao dịch đều được mã hoá và tuân thủ tiêu chuẩn an toàn.',
      category: 'Thanh toán',
    },
    {
      q: 'Thanh toán bị trừ tiền nhưng đơn không tạo?',
      a: 'Đừng lo, tiền sẽ tự hoàn sau 1-3 ngày làm việc. Nếu quá thời gian, vui lòng liên hệ Hỗ trợ kèm chứng từ.',
      category: 'Thanh toán',
    },
    {
      q: 'Thời gian giao hàng',
      a: 'Tuỳ khu vực, thời gian dự kiến 1-5 ngày làm việc. Vui lòng theo dõi trạng thái đơn trong mục Đơn mua.',
      category: 'Vận chuyển',
    },
    {
      q: 'Kiểm hàng khi nhận',
      a: 'Bạn nên quay video mở hộp, kiểm tra ngoại hình và chức năng cơ bản trước khi xác nhận nhận hàng.',
      category: 'Vận chuyển',
    },
    {
      q: 'Phí vận chuyển được tính như thế nào?',
      a: 'Phí dựa trên trọng lượng/khối lượng và khoảng cách. Tổng phí hiển thị trước khi thanh toán để bạn chủ động lựa chọn.',
      category: 'Vận chuyển',
    },
  ];

  const categories = ['Tài khoản', 'Mua hàng', 'Bán hàng', 'Thanh toán', 'Vận chuyển'];
  const filteredFaqs = faqs.filter((f) => f.category === category);

  return (
    <main className={s.page}>
      <div className="container">
        <div className={s.hero}>
          <h1>Câu hỏi thường gặp</h1>
          <p className={s.lead}>Tổng hợp câu trả lời cho những thắc mắc phổ biến khi sử dụng nền tảng.</p>
          <div className={s.meta}>Cập nhật 08/2025</div>
        </div>

        <div className={s.contentSingle}>
          <section className={s.card}>
            <div className={s.chipRow}>
              {categories.map((c) => (
                <button
                  key={c}
                  className={`${s.chip} ${category === c ? s.chipActive : ''}`}
                  onClick={() => { setCategory(c); setActive(-1); }}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className={s.accordion}>
              {filteredFaqs.map((item, idx) => (
                <div className={s.item} key={item.q}>
                  <button className={s.q} onClick={() => setActive(active === idx ? -1 : idx)}>
                    <span>{idx + 1}. {item.q}</span>
                    <span>{active === idx ? '−' : '+'}</span>
                  </button>
                  {active === idx && (
                    <div className={s.a}>{item.a}</div>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default FAQ;


