/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, createAsyncThunk, AsyncThunk, PayloadAction } from '@reduxjs/toolkit'
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
  success: boolean
  message: string
  currentRequestId: undefined | string
}

const initialState: BoardState = {
  board: undefined,
  loading: false,
  success: false,
  message: '',
  currentRequestId: undefined
}
export const fetchBoardDetails: AsyncThunk<IBoard, string, any> = createAsyncThunk<IBoard, string>(
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
export const updateBoardDetails: AsyncThunk<IBoard, { boardId: string; dataUpdate: any }, any> =
  createAsyncThunk<IBoard, { boardId: string; dataUpdate: any }>(
    'boards/updateBoardDetails',
    async ({ boardId, dataUpdate }, thunkAPI) => {
      try {
        const response = await instance.put<IBoard>(`/v1/boards/${boardId}`, dataUpdate)
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
    }
  )
export const updateColumnDetails: AsyncThunk<IColumn, { columnId: string; dataUpdate: any }, any> =
  createAsyncThunk<IColumn, { columnId: string; dataUpdate: any }>(
    'columns/updateColumnDetails',
    async ({ columnId, dataUpdate }, thunkAPI) => {
      try {
        const response = await instance.put<IColumn>(`/v1/columns/${columnId}`, dataUpdate)
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
    }
  )
export const moveCardToDiffColumnAPI: AsyncThunk<string, any, any> = createAsyncThunk<string, any>(
  'boards/moveCardToDiffColumn',
  async (dataUpdate, thunkAPI) => {
    try {
      const response = await instance.put<string>('/v1/boards/support/moving_card', dataUpdate)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const createNewColumn: AsyncThunk<IColumn, any, any> = createAsyncThunk<IColumn, any>(
  'columns/createNewColumn',
  async (body, thunkAPI) => {
    try {
      const response = await instance.post<IColumn>('/v1/columns/', body)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const deleteColumn: AsyncThunk<string, string, any> = createAsyncThunk<string, any>(
  'columns/deleteColumn',
  async (columnId, thunkAPI) => {
    try {
      const response = await instance.delete<string>(`/v1/columns/${columnId}`)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const createNewCard: AsyncThunk<ICard, any, any> = createAsyncThunk<ICard, any>(
  'cards/createNewColumn',
  async (body, thunkAPI) => {
    try {
      const response = await instance.post<ICard>('/v1/cards/', body)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const updateCardDetails: AsyncThunk<ICard, { cardId: string; dataUpdate: any }, any> =
  createAsyncThunk<ICard, { cardId: string; dataUpdate: any }>(
    'cards/updateCardDetails',
    async ({ cardId, dataUpdate }, thunkAPI) => {
      try {
        const response = await instance.put<ICard>(`/v1/cards/${cardId}`, dataUpdate)
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
    }
  )
const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    updateMoveDiffState: (state, action: PayloadAction<any>) => {
      const nextActiveColumn = state.board?.columns.find(
        (column) => column._id === action.payload.prevColumnId
      )
      const nextOverColumn = state.board?.columns.find(
        (column) => column._id === action.payload.nextColumnId
      )
      if (nextActiveColumn) {
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== action.payload.cardId
        )
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholder(nextActiveColumn)]
        }
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map((card) => card._id)
      }
      if (nextOverColumn) {
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== action.payload.cardId
        )
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(action.payload.newCardIndex, 0, {
          ...action.payload.cardData,
          columnId: nextOverColumn._id
        } as ICard)
        nextOverColumn.cards = nextOverColumn.cards.filter((card) => !card.FE_PlaceholderCard)

        nextOverColumn.cardOrderIds = nextOverColumn.cards.map((card) => card._id)
      }
    },
    updateMoveOneState: (state, action: PayloadAction<any>) => {
      const columnIndex = state.board?.columns.findIndex(
        (column) => column._id === action.payload.columnId
      )
      if (columnIndex)
        if (state.board && state.board.columns && state.board.columns[columnIndex]) {
          state.board.columns[columnIndex].cardOrderIds = action.payload.listIdCardSorted
          state.board.columns[columnIndex].cards = action.payload.listCardSorted
        }
    },
    updateMoveColumnState: (state, action: PayloadAction<any>) => {
      if (state.board && state.board.columns) {
        state.board.columns = action.payload.listColumn
        state.board.columnOrderIds = action.payload.listColumnIds
        state.board?.columns.forEach((column) => {
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholder(column)]
            column.cardOrderIds = [generatePlaceholder(column)._id]
          } else {
            // column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })
      }
    },
    updateColumnState: (state, action: PayloadAction<any>) => {
      if (state.board && state.board.columns) {
        const columnIdx = state.board.columns.findIndex((c) => c._id === action.payload.columnId)
        state.board.columns[columnIdx].title = action.payload.title
      }
    },
    updateCardState: (state, action: PayloadAction<any>) => {
      if (state.board && state.board.columns) {
        const columnIdx = state.board.columns.findIndex(
          (column) => column._id === action.payload.columnId
        )
        const cardIdx = state.board.columns[columnIdx].cards.findIndex(
          (card) => card._id === action.payload.cardId
        )
        state.board.columns[columnIdx].cards[cardIdx].title = action.payload.title
      }
    }
  },
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
        if (state.board.columns && state.board.columnOrderIds)
          state.board.columns = mapOrder(state.board?.columns, state.board?.columnOrderIds, '_id')
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
        if (state.board.columns && state.board.columnOrderIds)
          state.board.columns = mapOrder(state.board?.columns, state.board?.columnOrderIds, '_id')
        state.board?.columns.forEach((column) => {
          if (isEmpty(column.cards)) {
            column.cards = [generatePlaceholder(column)]
            column.cardOrderIds = [generatePlaceholder(column)._id]
          } else {
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })
      })
      .addCase(updateColumnDetails.pending, (state) => {
        state.loading = true
      })
      .addCase(updateColumnDetails.fulfilled, (state, _action) => {
        state.loading = false
      })
      .addCase(updateCardDetails.pending, (state) => {
        state.loading = true
      })
      .addCase(updateCardDetails.fulfilled, (state, action) => {
        state.loading = false
        const columnIdx = state.board?.columns.findIndex((c) => c._id === action.payload.columnId)
        if (state.board && state.board.columns[columnIdx as number]) {
          const cardIdx = state.board?.columns[columnIdx as number].cards.findIndex(
            (c) => c._id === action.payload._id
          )
          if (action.meta.arg.dataUpdate.title)
            state.board.columns[columnIdx as number].cards[cardIdx].title =
              action.meta.arg.dataUpdate.title
        }
      })
      .addCase(deleteColumn.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteColumn.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        if (state.board?.columns) {
          state.board.columns = state.board?.columns.filter((c) => c._id !== action.meta.arg)
          state.board.columnOrderIds = state.board?.columnOrderIds?.filter(
            (_id) => _id !== action.meta.arg
          )
        }
      })
      .addCase(deleteColumn.rejected, (state, _action) => {
        state.success = false
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
            column.cards = column.cards.filter((card) => !card.FE_PlaceholderCard)
            column.cardOrderIds = column.cards.map((card) => card._id)
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
export const {
  updateMoveDiffState,
  updateMoveOneState,
  updateMoveColumnState,
  updateColumnState,
  updateCardState
} = boardSlice.actions

const boardReducer = boardSlice.reducer

export default boardReducer
