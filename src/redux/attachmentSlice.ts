/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, AsyncThunk, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { IAttachment, IError } from '~/apis/type'
import instance from '~/axiosConfig'

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export interface attachmentState {
  attachments: IAttachment[] | []
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
  attachments: [],
  openEdit: false,
  attachmentIdUpdate: '',
  openDelete: false,
  attachmentIdDelete: '',
  loading: false,
  success: false,
  message: '',
  currentRequestId: undefined
}

export const fetchAttachmentByCardIdAPI: AsyncThunk<IAttachment[], string, any> = createAsyncThunk<IAttachment[], string>(
  'attachments/fetchAttachmentByCardId',
  async (cardId, thunkAPI) => {
    try {
      const response = await instance.get<IAttachment[]>(`/v1/attachments/all/${cardId}`)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data as IError)
    }
  }
)

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
      .addCase(fetchAttachmentByCardIdAPI.pending, (state) => {
        state.attachments = []
        state.loading = true
      })
      .addCase(fetchAttachmentByCardIdAPI.fulfilled, (state, action) => {
        state.attachments = action.payload
        state.loading = false
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
export const { updateAttachment, deleteAttachment } = attachmentSlice.actions

const attachmentReducer = attachmentSlice.reducer

export default attachmentReducer
