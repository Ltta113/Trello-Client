/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { createSlice, AsyncThunk, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import { isEmpty } from 'lodash'
import { ICard, ICheckItem, ICheckList } from '~/apis/type'
import instance from '~/axiosConfig'
import { generatePlaceholderCI } from '~/utils/formatters'
import { mapOrder } from '~/utils/sort'

type GenericAsyncThunk = AsyncThunk<unknown, unknown, any>

type PendingAction = ReturnType<GenericAsyncThunk['pending']>
type RejectedAction = ReturnType<GenericAsyncThunk['rejected']>
type FulfilledAction = ReturnType<GenericAsyncThunk['fulfilled']>

export interface CardState {
  card: ICard | undefined
  cardId: string
  openDetail: boolean
  loading: boolean
  success: boolean
  message: string
  currentRequestId: undefined | string
}

const initialState: CardState = {
  card: undefined,
  cardId: '',
  openDetail: false,
  loading: false,
  success: false,
  message: '',
  currentRequestId: undefined
}

export const fetchCardDetails: AsyncThunk<ICard, string, any> = createAsyncThunk<ICard, string>(
  'cards/fetchCardDetails',
  async (cardId, thunkAPI) => {
    try {
      const response = await instance.get<ICard>(`/v1/cards/${cardId}`)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const createNewCheckList: AsyncThunk<ICheckList, any, any> = createAsyncThunk<
  ICheckList,
  any
>('checkLists/createCheckList', async (body, thunkAPI) => {
  try {
    const response = await instance.post<ICheckList>('/v1/checkLists', body)
    return response.data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})
export const createNewCheckItem: AsyncThunk<ICheckItem, any, any> = createAsyncThunk<
  ICheckItem,
  any
>('checkItems/createCheckItem', async (body, thunkAPI) => {
  try {
    const response = await instance.post<ICheckItem>('/v1/checkItems', body)
    return response.data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})
export const updateCheckItemAPI: AsyncThunk<ICheckItem, any, any> = createAsyncThunk<
  ICheckItem,
  any
>('checkItems/updateCheckItem', async ({ checkItemId, dataUpdate }, thunkAPI) => {
  try {
    const response = await instance.put<ICheckItem>(`/v1/checkItems/${checkItemId}`, dataUpdate)
    return response.data
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response.data)
  }
})
export const updateCheckList: AsyncThunk<ICheckList, any, any> = createAsyncThunk<ICheckList, any>(
  'checkLists/updateCheckList',
  async ({ checkListId, dataUpdate }, thunkAPI) => {
    try {
      const response = await instance.put<ICheckList>(`/v1/checkLists/${checkListId}`, dataUpdate)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const moveCheckList: AsyncThunk<ICard, { cardId: string; dataUpdate: any }, any> =
  createAsyncThunk<ICard, { cardId: string; dataUpdate: any }>(
    'cards/moveCheckList',
    async ({ cardId, dataUpdate }, thunkAPI) => {
      try {
        const response = await instance.put<ICard>(`/v1/cards/${cardId}`, dataUpdate)
        return response.data
      } catch (error: any) {
        return thunkAPI.rejectWithValue(error.response.data)
      }
    }
  )
export const moveCheckItemToDiffAPI: AsyncThunk<string, any, any> = createAsyncThunk<string, any>(
  'cards/moveCheckItemToDiff',
  async (dataUpdate, thunkAPI) => {
    try {
      const response = await instance.put<string>('/v1/cards/support/move_checkItem', dataUpdate)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)
export const deleteCheckListAPI: AsyncThunk<string, any, any> = createAsyncThunk<string, any>(
  'cards/deleteChecKList',
  async (checkListId, thunkAPI) => {
    try {
      const response = await instance.delete<string>(`/v1/checkLists/${checkListId}`)
      return response.data
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data)
    }
  }
)

const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    openCardDetail: (state, action: PayloadAction<any>) => {
      state.cardId = action.payload
      state.openDetail = true
    },
    closeCardDetail: (state) => {
      state.cardId = ''
      state.openDetail = false
    },
    updateDesc: (state, action: PayloadAction<any>) => {
      if (state.card?.description) state.card.description = action.payload
    },
    updateState: (state, action: PayloadAction<any>) => {
      const { card } = state
      const { checkItemId } = action.payload
      if (card?.checkLists) {
        const checkList = card.checkLists.find((checkList) =>
          checkList.listItemOrderIds.includes(checkItemId)
        )
        if (checkList) {
          const checkItem = checkList.checkItems.find((checkItem) => checkItem._id === checkItemId)

          if (checkItem) {
            checkItem.state = checkItem.state === 'incomplete' ? 'complete' : 'incomplete'
          }
        }
      }
    },
    updateCheckListState: (state, action: PayloadAction<any>) => {
      if (state.card && state.card.checkLists) {
        const checkListIdx = state.card.checkLists.findIndex(
          (checkList) => checkList._id === action.payload.checkListId
        )
        state.card.checkLists[checkListIdx].title = action.payload.title
      }
    },
    updateCheckItemState: (state, action: PayloadAction<any>) => {
      if (state.card && state.card.checkLists) {
        const checkListIdx = state.card.checkLists.findIndex(
          (checkList) => checkList._id === action.payload.checkListId
        )
        const checkItemIdx = state.card.checkLists[checkListIdx].checkItems.findIndex(
          (checkItem) => checkItem._id === action.payload.checkItemId
        )

        state.card.checkLists[checkListIdx].checkItems[checkItemIdx].title = action.payload.title
      }
    },
    moveCheckItemToDiffState: (state, action: PayloadAction<any>) => {
      const prevIndex = state.card?.checkLists.find(
        (checkList) => checkList._id === action.payload.prevCheckListId
      )
      const nextIndex = state.card?.checkLists.find(
        (checkList) => checkList._id === action.payload.nextCheckListId
      )
      if (prevIndex) {
        prevIndex.checkItems = prevIndex.checkItems.filter(
          (checkItem) => checkItem._id !== action.payload.checkItemId
        )
        if (isEmpty(prevIndex.checkItems)) {
          prevIndex.checkItems = [generatePlaceholderCI(prevIndex)]
        }
        prevIndex.listItemOrderIds = prevIndex.checkItems.map((checkItem) => checkItem._id)
      }
      if (nextIndex) {
        nextIndex.checkItems = nextIndex.checkItems.filter(
          (checkItem) => checkItem._id !== action.payload.checkItemId
        )
        nextIndex.checkItems = nextIndex.checkItems.toSpliced(action.payload.newCIIndex, 0, {
          ...action.payload.checkItemData,
          checkListId: nextIndex._id
        } as ICheckItem)
        nextIndex.checkItems = nextIndex.checkItems.filter(
          (checkItem) => !checkItem.FE_PlaceholderCheckList
        )

        nextIndex.listItemOrderIds = nextIndex.checkItems.map((checkItem) => checkItem._id)
      }
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchCardDetails.pending, (state) => {
        state.card = undefined
        state.loading = true
      })
      .addCase(fetchCardDetails.fulfilled, (state, action) => {
        state.card = action.payload
        state.loading = false
        state.cardId = action.payload._id
        if (state.card.checkLists && state.card.checkListOrderIds)
          state.card.checkLists = mapOrder(
            state.card.checkLists,
            state.card?.checkListOrderIds,
            '_id'
          )
        if (state.card?.checkLists)
          state.card?.checkLists.forEach((checkList) => {
            if (isEmpty(checkList.checkItems)) {
              checkList.checkItems = [generatePlaceholderCI(checkList)]
              checkList.listItemOrderIds = [generatePlaceholderCI(checkList)._id]
            } else {
              checkList.checkItems = mapOrder(
                checkList.checkItems,
                checkList.listItemOrderIds,
                '_id'
              )
            }
          })
      })
      .addCase(createNewCheckList.pending, (state) => {
        state.loading = true
      })
      .addCase(createNewCheckList.fulfilled, (state, action) => {
        state.loading = false
        state.card?.checkLists?.push(action.payload as never)
        state.card?.checkListOrderIds?.push(action.payload._id)
        if (state.card?.checkLists)
          state.card?.checkLists.forEach((checkList) => {
            if (isEmpty(checkList.checkItems)) {
              checkList.checkItems = [generatePlaceholderCI(checkList)]
              checkList.listItemOrderIds = [generatePlaceholderCI(checkList)._id]
            }
          })
      })
      .addCase(createNewCheckItem.pending, (state) => {
        state.loading = true
      })
      .addCase(createNewCheckItem.fulfilled, (state, action) => {
        state.loading = false
        const index = state.card?.checkLists.findIndex(
          (checkList) => checkList._id === action.payload.checkListId
        )

        if (index !== -1) {
          const checkList = state.card?.checkLists[index as number]
          checkList?.checkItems.push(action.payload as never)
          checkList?.listItemOrderIds.push(action.payload._id)
          if (checkList) {
            checkList.checkItems = checkList.checkItems?.filter(
              (checkItem) => !checkItem.FE_PlaceholderCheckList
            )
            checkList.listItemOrderIds = checkList.checkItems?.map((checkItem) => checkItem._id)
          }
        }
      })
      .addCase(moveCheckItemToDiffAPI.pending, (state) => {
        state.loading = true
      })
      .addCase(moveCheckItemToDiffAPI.fulfilled, (state, _action) => {
        state.loading = false
      })
      .addCase(updateCheckList.pending, (state) => {
        state.loading = true
      })
      .addCase(updateCheckList.fulfilled, (state, _action) => {
        state.loading = false
        // const index = state.card?.checkLists?.findIndex(
        //   (checkList) => checkList._id === action.payload._id
        // )
        // if (state.card?.checkLists)
        //   state.card.checkLists[index as number].listItemOrderIds = action.payload.listItemOrderIds
      })
      .addCase(updateCheckItemAPI.pending, (state) => {
        state.loading = true
      })
      .addCase(updateCheckItemAPI.fulfilled, (state, _action) => {
        state.loading = false
      })
      .addCase(moveCheckList.pending, (state) => {
        state.loading = true
      })
      .addCase(moveCheckList.fulfilled, (state, action) => {
        state.card = action.payload
        state.loading = false
        if (state.card.checkLists && state.card.checkListOrderIds) {
          state.card.checkListOrderIds = action.payload.checkListOrderIds as string[]
          state.card.checkLists = mapOrder(
            state.card?.checkLists,
            state.card?.checkListOrderIds,
            '_id'
          )
          state.card?.checkLists.forEach((checkList) => {
            if (isEmpty(checkList.checkItems)) {
              checkList.checkItems = [generatePlaceholderCI(checkList)]
              checkList.listItemOrderIds = [generatePlaceholderCI(checkList)._id]
            } else {
              checkList.checkItems = mapOrder(
                checkList.checkItems,
                checkList.listItemOrderIds,
                '_id'
              )
            }
          })
        }
      })
      .addCase(deleteCheckListAPI.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteCheckListAPI.fulfilled, (state, action) => {
        state.loading = false
        state.success = true
        if (state.card?.checkLists) {
          state.card.checkLists = state.card?.checkLists.filter((c) => c._id !== action.meta.arg)
          state.card.checkListOrderIds = state.card?.checkListOrderIds?.filter(
            (_id) => _id !== action.meta.arg
          )
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
  openCardDetail,
  closeCardDetail,
  updateDesc,
  updateState,
  moveCheckItemToDiffState,
  updateCheckListState,
  updateCheckItemState
} = cardSlice.actions

const cardReducer = cardSlice.reducer

export default cardReducer
