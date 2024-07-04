import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import boardReducer from './boardSlice'

export const store = configureStore({
  reducer: { board: boardReducer },
  middleware: getDefaultMiddleware => getDefaultMiddleware()
})

// Lấy RootState và AppDispatch từ store của chúng ta
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
