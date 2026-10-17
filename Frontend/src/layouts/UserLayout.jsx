import { Outlet, useLocation } from 'react-router-dom'
import UserNavbar from '../components/UserNavbar.jsx'
import UserFooter from '../components/UserFooter.jsx'
import Chatbot from '../components/Chatbot.jsx' // ⭐ Added

const UserLayout = () => {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8E7]">
      <UserNavbar />
      <main className={`flex-grow ${isHome ? '' : 'pt-24'}`}>
        <Outlet />
      </main>
      <UserFooter />
      
      {/* ⭐ Floating Chatbot */}
      <Chatbot />
    </div>
  )
}

export default UserLayout