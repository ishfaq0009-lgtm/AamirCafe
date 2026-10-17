import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar.jsx'

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-[#FFF8E7] text-[#1A1A1A]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 sm:p-10 max-w-[1400px]">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout