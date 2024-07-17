/* eslint-disable no-console */
import axios, { AxiosError, AxiosResponse } from 'axios'
import { API_ROOT } from './utils/constants'

const instance = axios.create({
  baseURL: API_ROOT
})

instance.interceptors.request.use(
  function (config) {
    const tokenString = window.localStorage.getItem('access')
    let token = null

    if (tokenString) {
      try {
        token = JSON.parse(tokenString)
      } catch (e) {
        console.error('Error parsing token from localStorage', e)
      }
    }

    // Thiết lập header Authorization nếu có token
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    return config
  },
  function (error) {
    // Xử lý lỗi khi gửi request
    return Promise.reject(error)
  }
)

// Add a response interceptor
instance.interceptors.response.use(
  function (response: AxiosResponse) {
    // refresh token
    return response
  },
  function (error: AxiosError) {
    // Handle specific error cases
    if (error.response) {
      // Server responded with a status other than 200 range
      console.error('Response error:', error.response.data)
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request)
    } else {
      // Something else caused an error
      console.error('Error:', error.message)
    }
    return Promise.reject(error)
  }
)

export default instance
