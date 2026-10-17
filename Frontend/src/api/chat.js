import api from './axios.js'

export const sendChatMessage = (message, history) =>
  api.post('/Chat/Send', { message, history }).then((r) => r.data)