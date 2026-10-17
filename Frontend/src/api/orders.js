import api from './axios.js'

export const createOrder = (data) =>
  api.post('/Order/CreateOrderApi', data).then((r) => r.data)

export const getAllOrders = (status) =>
  api.get('/Order/AllOrders', { params: { status } }).then((r) => r.data)

export const getMyOrders = (userId) =>
  api.get('/Order/MyOrders', { params: { userId } }).then((r) => r.data)

export const getOrder = (id) =>
  api.get(`/Order/Order/${id}`).then((r) => r.data)

export const updateOrderStatus = (id, status, adminNote = '') =>
  api.post('/Order/UpdateStatus', { id, status, adminNote }).then((r) => r.data)

export const assignDelivery = (id, deliveryPersonId) =>
  api.post('/Order/AssignDelivery', { id, deliveryPersonId }).then((r) => r.data)

export const getAvailableForDelivery = () =>
  api.get('/Order/AvailableForDelivery').then((r) => r.data)

export const claimOrder = (orderId, deliveryPersonId) =>
  api.post('/Order/ClaimOrder', { orderId, deliveryPersonId }).then((r) => r.data)

export const getMyDeliveries = (deliveryPersonId) =>
  api.get('/Order/MyDeliveries', { params: { deliveryPersonId } }).then((r) => r.data)

export const updateOrderLocation = (orderId, lat, lng) =>
  api.post('/Order/UpdateLocation', { orderId, lat, lng }).then((r) => r.data)

export const markDelivered = (orderId) =>
  api.post('/Order/MarkDelivered', { orderId }).then((r) => r.data)