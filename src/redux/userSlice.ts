/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { IError, IUser } from '~/apis/type'
import instance from '~/axiosConfig'
import { API_ROOT } from '~/utils/constants'

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export interface checkItemState {
  user: IUser | undefined
  loading: string | null
  status: string | null
  error: IError | undefined
  currentRequestId: undefined | string
}

const instance_2 = axios.create({
  baseURL: API_ROOT
})

const initialState: checkItemState = {
  user: undefined,
  loading: null,
  status: null,
  error: undefined,
  currentRequestId: undefined
}

export const loginUser: AsyncThunk<any, any, any> = createAsyncThunk<any, any>(
  'user/Login',
  async (body, thunkAPI) => {
    try {
      const response = await instance_2.post<any>('/v1/users/login', body)
      localStorage.setItem('access', JSON.stringify(response.data.accessToken))
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const signUpUser: AsyncThunk<any, any, any> = createAsyncThunk<any, any>(
  'user/SignUp',
  async (body, thunkAPI) => {
    try {
      const response = await instance_2.post<any>('/v1/users/', body)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const logoutUser = createAsyncThunk<any, void, any>('user/Logout', async (_, thunkAPI) => {
  try {
    const response = await instance.get<any>('/v1/users/logout')
    return response.data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})
export const getCurrent = createAsyncThunk<any, void, any>(
  'user/getCurrent',
  async (_, thunkAPI) => {
    try {
      const response = await instance.get<any>('/v1/users/current')
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const forgotPassword: AsyncThunk<any, any, any> = createAsyncThunk<any, any>(
  'user/forgotPassword',
  async (body, thunkAPI) => {
    try {
      const response = await instance.post<any>('/v1/users/forgotPassword', body)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const resetPassword: AsyncThunk<any, any, any> = createAsyncThunk<any, any>(
  'user/resetPassword',
  async (body, thunkAPI) => {
    try {
      const response = await instance.post<any>('/v1/users/confirmResetPassword', body)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const uploadAvatarAPI: AsyncThunk<IUser, any, any> = createAsyncThunk<IUser, any>(
  'user/uploadAvatarAPI',
  async (body, thunkAPI) => {
    try {
      const response = await instance.put<IUser>('/v1/users/avatar', body)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const deleteAvatarAPI = createAsyncThunk<IUser, void, any>(
  'user/deleteAvatarAPI',
  async (_, thunkAPI) => {
    try {
      const response = await instance.delete<IUser>('/v1/users/avatar')
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const updatedUserAPI: AsyncThunk<any, any, any> = createAsyncThunk<IUser, any>(
  'user/updatedUserAPI',
  async (body, thunkAPI) => {
    try {
      const response = await instance.put<IUser>('/v1/users/current', body)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const changePasswordAPI: AsyncThunk<any, { password: string; newPassword: string }, any> =
  createAsyncThunk('user/changePasswordAPI', async (body, thunkAPI) => {
    try {
      const response = await instance.put<any>('/v1/users/checkPassword', body)
      return response.data
    } catch (error: any) {
      // Sử dụng rejectWithValue để trả về lỗi
      return thunkAPI.rejectWithValue(error.response?.data || 'Đã xảy ra lỗi')
    }
  })

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.user = undefined
        state.loading = null
        state.status = null
        state.error = undefined
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.data
        state.loading = null
        state.status = 'login'
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = undefined
        state.loading = null
        state.status = null
        state.error = action.payload as IError
      })
      .addCase(signUpUser.pending, (state) => {
        state.user = undefined
        state.loading = 'register'
        state.status = null
        state.error = undefined
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = null
        state.status = action.payload
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = null
        state.status = null
        state.error = action.payload as IError
      })
      .addCase(getCurrent.pending, (state) => {
        state.user = undefined
        state.error = undefined
        state.loading = null
        state.status = null
      })
      .addCase(getCurrent.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = null
        state.status = null
      })
      .addCase(getCurrent.rejected, (state, action) => {
        state.user = undefined
        state.loading = null
        state.error = action.payload as IError
      })
      .addCase(uploadAvatarAPI.pending, (state) => {
        state.user = undefined
        state.error = undefined
        state.loading = null
        state.status = null
      })
      .addCase(uploadAvatarAPI.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = null
        state.status = null
      })
      .addCase(uploadAvatarAPI.rejected, (state, action) => {
        state.user = undefined
        state.loading = null
        state.error = action.payload as IError
      })
      .addCase(deleteAvatarAPI.pending, (state) => {
        state.user = undefined
        state.error = undefined
        state.loading = null
        state.status = null
      })
      .addCase(deleteAvatarAPI.fulfilled, (state, _action) => {
        if (state.user?.avatar) {
          state.user.avatar.contentType = ''
          state.user.avatar.url = ''
        }
        state.loading = null
        state.status = null
      })
      .addCase(deleteAvatarAPI.rejected, (state, action) => {
        state.user = undefined
        state.loading = null
        state.error = action.payload as IError
      })
      .addCase(updatedUserAPI.pending, (state) => {
        state.error = undefined
        state.loading = null
        state.status = null
      })
      .addCase(updatedUserAPI.fulfilled, (state, action) => {
        if (state.user) {
          if (action.meta.arg.firstname) state.user.firstname = action.meta.arg.firstname
          if (action.meta.arg.lastname) state.user.lastname = action.meta.arg.lastname
        }
        state.loading = null
        state.status = null
      })
      .addCase(updatedUserAPI.rejected, (state, action) => {
        state.user = undefined
        state.loading = null
        state.error = action.payload as IError
      })
      .addCase(logoutUser.pending, (state) => {
        state.user = undefined
        state.loading = null
        state.error = undefined
        state.status = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = undefined
        window.localStorage.removeItem('access')
        state.loading = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = null
        state.error = action.payload as IError
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith('/pending'),
        (state, action) => {
          state.loading = null
          state.currentRequestId = action.meta.requestId
        }
      )
      .addMatcher<RejectedAction | FulfilledAction>(
        (action) => action.type.endsWith('/rejected') || action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (state.loading && state.currentRequestId === action.meta.requestId) {
            state.loading = null
            state.currentRequestId = undefined
          }
        }
      )
  }
})
// export const { } = userSlice.actions

const userReducer = userSlice.reducer

export default userReducer
