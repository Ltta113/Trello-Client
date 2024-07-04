/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit'
import { IBoard, ICard, IColumn } from '~/apis/type'
import instance from '~/axiosConfig'

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export interface BoardState {
  board: IBoard | undefined
  loading: boolean
  currentRequestId: undefined | string
}

const initialState: BoardState = {
  board: undefined,
  loading: false,
  currentRequestId: undefined
}
export const fetchBoardDetails: AsyncThunk<IBoard, string, any> =
  createAsyncThunk<IBoard, string>(
    'boards/fetchBoardDetails',
    async (boardId, thunkAPI) => {
      try {
        const response = await instance.get<IBoard>(`/v1/boards/${boardId}`)
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
    }
  )
export const createNewColumn: AsyncThunk<IColumn, any, any> = createAsyncThunk<
  IColumn,
  any
>('columns/createNewColumn', async (body, thunkAPI) => {
  try {
    const response = await instance.post<IColumn>('/v1/columns/', body)
    return response.data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})
export const createNewCard: AsyncThunk<ICard, any, any> = createAsyncThunk<
  ICard,
  any
>('cards/createNewColumn', async (body, thunkAPI) => {
  try {
    const response = await instance.post<ICard>('/v1/cards/', body)
    return response.data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})
const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchBoardDetails.pending, (state) => {
        state.board = undefined
        state.loading = true
      })
      .addCase(fetchBoardDetails.fulfilled, (state, action) => {
        state.board = action.payload
        state.loading = false
      })
      .addCase(createNewColumn.pending, (state) => {
        state.loading = true
      })
      .addCase(createNewColumn.fulfilled, (state, action) => {
        state.loading = false
        state.board?.columns.push(action.payload as never)
      })
      .addCase(createNewCard.pending, (state) => {
        state.loading = true
      })
      .addCase(createNewCard.fulfilled, (state, action) => {
        state.loading = false
        if (state.board && state.board.columns) {
          // Kiểm tra và thêm vào mảng cards của cột
          const columnIndex = state.board.columns.findIndex(
            (col) => col._id === action.payload.columnId
          )
          if (columnIndex !== -1) {
            state.board.columns[columnIndex].cards.push(action.payload as never)
          }
        }
      })
      .addMatcher<PendingAction>(
        (action) => action.type.endsWith('/pending'),
        (state, action) => {
          state.loading = true
          state.currentRequestId = action.meta.requestId
        }
      )
      .addMatcher<RejectedAction | FulfilledAction>(
        (action) =>
          action.type.endsWith('/rejected') ||
          action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (
            state.loading &&
            state.currentRequestId === action.meta.requestId
          ) {
            state.loading = false
            state.currentRequestId = undefined
          }
        }
      )
  }
})
const boardReducer = boardSlice.reducer

export default boardReducer
