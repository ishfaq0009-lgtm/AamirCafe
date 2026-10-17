import api from './axios.js'

export const getAllPackages = () =>
  api.get('/HallPackage/AllPackages').then((r) => r.data)

export const getActivePackages = () =>
  api.get('/HallPackage/ActivePackages').then((r) => r.data)

export const getPackage = (id) =>
  api.get(`/HallPackage/OnePackage/${id}`).then((r) => r.data)

export const createPackage = (data) =>
  api.post('/HallPackage/AddPackage', data).then((r) => r.data)

export const updatePackage = (data) =>
  api.post('/HallPackage/UpdatePackage', data).then((r) => r.data)

export const deletePackage = (id) =>
  api.post('/HallPackage/DeletePackage', { id }).then((r) => r.data)