import { Routes, Route, Navigate } from 'react-router-dom'
import { useLenis } from './hooks/useLenis.js'
import { useAuth } from './context/AuthContext.jsx'

import UserLayout from './layouts/UserLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import DeliveryLayout from './layouts/DeliveryLayout.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx' 
import AdminRoute from './routes/AdminRoute.jsx'
import DeliveryRoute from './routes/DeliveryRoute.jsx'
import UserRoute from './routes/UserRoute.jsx'
import LoadingScreen from './components/LoadingScreen.jsx'

// Public pages
import Home from './pages/user/Home.jsx'
import AboutUs from './pages/user/AboutUs.jsx'
import Contact from './pages/user/Contact.jsx'
import FastFood from './pages/user/FastFood.jsx'
import Sweets from './pages/user/Sweets.jsx'
import Cafe from './pages/user/Cafe.jsx'
import Cakes from './pages/user/Cakes.jsx'
import Packages from './pages/user/Packages.jsx'
import Deals from './pages/user/Deals.jsx'
import DealDetail from './pages/user/DealDetail.jsx'
import ProductDetail from './pages/user/ProductDetail.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import NotFound from './pages/NotFound.jsx'

// User-only pages
import Booking from './pages/user/Booking.jsx'
import OrderPage from './pages/user/OrderPage.jsx'
import UserProfile from './pages/user/UserProfile.jsx'
import MyOrders from './pages/user/MyOrders.jsx'
import MyBookings from './pages/user/MyBookings.jsx'
import OrderTracking from './pages/user/OrderTracking.jsx'

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminBookings from './pages/admin/AdminBookings.jsx'
import UpdateBooking from './pages/admin/UpdateBooking.jsx'
import AddNewFood from './pages/admin/AddNewFood.jsx'
import AllFood from './pages/admin/AllFood.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import EditFood from './pages/admin/EditFood.jsx'
import ManageHallPackages from './pages/admin/ManageHallPackages.jsx'
import AddHallPackage from './pages/admin/AddHallPackage.jsx'
import EditHallPackage from './pages/admin/EditHallPackage.jsx'
import AdminDeliveryMen from './pages/admin/AdminDeliveryMen.jsx'
import ManageDeals from './pages/admin/ManageDeals.jsx'
import AddDeal from './pages/admin/AddDeal.jsx'
import EditDeal from './pages/admin/EditDeal.jsx'
import ManageDinners from './pages/admin/ManageDinners.jsx'
import AddDinner from './pages/admin/AddDinner.jsx'
import EditDinner from './pages/admin/EditDinner.jsx'

// Delivery pages
import DeliveryDashboard from './pages/delivery/DeliveryDashboard.jsx'
import DeliveryHistory from './pages/delivery/DeliveryHistory.jsx'
import DeliveryProfile from './pages/delivery/DeliveryProfile.jsx'

const App = () => {
  useLenis()
  const { loading } = useAuth()

  if (loading) return <LoadingScreen />

  return (
    <Routes>
      {/* ==================== AUTH ==================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/register" element={<Navigate to="/signup" replace />} />

      {/* ==================== ADMIN ==================== */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/bookings" replace />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="bookings/update/:id" element={<UpdateBooking />} />
        <Route path="packages" element={<ManageHallPackages />} />
        <Route path="add-package" element={<AddHallPackage />} />
        <Route path="edit-package/:id" element={<EditHallPackage />} />
        <Route path="food" element={<AllFood />} />
        <Route path="edit-food/:id" element={<EditFood />} />
        <Route path="add-food" element={<AddNewFood />} />
        <Route path="dinners" element={<ManageDinners />} />
        <Route path="add-dinner" element={<AddDinner />} />
        <Route path="edit-dinner/:id" element={<EditDinner />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="delivery-men" element={<AdminDeliveryMen />} />
        <Route path="deals" element={<ManageDeals />} />
        <Route path="add-deal" element={<AddDeal />} />
        <Route path="edit-deal/:id" element={<EditDeal />} />
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>

      {/* ==================== DELIVERY ==================== */}
      <Route
        path="/delivery"
        element={
          <DeliveryRoute>
            <DeliveryLayout />
          </DeliveryRoute>
        }
      >
        <Route index element={<DeliveryDashboard />} />
        <Route path="history" element={<DeliveryHistory />} />
        <Route path="profile" element={<DeliveryProfile />} />
      </Route>

      {/* ==================== PUBLIC + USER ==================== */}
      <Route
        path="/"
        element={
          <UserRoute>
            <UserLayout />
          </UserRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="contact" element={<Contact />} />
        <Route path="fast-food" element={<FastFood />} />
        <Route path="sweets" element={<Sweets />} />
        <Route path="cafe" element={<Cafe />} />
        <Route path="cakes" element={<Cakes />} />
        <Route path="packages" element={<Packages />} />
        <Route path="deals" element={<Deals />} />
        <Route path="deal/:id" element={<DealDetail />} />
        <Route path="product/:id" element={<ProductDetail />} />

        <Route
          path="booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
        <Route
          path="order"
          element={
            <ProtectedRoute>
              <OrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-orders"
          element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="my-bookings"
          element={
            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>
          }
        />
        <Route
          path="track-order/:id"
          element={
            <ProtectedRoute>
              <OrderTracking />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ==================== FALLBACK ==================== */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App