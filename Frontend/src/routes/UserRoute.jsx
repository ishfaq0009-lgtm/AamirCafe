import RoleRoute from './RoleRoute.jsx'

const UserRoute = ({ children }) => (
  <RoleRoute allowedRoles={['User', 'guest']}>{children}</RoleRoute>
)

export default UserRoute