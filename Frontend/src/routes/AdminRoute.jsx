import RoleRoute from './RoleRoute.jsx'

const AdminRoute = ({ children }) => (
  <RoleRoute allowedRoles={['Admin']}>{children}</RoleRoute>
)

export default AdminRoute