/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, AsyncThunk, PayloadAction } from '@reduxjs/toolkit'

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export interface CommentState {
  openEdit: boolean
  openDelete: boolean
  commentIdUpdate: string
  commentIdDelete: string
  loading: boolean
  success: boolean
  message: string
  currentRequestId: undefined | string
}

const initialState: CommentState = {
  openEdit: false,
  openDelete: false,
  commentIdUpdate: '',
  commentIdDelete: '',
  loading: false,
  success: false,
  message: '',
  currentRequestId: undefined
}

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    updateComment: (state, action: PayloadAction<{ commentId: string }>) => {
      const { commentId } = action.payload
      state.openEdit = state.commentIdUpdate !== commentId || !state.openEdit
      state.commentIdUpdate = commentId
    },
    deleteCommentState: (state, action: PayloadAction<{ commentId: string }>) => {
      const { commentId } = action.payload
      state.openDelete = state.commentIdDelete !== commentId || !state.openDelete
      state.commentIdDelete = commentId
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
export const { updateComment, deleteCommentState } = commentSlice.actions

const commentReducer = commentSlice.reducer

export default commentReducer
