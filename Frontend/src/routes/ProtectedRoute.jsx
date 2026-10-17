import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) return null

  // Must be logged in
  if (!user) return <Navigate to="/login" replace />

  // Any logged-in role can VIEW protected pages
  // (UserRoute already restricts outer access to Users + guests)
  return children
}

export default ProtectedRoute