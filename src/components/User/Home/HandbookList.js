import React, { useState, useEffect } from 'react';
import { Carousel } from 'antd';
import styles from '@/assets/styles/EuropeCarousel.module.css';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import Background from './Background';
import clsx from 'clsx';

const data = [
   { id: 1, name: 'Đức', image: '/images/europe/germany.jpg', link: '/germany' },
   { id: 2, name: 'Ý', image: '/images/europe/italy.jpg', link: '/italy' },
   { id: 3, name: 'Thụy Sỹ', image: '/images/europe/thuysy.jpg', link: '/switzerland' },
   { id: 4, name: 'Pháp', image: '/images/europe/france.jpg', link: '/france' },
   { id: 5, name: 'Hà Lan', image: '/images/europe/halan.jpg', link: '/spain' },
];

const HandbookList = () => {
   const [currentIndex, setCurrentIndex] = useState(0);
   const [slidesToShow, setSlidesToShow] = useState(3); // Mặc định hiển thị 3 item
   const carouselRef = React.useRef(null);

   useEffect(() => {
      const handleResize = () => {
         if (window.innerWidth <= 768) {
            setSlidesToShow(2); // Mobile hiển thị 2 item
         } else {
            setSlidesToShow(3); // Desktop hiển thị 3 item
         }
      };

      handleResize(); // Gọi ngay khi component mount
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
   }, []);

   useEffect(() => {
      const interval = setInterval(() => {
         nextSlide();
      }, 4000);
      return () => clearInterval(interval);
   }, [currentIndex]);

   const prevSlide = () => {
      setCurrentIndex((prev) => (prev - 1 + data.length) % data.length);
      carouselRef.current.prev();
   };

   const nextSlide = () => {
      setCurrentIndex((prev) => (prev + 1) % data.length);
      carouselRef.current.next();
   };

   return (
      <Background image="/images/background/background-nhatban-scaled.jpg">
         <h2 className={clsx(styles.title, 'text-center mx-6')}>Cẩm nang du lịch cùng EuroTravel</h2>
         <div className={styles.carouselContainer}>
            <Carousel ref={carouselRef} dots={false} slidesToShow={slidesToShow} slidesToScroll={1} infinite draggable>
               {data.map((item) => (
                  <div key={item.id} className={styles.carouselItem}>
                     <a href={item.link}>
                        <div className={styles.imageContainer}>
                           <img src={item.image} alt={item.name} className={styles.image} />
                           <p className={styles.countryName}>{item.name}</p>
                        </div>
                     </a>
                  </div>
               ))}
            </Carousel>
            <button className={styles.prevButton} onClick={prevSlide}>
               <LeftOutlined />
            </button>
            <button className={styles.nextButton} onClick={nextSlide}>
               <RightOutlined />
            </button>
         </div>
      </Background>
   );
};

export default HandbookList;
