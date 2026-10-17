import api from './axios.js'

export const getAllDeals = () =>
  api.get('/Deal/AllDeals').then((r) => r.data)

export const getActiveDeals = () =>
  api.get('/Deal/ActiveDeals').then((r) => r.data)

export const getHotDeals = () =>
  api.get('/Deal/HotDeals').then((r) => r.data)

export const getDeal = (id) =>
  api.get(`/Deal/OneDeal/${id}`).then((r) => r.data)

export const createDeal = (data) =>
  api.post('/Deal/AddDeal', data).then((r) => r.data)

export const updateDeal = (data) =>
  api.post('/Deal/UpdateDeal', data).then((r) => r.data)

export const deleteDeal = (id) =>
  api.post('/Deal/DeleteDeal', { id }).then((r) => r.data)