/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, AsyncThunk, PayloadAction } from '@reduxjs/toolkit'

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export interface attachmentState {
  openEdit: boolean
  attachmentIdUpdate: string
  openDelete: boolean
  attachmentIdDelete: string
  loading: boolean
  success: boolean
  message: string
  currentRequestId: undefined | string
}

const initialState: attachmentState = {
  openEdit: false,
  attachmentIdUpdate: '',
  openDelete: false,
  attachmentIdDelete: '',
  loading: false,
  success: false,
  message: '',
  currentRequestId: undefined
}

const attachmentSlice = createSlice({
  name: 'attachment',
  initialState,
  reducers: {
    updateAttachment: (state, action: PayloadAction<{ attachmentId: string }>) => {
      const { attachmentId } = action.payload
      state.openEdit = state.attachmentIdUpdate !== attachmentId || !state.openEdit
      state.attachmentIdUpdate = attachmentId
    },
    deleteAttachment: (state, action: PayloadAction<{ attachmentId: string }>) => {
      const { attachmentId } = action.payload
      state.openDelete = state.attachmentIdDelete !== attachmentId || !state.openDelete
      state.attachmentIdDelete = attachmentId
    }
  },
  extraReducers(builder) {
    builder
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
export const { updateAttachment, deleteAttachment } = attachmentSlice.actions

const attachmentReducer = attachmentSlice.reducer

export default attachmentReducer
