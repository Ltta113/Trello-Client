import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import boardReducer from './boardSlice'
import cardReducer from './cardSlice'
import checkListReducer from './checkListSlice'
import checkItemReducer from './checktemSlice'

export const store = configureStore({
  reducer: {
    checkItem: checkItemReducer,
    board: boardReducer,
    card: cardReducer,
    checkList: checkListReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
})

// Lấy RootState và AppDispatch từ store của chúng ta
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
