import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import boardReducer from './boardSlice'
import cardReducer from './cardSlice'
import checkListReducer from './checkListSlice'
import checkItemReducer from './checktemSlice'
import commentReducer from './commentSlide'
import userReducer from './userSlice'
import labelReducer from './labelSlice'
import attachmentReducer from './attachmentSlice'

export const store = configureStore({
  reducer: {
    attachment: attachmentReducer,
    label: labelReducer,
    user: userReducer,
    checkItem: checkItemReducer,
    board: boardReducer,
    card: cardReducer,
    checkList: checkListReducer,
    comment: commentReducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
})

// Lấy RootState và AppDispatch từ store của chúng ta
export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
