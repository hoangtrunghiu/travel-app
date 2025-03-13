import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import { DownOutlined, MenuOutlined, CloseOutlined } from '@ant-design/icons';
import './HeaderMenu.css';

const items = [
   { label: 'GIỚI THIỆU', key: 'about' },
   {
      label: (
         <>
            DU LỊCH CHÂU ÂU <DownOutlined className="menu-arrow" />
         </>
      ),
      key: 'europe',
      children: [
         { label: 'Du lịch Thụy Sĩ', key: 'europe:swiss' },
         { label: 'Du lịch Ý', key: 'europe:italy' },
      ],
   },
   { label: 'DU LỊCH MỸ', key: 'usa' },
   { label: 'DU LỊCH ÚC', key: 'australia' },
   { label: 'TOUR ĐỘC LẠ', key: 'unique' },
   {
      label: (
         <>
            GÓC KỶ NIỆM <DownOutlined className="menu-arrow" />
         </>
      ),
      key: 'memory',
      children: [
         { label: 'Ảnh lưu niệm', key: 'memory:photos' },
         { label: 'Video du lịch', key: 'memory:videos' },
      ],
   },
   { label: 'ẢNH DỊCH VỤ THỰC TẾ', key: 'real-images' },
   { label: 'CẨM NANG', key: 'guide' },
   { label: 'LIÊN HỆ', key: 'contact' },
];

const HeaderMenu = () => {
   const [current, setCurrent] = useState('');
   const [showStickyMenu, setShowStickyMenu] = useState(false);
   const [lastScrollY, setLastScrollY] = useState(0);
   const [isMobile, setIsMobile] = useState(window.innerWidth < 820);
   const [menuOpen, setMenuOpen] = useState(false);

   const onClick = (e) => {
      setCurrent(e.key);
      setMenuOpen(false); // Đóng menu khi chọn mục trên mobile
   };

   useEffect(() => {
      const handleScroll = () => {
         const currentScrollY = window.scrollY;
         const bannerHeight = document.querySelector('.header-banner')?.offsetHeight || 0;
         const menuHeight = document.querySelector('.menu-container')?.offsetHeight || 0;
         const triggerPoint = bannerHeight + menuHeight;

         if (currentScrollY > triggerPoint) {
            setShowStickyMenu(true);
         } else {
            setShowStickyMenu(false);
         }

         setLastScrollY(currentScrollY);
      };

      const handleResize = () => {
         setIsMobile(window.innerWidth <= 1024);
      };

      window.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);
      return () => {
         window.removeEventListener('scroll', handleScroll);
         window.removeEventListener('resize', handleResize);
      };
   }, [lastScrollY]);

   return (
      <div className="relative w-full">
         {/* Banner */}
         <div className="header-banner flex justify-around">
            <div>
               <a href="tel:+84889736851">
                  <img src="/images/hotline-1.png" alt="hotline" className="banner-img1 animate-zoom" />
               </a>
            </div>

            <div>
               <a href="/" className="banner-logo ">
                  <img src="/images/logo.png" alt="Euro Travel" />
               </a>
            </div>
            <div className="flex justify-end">
               <img src="/images/cup-2.png" alt="cup" className="banner-img1" />
               <img src="/images/cup.png" alt="cup" className="banner-img " />
               <img src="/images/cup-3.png" alt="cup" className="banner-img1 " />
            </div>
         </div>

         {/* Menu cho PC */}
         {!isMobile && (
            <div className="menu-container">
               <Menu
                  onClick={onClick}
                  selectedKeys={[current]}
                  mode="horizontal"
                  items={items}
                  className="custom-menu"
               />
            </div>
         )}

         {/* Menu dạng mobile */}
         {isMobile && (
            <>
               <div className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)}>
                  {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
               </div>
               <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                  <Menu onClick={onClick} selectedKeys={[current]} mode="inline" items={items} />
               </div>
            </>
         )}

         {/* Sticky Menu (PC) */}
         {!isMobile && (
            <div className={`sticky-menu ${showStickyMenu ? 'show' : 'hide'}`}>
               <Menu
                  onClick={onClick}
                  selectedKeys={[current]}
                  mode="horizontal"
                  items={items}
                  className="custom-menu"
               />
            </div>
         )}
      </div>
   );
};

export default HeaderMenu;
