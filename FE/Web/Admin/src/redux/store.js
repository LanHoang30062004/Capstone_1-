import { configureStore } from '@reduxjs/toolkit'
import wordReducer from './word/wordSlice'
import flashCardReducer from './flashCard/flashCardSlice'
import accountReducer from './account/accountSlice'
import topicReducer from './topic/topicSlice'

export const store = configureStore({
  reducer: {
    word: wordReducer,
    flashCard: flashCardReducer,
    account: accountReducer,
    topic: topicReducer
  },
})
