import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

/**
 * RoleRoute — restricts a route group to specific roles.
 *
 *  allowedRoles = ['Admin']                → only Admin
 *  allowedRoles = ['Delivery']             → only Delivery
 *  allowedRoles = ['User', 'guest']        → only User + unauthenticated guests
 *
 * Anything else is redirected to /login.
 */
const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user, loading } = useAuth()

  if (loading) return null

  // ---------- Not logged in ----------
  if (!user) {
    if (allowedRoles.includes('guest')) return children
    return <Navigate to="/login" replace />
  }

  // ---------- Logged in, but wrong role ----------
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default RoleRoute