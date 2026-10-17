import api from './axios.js'

export const createBooking = (data) =>
  api.post('/Booking/BookimgHall', data).then((r) => r.data)

export const getAllBookings = () =>
  api.get('/Booking/AllBookingHall').then((r) => r.data)

export const getMyBookings = (email) =>
  api.get('/Booking/MyBookings', { params: { email } }).then((r) => r.data)

export const getBookingById = (id) =>
  api.post('/Booking/UpdataBooking', { id }).then((r) => r.data)

export const updateBooking = (data) =>
  api.post('/Booking/BookingUpdataApi', data).then((r) => r.data)

export const updateBookingStatus = (id, status, adminNote = '') =>
  api
    .post('/Booking/UpdateStatus', { id, status, adminNote })
    .then((r) => r.data)

export const deleteBooking = (id) =>
  api.post('/Booking/AllDataDelete', { id }).then((r) => r.data)