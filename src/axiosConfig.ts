/* eslint-disable no-console */
import axios, { AxiosError, AxiosResponse } from 'axios'
import { API_ROOT } from './utils/constants'
import { jwtDecode } from 'jwt-decode'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

const instance = axios.create({
  baseURL: API_ROOT,
  withCredentials: true
})

instance.interceptors.request.use(
  async function (config) {
    const tokenString = window.localStorage.getItem('access')
    let token = null
    let isExpired = null

    if (tokenString) {
      try {
        token = JSON.parse(tokenString)
        const user = jwtDecode(token)
        isExpired = dayjs.unix(user.exp as number).diff(dayjs()) < 1
      } catch (e) {
        console.error('Error parsing token from localStorage', e)
      }
    }

    if (isExpired) {
      try {
        const response = await axios.post(`${API_ROOT}/v1/users/refreshToken/`, null, {
          withCredentials: true
        })

        const { newAccessToken } = response.data

        // Lưu trữ token mới
        window.localStorage.setItem('access', JSON.stringify(newAccessToken))
        token = newAccessToken // Cập nhật token mới
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 400) {
            toast.error('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại.')
          } else {
            console.error('Error refreshing token', error)
          }
        } else {
          console.error('Unexpected error occurred', error)
        }
        return Promise.reject(error)
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
