/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, createAsyncThunk, AsyncThunk } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import { IBoard, ICard, IColumn } from '~/apis/type'
import instance from '~/axiosConfig'
import { generatePlaceholder } from '~/utils/formatters'
import { mapOrder } from '~/utils/sort'

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
export const updateBoardDetails: AsyncThunk<
  IBoard,
  { boardId: string; dataUpdate: any },
  any
> = createAsyncThunk<IBoard, { boardId: string; dataUpdate: any }>(
  'boards/updateBoardDetails',
  async ({ boardId, dataUpdate }, thunkAPI) => {
    try {
      const response = await instance.put<IBoard>(
        `/v1/boards/${boardId}`,
        dataUpdate
      )
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const updateColumnDetails: AsyncThunk<
  IColumn,
  { columnId: string; dataUpdate: any },
  any
> = createAsyncThunk<IColumn, { columnId: string; dataUpdate: any }>(
  'columns/updateColumnDetails',
  async ({ columnId, dataUpdate }, thunkAPI) => {
    try {
      const response = await instance.put<IColumn>(
        `/v1/columns/${columnId}`,
        dataUpdate
      )
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const moveCardToDiffColumnAPI: AsyncThunk<string, any, any> =
  createAsyncThunk<string, any>(
    'boards/moveCardToDiffColumn',
    async (dataUpdate, thunkAPI) => {
      try {
        const response = await instance.put<string>(
          '/v1/boards/support/moving_card',
          dataUpdate
        )
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
        state.board?.columns.forEach((column) => {
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholder(column)]
            column.cardOrderIds = [generatePlaceholder(column)._id]
          } else {
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })
      })
      .addCase(moveCardToDiffColumnAPI.fulfilled, (state, _action) => {
        state.loading = false
      })
      .addCase(updateBoardDetails.pending, (state) => {
        state.loading = true
      })
      .addCase(updateBoardDetails.fulfilled, (state, action) => {
        state.board = action.payload
        state.loading = false
        state.board?.columns.forEach((column) => {
          if (isEmpty(column.cards))
            column.cards = [generatePlaceholder(column)]
          column.cardOrderIds = [generatePlaceholder(column)._id]
        })
      })
      .addCase(updateColumnDetails.pending, (state) => {
        state.loading = true
      })
      .addCase(updateColumnDetails.fulfilled, (state, _action) => {
        state.loading = false
      })
      .addCase(createNewColumn.pending, (state) => {
        state.loading = true
      })
      .addCase(createNewColumn.fulfilled, (state, action) => {
        state.loading = false
        state.board?.columns?.push(action.payload as never)
        state.board?.columnOrderIds?.push(action.payload._id)
        state.board?.columns.forEach((column) => {
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholder(column)]
            column.cardOrderIds = [generatePlaceholder(column)._id]
          }
        })
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
            const column = state.board.columns[columnIndex]
            column.cards.push(action.payload as never)
            column.cardOrderIds.push(action.payload._id)
            column.cards = column.cards.filter(card => !card.FE_PlaceholderCard)
            column.cardOrderIds = column.cards.map(card => card._id)
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
