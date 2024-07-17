/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit'
import { IError, IUser } from '~/apis/type'
import instance from '~/axiosConfig'

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export interface checkItemState {
  user: IUser | undefined
  loading: boolean
  success: boolean
  error: IError | undefined
  currentRequestId: undefined | string
}

const initialState: checkItemState = {
  user: undefined,
  loading: false,
  success: false,
  error: undefined,
  currentRequestId: undefined
}

export const loginUser: AsyncThunk<any, any, any> = createAsyncThunk<any, any>(
  'user/Login',
  async (body, thunkAPI) => {
    try {
      const response = await instance.post<any>('/v1/users/login', body)
      localStorage.setItem('access', JSON.stringify(response.data.accessToken))
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const logoutUser = createAsyncThunk<any, void, any>('user/Logouy', async (_, thunkAPI) => {
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.user = undefined
        state.loading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.data
        state.loading = false
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.user = undefined
        state.loading = true
        state.error = action.payload as IError
      })
      .addCase(getCurrent.pending, (state) => {
        state.user = undefined
        state.loading = true
      })
      .addCase(getCurrent.fulfilled, (state, action) => {
        state.user = action.payload
        state.loading = false
      })
      .addCase(getCurrent.rejected, (state, action) => {
        state.user = undefined
        state.loading = true
        state.error = action.payload as IError
      })
      .addCase(logoutUser.pending, (state) => {
        state.user = undefined
        state.loading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = undefined
        window.localStorage.removeItem('access')
        state.loading = false
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = true
        state.error = action.payload as IError
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith('/pending'),
        (state, action) => {
          state.loading = true
          state.currentRequestId = action.meta.requestId
        }
      )
      .addMatcher<RejectedAction | FulfilledAction>(
        (action) => action.type.endsWith('/rejected') || action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (state.loading && state.currentRequestId === action.meta.requestId) {
            state.loading = false
            state.currentRequestId = undefined
          }
        }
      )
  }
})
// export const { } = userSlice.actions

const userReducer = userSlice.reducer

export default userReducer
