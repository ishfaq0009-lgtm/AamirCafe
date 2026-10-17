import api from './axios.js'

export const updateMyProfile = (formData) =>
  api
    .post('/user/UpdateMyProfile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((r) => r.data)