import api from './axios.js'

export const createDeliveryMan = (data) =>
  api.post('/user/CreateDeliveryMan', data).then((r) => r.data)

export const getAllDeliveryMen = () =>
  api.get('/user/AllDeliveryMen').then((r) => r.data)

export const deleteDeliveryMan = (id) =>
  api.post('/user/DeleteDeliveryMan', { id }).then((r) => r.data)

export const updateDeliveryMan = (formData) =>
  api
    .post('/user/UpdateDeliveryMan', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data)

export const updateMyProfile = (formData) =>
  api
    .post('/user/UpdateMyProfile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data)

export const updateDeliveryLocation = (id, lat, lng) =>
  api.post('/user/UpdateDeliveryLocation', { id, lat, lng }).then((r) => r.data)