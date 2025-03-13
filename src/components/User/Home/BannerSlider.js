import { Carousel } from 'antd';
import styles from '@/assets/styles/BannerSlider.module.css';

const images = [
   '/images/banner/banner-1.jpg',
   '/images/banner/banner-2.jpg',
   '/images/banner/banner-3.jpg',
   '/images/banner/banner-4.jpg',
];

const BannerSlider = () => {
   return (
      <div className={styles.sliderContainer}>
         <Carousel autoplay dots={true} className={styles.carousel}>
            {images.map((src, index) => (
               <div key={index} className={styles.slide}>
                  <img src={src} alt={`Slide ${index + 1}`} className={styles.image} />
               </div>
            ))}
         </Carousel>
      </div>
   );
};

export default BannerSlider;
