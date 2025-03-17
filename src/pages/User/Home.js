import React from 'react';
import MotionLayout from '@/components/User/MotionLayout';
import BannerSlider from '@/components/User/Home/BannerSlider';
import SearchTour from '@/components/User/Home/SearchTour';
import EuropeCarousel from '@/components/User/Home/EuropeCarousel';
import HandbookList from '@/components/User/Home/HandbookList';

export default function HomePage() {
   return (
      <>
         <BannerSlider />
         <br />
         <MotionLayout>
            <SearchTour />
         </MotionLayout>

         <MotionLayout>
            <EuropeCarousel />
         </MotionLayout>

         <MotionLayout>
            <HandbookList />
         </MotionLayout>

         <MotionLayout>
            <p>
               <img
                  alt="Tủ Thờ Gỗ Công Nghiệp MDF Melamine Giá Rẻ Thiết Kế Nhỏ Gọn Tinh Tế"
                  src="https://noithatviva.vn/tu-tho-go-cong-nghiep-mdf-melamine-gia-re-thiet-ke-nho-gon-tinh-te-5.jpg"
                  title="Tủ Thờ Gỗ Công Nghiệp MDF Melamine Giá Rẻ Thiết Kế Nhỏ Gọn Tinh Tế"
               />
            </p>
         </MotionLayout>
         <br />
         <MotionLayout>
            <p>
               <img
                  alt="Tủ Thờ Gỗ Công Nghiệp MDF Melamine Giá Rẻ Thiết Kế Nhỏ Gọn Tinh Tế"
                  src="https://noithatviva.vn/tu-tho-go-cong-nghiep-mdf-melamine-gia-re-thiet-ke-nho-gon-tinh-te-5.jpg"
                  title="Tủ Thờ Gỗ Công Nghiệp MDF Melamine Giá Rẻ Thiết Kế Nhỏ Gọn Tinh Tế"
               />
            </p>
         </MotionLayout>
         <br />
         <br />
         <br />
         <MotionLayout>
            <p>
               <img
                  alt="Tủ Thờ Gỗ Công Nghiệp MDF Melamine Giá Rẻ Thiết Kế Nhỏ Gọn Tinh Tế"
                  src="https://noithatviva.vn/tu-tho-go-cong-nghiep-mdf-melamine-gia-re-thiet-ke-nho-gon-tinh-te-5.jpg"
                  title="Tủ Thờ Gỗ Công Nghiệp MDF Melamine Giá Rẻ Thiết Kế Nhỏ Gọn Tinh Tế"
               />
            </p>
         </MotionLayout>
         <br />
         <MotionLayout>
            <p>
               <img
                  alt="Tủ Thờ Gỗ Công Nghiệp MDF Melamine Giá Rẻ Thiết Kế Nhỏ Gọn Tinh Tế"
                  src="https://noithatviva.vn/tu-tho-go-cong-nghiep-mdf-melamine-gia-re-thiet-ke-nho-gon-tinh-te-5.jpg"
                  title="Tủ Thờ Gỗ Công Nghiệp MDF Melamine Giá Rẻ Thiết Kế Nhỏ Gọn Tinh Tế"
               />
            </p>
         </MotionLayout>
      </>
   );
}
