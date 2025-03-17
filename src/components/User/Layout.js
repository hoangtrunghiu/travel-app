import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import HeaderMenu from './HeaderMenu';
import 'bootstrap/dist/css/bootstrap.min.css';
import UserStyles from '@/components/UserStyles';
const { Footer } = Layout;

export default function UserLayout() {
   return (
      <UserStyles>
         <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className=" bg-white shadow-md">
               <HeaderMenu />
            </header>
            {/* Main Content */}
            <main>
               <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 text-center p-4 text-sm md:text-base">
               <Footer>© 2025 EuroTravel. All rights reserved.</Footer>
            </footer>
         </div>
      </UserStyles>
   );
}
