import { configureStore } from '@reduxjs/toolkit'
import wordReducer from './word/wordSlice'
import flashCardReducer from './flashCard/flashCardSlice'

export const store = configureStore({
  reducer: {
    word: wordReducer,
    flashCard: flashCardReducer
  },
})
