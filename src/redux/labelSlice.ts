/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, AsyncThunk, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { IError, ILabel } from '~/apis/type'
import instance from '~/axiosConfig'

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export interface labelState {
  labels: ILabel[] | []
  label: ILabel | undefined
  openEdit: boolean
  loading: boolean
  success: boolean
  message: string
  error: IError | undefined
  currentRequestId: undefined | string
}

const initialState: labelState = {
  labels: [],
  label: undefined,
  openEdit: false,
  loading: false,
  success: false,
  message: '',
  error: undefined,
  currentRequestId: undefined
}

export const fetchLabelDetails: AsyncThunk<ILabel[], string, any> = createAsyncThunk<
  ILabel[],
  string
>('labels/fetchLabelDetails', async (boardId, thunkAPI) => {
  try {
    const response = await instance.get<ILabel[]>(`/v1/labels/all/${boardId}`)
    return response.data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})
export const createNewLabelAPI: AsyncThunk<ILabel, any, any> = createAsyncThunk<ILabel, any>(
  'labels/createLabel',
  async ({ dataUpdate }, thunkAPI) => {
    try {
      const response = await instance.post<ILabel>('/v1/labels', dataUpdate)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data as IError)
    }
  }
)
export const updateLabelAPI: AsyncThunk<ILabel, any, any> = createAsyncThunk<ILabel, any>(
  'labels/updateLabel',
  async ({ labelId, dataUpdate }, thunkAPI) => {
    try {
      const response = await instance.put<ILabel>(`/v1/labels/${labelId}`, dataUpdate)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data as IError)
    }
  }
)
export const deleteLabelAPI: AsyncThunk<string, any, any> = createAsyncThunk<string, any>(
  'labels/deleteLabel',
  async ({ labelId }, thunkAPI) => {
    try {
      const response = await instance.delete<string>(`/v1/labels/${labelId}`)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data as IError)
    }
  }
)
export const addLabelAPI: AsyncThunk<any, any, any> = createAsyncThunk<any, any>(
  'labels/addLabel',
  async ({ labelId, cardId }, thunkAPI) => {
    try {
      const response = await instance.put<ILabel>(`/v1/labels/add/${labelId}`, { cardId })
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data as IError)
    }
  }
)

const labelSlice = createSlice({
  name: 'label',
  initialState,
  reducers: {
    updatelabel: (state, action: PayloadAction<{ label: ILabel }>) => {
      const { label } = action.payload
      state.openEdit = !state.openEdit
      state.label = label
    },
    resetUpdateLabel: (state) => {
      state.openEdit = false
      state.label = undefined
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchLabelDetails.pending, (state) => {
        state.labels = []
        state.loading = true
      })
      .addCase(fetchLabelDetails.fulfilled, (state, action) => {
        state.labels = action.payload
        state.loading = false
      })
      .addCase(fetchLabelDetails.rejected, (state, action) => {
        state.labels = []
        state.loading = false
        state.error = action.payload as IError
      })
      .addCase(createNewLabelAPI.pending, (state) => {
        state.loading = true
      })
      .addCase(createNewLabelAPI.fulfilled, (state, action) => {
        state.loading = false
        state.labels?.push(action.payload as never)
      })
      .addCase(createNewLabelAPI.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as IError
      })
      .addCase(updateLabelAPI.pending, (state) => {
        state.loading = true
      })
      .addCase(updateLabelAPI.fulfilled, (state, action) => {
        state.loading = false
        if (state.labels) {
          const labelIdx = state.labels.findIndex(
            (labelId) => labelId._id === action.meta.arg.labelId
          )
          const data = action.meta.arg.dataUpdate
          if (data.title) state.labels[labelIdx].title = action.meta.arg.dataUpdate.title
          if (data.color) state.labels[labelIdx].color = action.meta.arg.dataUpdate.color
          if (data.listCard) state.labels[labelIdx].listCard = action.meta.arg.dataUpdate.listCard
        }
      })
      .addCase(updateLabelAPI.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as IError
      })
      .addCase(deleteLabelAPI.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteLabelAPI.fulfilled, (state, action) => {
        state.loading = false
        if (state.labels) {
          state.labels = state.labels.filter((label) => label._id !== action.meta.arg.labelId)
        }
      })
      .addCase(deleteLabelAPI.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as IError
      })
      .addCase(addLabelAPI.pending, (state) => {
        state.loading = true
      })
      .addCase(addLabelAPI.fulfilled, (state, action) => {
        state.loading = false
        if (state.labels) {
          const labelIdx = state.labels.findIndex(
            (labelId) => labelId._id === action.meta.arg.labelId
          )
          state.labels[labelIdx].listCard.push(action.meta.arg.cardId)
        }
      })
      .addCase(addLabelAPI.rejected, (state, action) => {
        state.loading = false
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
export const { updatelabel, resetUpdateLabel } = labelSlice.actions

const labelReducer = labelSlice.reducer

export default labelReducer
