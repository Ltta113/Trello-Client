/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, AsyncThunk, PayloadAction } from '@reduxjs/toolkit'

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export interface CheckListState {
  openDelete: boolean
  openEdit: boolean
  openAddCheckItem: boolean
  checkListIdDelete: string
  checkListIdAdd: string
  checkListIdUpate: string
  loading: boolean
  success: boolean
  message: string
  currentRequestId: undefined | string
}

const initialState: CheckListState = {
  openDelete: false,
  openEdit: false,
  openAddCheckItem: false,
  checkListIdDelete: '',
  checkListIdAdd: '',
  checkListIdUpate: '',
  loading: false,
  success: false,
  message: '',
  currentRequestId: undefined
}

const checkListSlice = createSlice({
  name: 'checkList',
  initialState,
  reducers: {
    deleteStatus: (state, action: PayloadAction<{ checkListId: string }>) => {
      const { checkListId } = action.payload
      state.openDelete = state.checkListIdDelete !== checkListId || !state.openDelete
      state.checkListIdDelete = checkListId
    },
    openAddCheckItem: (state, action: PayloadAction<{ checkListId: string }>) => {
      const { checkListId } = action.payload
      state.openAddCheckItem = state.checkListIdAdd !== checkListId || !state.openAddCheckItem
      state.checkListIdAdd = checkListId
    },
    updateStatus: (state, action: PayloadAction<{ checkListId: string }>) => {
      const { checkListId } = action.payload
      state.openEdit = state.checkListIdUpate !== checkListId || !state.openEdit
      state.checkListIdUpate = checkListId
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
export const { deleteStatus, openAddCheckItem, updateStatus } = checkListSlice.actions

const checkListReducer = checkListSlice.reducer

export default checkListReducer
