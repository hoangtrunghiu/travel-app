import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SearchOutlined, MenuOutlined, CloseOutlined, DownOutlined } from '@ant-design/icons';
import clsx from 'clsx';

const navLinks = [
   { name: 'Home', path: '/' },
   { name: 'Destinations', path: '/destinations' },
   {
      name: 'Tours',
      path: '#',
      submenu: [
         { name: 'Europe Tours', path: '/tours/europe' },
         { name: 'Asia Tours', path: '/tours/asia' },
         { name: 'America Tours', path: '/tours/america' },
      ],
   },
   { name: 'About', path: '/about' },
   { name: 'Contact', path: '/contact' },
];

const HeaderUser = () => {
   const [isScrolled, setIsScrolled] = useState(false);
   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
   const [activeSubmenu, setActiveSubmenu] = useState(null);

   useEffect(() => {
      const handleScroll = () => {
         if (window.scrollY > 60) {
            setIsScrolled(true);
         } else {
            setIsScrolled(false);
         }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   const toggleSubmenu = (index) => {
      if (activeSubmenu === index) {
         setActiveSubmenu(null);
      } else {
         setActiveSubmenu(index);
      }
   };

   return (
      <header
         className={clsx(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
            isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5',
         )}
      >
         <div className="container mx-auto px-4 flex items-center justify-between">
            <Link to="/" className="text-2xl font-heading font-bold text-travel-700 flex items-center">
               <span className="mr-2">✈️</span>
               <span className="bg-clip-text text-transparent bg-gradient-to-r from-travel-700 to-travel-500">
                  EuroTravel
               </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 items-center">
               {navLinks.map((link, index) => (
                  <div key={index} className="relative group">
                     {link.submenu ? (
                        <>
                           <button className="nav-link flex items-center" onClick={() => toggleSubmenu(index)}>
                              {link.name}

                              <DownOutlined className="ml-1 h-4 w-4" />
                           </button>
                           <div
                              className={clsx(
                                 'absolute top-full left-0 mt-1 w-48 bg-white shadow-lg rounded-md overflow-hidden transition-all duration-300 transform origin-top',
                                 activeSubmenu === index
                                    ? 'scale-y-100 opacity-100'
                                    : 'scale-y-0 opacity-0 pointer-events-none',
                              )}
                           >
                              {link.submenu.map((subItem, subIndex) => (
                                 <Link
                                    key={subIndex}
                                    to={subItem.path}
                                    className="block px-4 py-2 text-sm text-gray-800 hover:bg-travel-50 hover:text-travel-600 transition-colors"
                                 >
                                    {subItem.name}
                                 </Link>
                              ))}
                           </div>
                        </>
                     ) : (
                        <Link to={link.path} className="nav-link">
                           {link.name}
                        </Link>
                     )}
                  </div>
               ))}
               <button className="ml-3 p-2 rounded-full text-gray-600 hover:text-travel-600 hover:bg-gray-100 transition-colors">
                  <SearchOutlined className="h-5 w-5" />
               </button>
               <Link to="/booking" className="ml-4 btn-primary animate-fade-in">
                  Book Now
               </Link>
            </nav>

            {/* Mobile Navigation Toggle */}
            <button
               className="md:hidden p-2 text-gray-600 hover:text-travel-600 hover:bg-gray-100 rounded-lg transition-colors"
               onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
               {mobileMenuOpen ? <CloseOutlined className="h-6 w-6" /> : <MenuOutlined className="h-6 w-6" />}
            </button>
         </div>

         {/* Mobile Menu */}
         <div
            className={clsx(
               'fixed inset-0 top-[60px] z-40 bg-white transform transition-transform duration-300 ease-in-out md:hidden overflow-y-auto',
               mobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
            )}
         >
            <div className="container px-4 py-6">
               <nav className="flex flex-col space-y-4">
                  {navLinks.map((link, index) => (
                     <div key={index} className="py-2 border-b border-gray-100">
                        {link.submenu ? (
                           <>
                              <button
                                 className="flex items-center justify-between w-full text-left py-2 text-gray-800"
                                 onClick={() => toggleSubmenu(index)}
                              >
                                 <span>{link.name}</span>
                                 <DownOutlined
                                    className={clsx(
                                       'h-4 w-4 transition-transform',
                                       activeSubmenu === index ? 'rotate-180' : '',
                                    )}
                                 />
                              </button>
                              <div
                                 className={clsx(
                                    'transition-all duration-300 space-y-1 overflow-hidden',
                                    activeSubmenu === index ? 'max-h-48 py-2' : 'max-h-0',
                                 )}
                              >
                                 {link.submenu.map((subItem, subIndex) => (
                                    <Link
                                       key={subIndex}
                                       to={subItem.path}
                                       className="block pl-4 py-2 text-sm text-gray-600 hover:text-travel-600"
                                       onClick={() => setMobileMenuOpen(false)}
                                    >
                                       {subItem.name}
                                    </Link>
                                 ))}
                              </div>
                           </>
                        ) : (
                           <Link
                              to={link.path}
                              className="block py-2 text-gray-800 hover:text-travel-600"
                              onClick={() => setMobileMenuOpen(false)}
                           >
                              {link.name}
                           </Link>
                        )}
                     </div>
                  ))}
                  <Link to="/booking" className="btn-primary text-center mt-4" onClick={() => setMobileMenuOpen(false)}>
                     Book Now
                  </Link>
               </nav>
            </div>
         </div>
      </header>
   );
};

export default HeaderUser;
