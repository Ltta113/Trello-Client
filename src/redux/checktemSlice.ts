/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, AsyncThunk, PayloadAction } from '@reduxjs/toolkit'

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export interface checkItemState {
  openEdit: boolean
  checkItemIdUpdate: string
  loading: boolean
  success: boolean
  message: string
  currentRequestId: undefined | string
}

const initialState: checkItemState = {
  openEdit: false,
  checkItemIdUpdate: '',
  loading: false,
  success: false,
  message: '',
  currentRequestId: undefined
}

const checkItemSlice = createSlice({
  name: 'checkItem',
  initialState,
  reducers: {
    updateCheckItem: (state, action: PayloadAction<{ checkItemId: string }>) => {
      const { checkItemId } = action.payload
      state.openEdit = state.checkItemIdUpdate !== checkItemId || !state.openEdit
      state.checkItemIdUpdate = checkItemId
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
export const { updateCheckItem } = checkItemSlice.actions

const checkItemReducer = checkItemSlice.reducer

export default checkItemReducer
