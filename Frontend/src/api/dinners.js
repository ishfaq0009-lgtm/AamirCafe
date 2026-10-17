import api from './axios.js'

export const getAllDinners = () =>
  api.get('/Dinner/AllDinners').then((r) => r.data)

export const getDinner = (id) =>
  api.get(`/Dinner/OneDinnerData?id=${id}`).then((r) => r.data)

export const createDinner = (formData) =>
  api
    .post('/Dinner/AddDinner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data)

export const updateDinner = (formData) =>
  api
    .post('/Dinner/UpdateDinner', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data)

export const deleteDinner = (id) =>
  api.post('/Dinner/DeleteDinner', { id }).then((r) => r.data)