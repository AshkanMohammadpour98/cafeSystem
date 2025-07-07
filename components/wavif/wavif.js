'use client';

import Wavify from 'react-wavify';

const menuItems = {
  'قهوه‌ها': [
    { name: 'اسپرسو', price: '۵۵٬۰۰۰ تومان' },
    { name: 'لاته', price: '۶۵٬۰۰۰ تومان' },
  ],
  'نوشیدنی سرد': [
    { name: 'آیس امریکانو', price: '۶۰٬۰۰۰ تومان' },
    { name: 'آیس موکا', price: '۷۰٬۰۰۰ تومان' },
  ],
  'کیک و دسر': [
    { name: 'چیزکیک', price: '۸۰٬۰۰۰ تومان' },
    { name: 'براونی', price: '۷۵٬۰۰۰ تومان' },
  ],
};

export default function MenuSection() {
  return (
    <div  style={{ position: 'relative' , height :'2rem', overflow: 'hidden' }}>
      {/* موج وارونه که از بالا می‌ریزه */}
      <Wavify
        fill="rgb(231 190 153)" // رنگ قهوه‌ای گرم
        paused={false}
        options={{
          height: 7,       // ارتفاع موج
          amplitude: 100,    // شدت بالا پایین
          speed: 0.19,      // سرعت حرکت
          points: 8,        // تعداد خم‌ها
        }}
        style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          transform: 'rotate(180deg)', // وارونه کردن موج
        }}
      />
    </div>
  );
}
