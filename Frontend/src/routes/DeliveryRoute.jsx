import RoleRoute from './RoleRoute.jsx'

const DeliveryRoute = ({ children }) => (
  <RoleRoute allowedRoles={['Delivery']}>{children}</RoleRoute>
)

export default DeliveryRoute